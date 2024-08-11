import { useMemo } from 'react'
import { Tooltip } from '@mui/material'
import LinkInput from '../../controls/linkInput'
import DropdownMenu from '../dropdownMenu'
import ListTemplateMenu, { type ListTemplateComponentProps } from './template'
import { asBooleanString, asObjectId, isObjectId, keysOf } from 'utils'
import { useFilesOfType } from 'utils/hooks/files'
import type DatabaseStory from 'structure/database/story'
import type { DocumentType } from 'structure/database'
import type { DocumentTypeMap } from 'structure/database/files/factory'
import type { EnumValue, ObjectId } from 'types'

export interface ILinkRecordMenuTextProps {
    type: 'text'
    value: Record<ObjectId, string>
    defaultValue: string
    onChange?: (selection: Record<ObjectId, string>) => void
}

export interface ILinkRecordMenuNumberProps {
    type: 'number'
    value: Record<ObjectId, number>
    defaultValue: number
    onChange?: (selection: Record<ObjectId, number>) => void
}

export interface ILinkRecordMenuEnumProps {
    type: 'enum'
    defaultValue: EnumValue
    options: Record<EnumValue, React.ReactNode>
    value: Record<ObjectId, EnumValue>
    onChange?: (selection: Record<ObjectId, EnumValue>) => void
}

export interface ILinkRecordMenuButtonProps {
    type: 'button'
    defaultValue: object
    buttonTooltips?: string
    buttonContent?: React.ReactNode
    value: Record<ObjectId, object>
    onChange?: (selection: Record<ObjectId, EnumValue>) => void
    onClick?: (key: ObjectId, file: DocumentTypeMap[DocumentType] | null) => void
}

type LinkRecordMenuPropsType = ILinkRecordMenuTextProps |
ILinkRecordMenuNumberProps | ILinkRecordMenuEnumProps | ILinkRecordMenuButtonProps

type LinkRecordMenuProps = React.PropsWithRef<{
    story: DatabaseStory
    className?: string
    itemClassName?: string
    editClassName?: string
    allowedTypes: readonly DocumentType[]
    placeholder?: string
} & LinkRecordMenuPropsType>

type RecordMenuComponentProps = React.PropsWithRef<{
    story: DatabaseStory
    itemClassName?: string
    editClassName?: string
    ids: ObjectId[]
    files: Array<DocumentTypeMap[DocumentType] | null>
    allowedTypes: readonly DocumentType[]
    placeholder?: string
} & LinkRecordMenuPropsType>

function LinkRecordMenu(props: LinkRecordMenuProps): React.ReactNode {
    const ids = useMemo(() => keysOf(props.value), [props.value])
    const [files] = useFilesOfType(ids, props.allowedTypes)

    const handleChange = (newValues: Array<string | null>): void => {
        if (props.onChange === undefined) {
            return
        }

        const transferred: Record<ObjectId, any> = { }
        for (const key of newValues) {
            if (!isObjectId(key)) {
                continue
            }
            transferred[key] = props.value[key] ?? props.defaultValue
        }

        props.onChange(transferred)
    }

    const handleValidate = (value: string | null): boolean => {
        return isObjectId(value) && !(value in props.value)
    }

    return (
        <ListTemplateMenu<string | null, string | null, RecordMenuComponentProps>
            className={props.className}
            defaultValue=''
            values={ids}
            addLast
            createValue={asObjectId}
            onChange={handleChange}
            validateInput={handleValidate}
            Component={ItemComponent}
            EditComponent={EditComponent}
            params={{ ...props, ids: ids, files: files }}/>
    )
}

function ItemComponent({ index, params }: ListTemplateComponentProps<string | null, string | null, RecordMenuComponentProps>): React.ReactNode {
    const id = params.ids[index] ?? null
    const file = params.files[index] ?? null
    const value = params.value[id] ?? ''

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        switch (params.type) {
            case 'number':
                params.onChange?.({ ...params.value, [id]: Number(e.target.value) })
                break
            case 'text':
                params.onChange?.({ ...params.value, [id]: String(e.target.value) })
                break
            default:
                break
        }
    }

    const handleValueChanged = (value: string): void => {
        switch (params.type) {
            case 'enum':
                params.onChange?.({ ...params.value, [id]: value })
                break
        }
    }

    return (
        <div className={params.itemClassName} error={asBooleanString(file === null)}>
            <b>{ file !== null ? file.getTitle() : 'Error' }</b>
            { (params.type === 'text' || params.type === 'number') &&
                <input type={params.type} value={String(value)} onChange={handleChange}/>
            }
            { params.type === 'enum' &&
                <DropdownMenu
                    value={String(value)}
                    values={params.options}
                    onChange={handleValueChanged}/>
            }
            { params.type === 'button' &&
                <Tooltip title={params.buttonTooltips}>
                    <button onClick={() => params.onClick?.(id, file)}>
                        { params.buttonContent }
                    </button>
                </Tooltip>
            }
        </div>
    )
}

function EditComponent({ value, onUpdate, params }: ListTemplateComponentProps<string | null, string | null, RecordMenuComponentProps>): React.ReactNode {
    const handleFileChanged = (file: DocumentTypeMap[DocumentType] | null): void => {
        if (file !== null) {
            onUpdate('')
            switch (params.type) {
                case 'text':
                    params.onChange?.({ ...params.value, [file.id]: params.defaultValue })
                    break
                case 'number':
                    params.onChange?.({ ...params.value, [file.id]: params.defaultValue })
                    break
                case 'enum':
                    params.onChange?.({ ...params.value, [file.id]: params.defaultValue })
                    break
                case 'button':
                    params.onChange?.({ ...params.value, [file.id]: params.defaultValue })
                    break
            }
        }
    }

    return (
        <LinkInput
            className={params.editClassName}
            value={String(value)}
            story={params.story}
            allowText={false}
            allowedTypes={params.allowedTypes}
            placeholder={params.placeholder}
            onChange={onUpdate}
            onFileChanged={handleFileChanged}/>
    )
}

export default LinkRecordMenu
