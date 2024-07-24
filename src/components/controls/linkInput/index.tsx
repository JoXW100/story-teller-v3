import { useContext, useEffect, useState } from 'react'
import { Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/CloseSharp'
import SelectIcon from '@mui/icons-material/RadioButtonUncheckedSharp'
import { Context } from 'components/contexts/story'
import { openDialog } from 'components/dialogs/handler'
import LocalizedText from 'components/controls/localizedText'
import { asBooleanString, isEnum, isObjectId, isString } from 'utils'
import Communication from 'utils/communication'
import Logger from 'utils/logger'
import { DocumentType } from 'structure/database'
import type DatabaseFile from 'structure/database/files'
import styles from './styles.module.scss'

interface IComponentPropsBase {
    className?: string
    value?: string | null
    placeholder?: string
    disabled?: boolean
    allowedTypes: readonly DocumentType[]
    onChange?: (value: string) => void
    onFileChanged?: (value: DatabaseFile | null) => void
    onAdd?: (value: DatabaseFile) => void
    validateAdd?: (value: DatabaseFile) => boolean
}

interface IAllowTextComponentProps extends IComponentPropsBase {
    allowText: true
    validateText?: (value: string) => boolean
    parseText: (value: string) => DatabaseFile | null
}

interface IComponentProps extends IComponentPropsBase {
    allowText: false
}

type EditLinkInputComponentProps = React.PropsWithRef<IAllowTextComponentProps | IComponentProps>

interface EditLinkInputState {
    file: DatabaseFile | null
    highlight: boolean
}

const LinkInput: React.FC<EditLinkInputComponentProps> = (props) => {
    const [context] = useContext(Context)
    const [state, setState] = useState<EditLinkInputState>({
        file: null,
        highlight: false
    })

    const combinedClassName = props.className === undefined ? styles.main : `${props.className} ${styles.main}`

    const handleDragOver = (e: React.DragEvent<HTMLInputElement>): void => {
        if (isEnum(window.dragData?.file?.type, DocumentType) && (props.allowedTypes.includes(window.dragData.file.type))) {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    const handleDragEnter = (e: React.DragEvent<HTMLInputElement>): void => {
        if (isEnum(window.dragData?.file?.type, DocumentType) && (props.allowedTypes.includes(window.dragData.file.type))) {
            e.preventDefault()
            e.stopPropagation()
            setState({ ...state, highlight: true })
        }
    }

    const handleDragLeave = (e: React.DragEvent<HTMLInputElement>): void => {
        if (isEnum(window.dragData?.file?.type, DocumentType) && (props.allowedTypes.includes(window.dragData.file.type))) {
            e.preventDefault()
            setState({ ...state, highlight: false })
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLInputElement>): void => {
        if (isEnum(window.dragData?.file?.type, DocumentType) && (props.allowedTypes.includes(window.dragData.file.type))) {
            e.preventDefault()
            e.stopPropagation()
            const id = window.dragData.file?.id
            if (isObjectId(id)) {
                window.dragData.target = null
                window.dragData.file = null
                props.onChange?.(id)
            }
        }
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        props.onChange?.(e.target.value)
    }

    const handleSelect = (): void => {
        openDialog('selectFile', {
            id: 'linkInput.selectFile',
            storyId: context.story.id,
            allowedTypes: props.allowedTypes,
            sources: [...context.story.sources, context.story.id]
        }).onSelect((file) => {
            props.onChange?.(file.id)
        })
    }

    const handleAddClick = (): void => {
        if (state.file !== null && props.onAdd !== undefined) {
            props.onAdd(state.file)
        }
    }

    const handleClearClick = (): void => {
        setState((state) => ({ ...state, file: null }))
        props.onChange?.('')
    }

    useEffect(() => {
        setState((state) => {
            if (props.value !== undefined && props.value !== null) {
                return { ...state, text: props.value }
            }
            return state
        })
    }, [props.value])

    useEffect(() => {
        if (isObjectId(props.value)) {
            Communication.getFileOfTypes(props.value, props.allowedTypes).then((response) => {
                if (response.success) {
                    setState((state) => ({ ...state, file: response.result }))
                    props.onFileChanged?.(response.result)
                } else {
                    openDialog('notice', {
                        id: 'linkInput.getFile',
                        headerTextId: 'common-error',
                        bodyTextId: 'empty',
                        bodyTextArgs: [response.result ?? '']
                    }).onClose(() => { props.onFileChanged?.(null) })
                }
            }, (e: unknown) => {
                if (e instanceof Error) {
                    Logger.throw('LinkInput.getFileOfTypes', e.message)
                    openDialog('notice', {
                        id: 'linkInput.getFile',
                        headerTextId: 'common-error',
                        bodyTextId: 'empty',
                        bodyTextArgs: [e.message]
                    }).onClose(() => { props.onFileChanged?.(null) })
                    props.onFileChanged?.(null)
                } else {
                    Logger.throw('LinkInput.getFileOfTypes', e)
                    openDialog('notice', {
                        id: 'linkInput.getFile',
                        headerTextId: 'common-error',
                        bodyTextId: 'empty',
                        bodyTextArgs: [String(e)]
                    }).onClose(() => { props.onFileChanged?.(null) })
                }
            })
        } else if (props.allowText) {
            const file = props.parseText(props.value ?? '')
            setState((state) => ({ ...state, file: file }))
            props.onFileChanged?.(file)
        } else {
            setState((state) => ({ ...state, file: null }))
        }
    }, [props])

    return (
        <div className={combinedClassName}>
            { (state.file === null || (props.allowText && !isObjectId(props.value)))
                ? <>
                    <input
                        value={props.value ?? ''}
                        placeholder={props.placeholder}
                        onChange={handleChange}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDragEnter={handleDragEnter}
                        onDrop={handleDrop}
                        data={state.highlight ? 'highlight' : undefined}
                        disabled={props.disabled}
                        error={asBooleanString(isString(props.value) && props.value.length > 0 && (!props.allowText || !(props.validateText !== undefined && props.validateText(props.value))))}/>
                    <Tooltip title={<LocalizedText id='common-select'/>}>
                        <span>
                            <button className='center-flex fill-height square' disabled={props.disabled} onClick={handleSelect}>
                                <SelectIcon className='small-icon'/>
                            </button>
                        </span>
                    </Tooltip>
                </>
                : <>
                    <span className='fill center-vertical-flex'>{state.file?.getTitle() ?? '...'}</span>
                    <Tooltip title={<LocalizedText id='common-clear'/>}>
                        <span>
                            <button className='center-flex fill-height square' disabled={props.disabled} onClick={handleClearClick}>
                                <ClearIcon className='small-icon'/>
                            </button>
                        </span>
                    </Tooltip>
                </>
            }
            { props.onAdd !== undefined &&
                <Tooltip title={<LocalizedText id='common-add'/>}>
                    <span>
                        <button
                            className='center-flex fill-height square'
                            onClick={handleAddClick}
                            disabled={props.disabled === true || state.file === null || (props.validateAdd !== undefined && !props.validateAdd(state.file))}>
                            <AddIcon className='small-icon'/>
                        </button>
                    </span>
                </Tooltip>
            }
        </div>
    )
}

export default LinkInput
