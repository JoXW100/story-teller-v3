import { useEffect, useMemo, useState } from 'react'
import { Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/AddCircleOutlineSharp'
import CloseIcon from '@mui/icons-material/CloseSharp'
import FileIcon from '@mui/icons-material/InsertDriveFileSharp'
import FolderIcon from '@mui/icons-material/FolderSharp'
import ImportIcon from '@mui/icons-material/DownloadSharp'
import Dialog from '..'
import CreateFileContent from './createFileContent'
import CreateFolderContent from './createFolderContent'
import CreateImportContent from './createImportContent'
import LocalizedText from 'components/localizedText'
import { isKeyOf, keysOf } from 'utils'
import type { LanguageKey } from 'data'
import type { DocumentFileType } from 'structure/database'
import { type DialogArgs, InputType } from 'types/dialog'
import styles from './style.module.scss'

type CreateFilePopupCallback = (selected: CreateFilePopupData) => void

export type CreateContentProps = React.PropsWithRef<{
    callback: CreateFilePopupCallback
}>

export interface CreateFilePopupData {
    type: DocumentFileType
    name: string
    data: object
    file?: string | ArrayBuffer | null
}

export interface InputTypeData {
    icon: React.ReactNode
    text: LanguageKey
    width: number
    content: React.FC<CreateContentProps>
}

export const InputTypeDataMap = {
    [InputType.File]: {
        icon: <FileIcon/>,
        text: 'fileSystem-create-file-tooltips',
        width: 600,
        content: CreateFileContent
    },
    [InputType.Folder]: {
        icon: <FolderIcon/>,
        text: 'fileSystem-create-folder-tooltips',
        width: 600,
        content: CreateFolderContent
    },
    [InputType.Import]: {
        icon: <ImportIcon/>,
        text: 'fileSystem-create-import-tooltips',
        width: 1200,
        content: CreateImportContent
    }
} satisfies Record<InputType, InputTypeData>

const CreateFilePopup: React.FC<DialogArgs<'createFile'>> = ({ id, type, callback }): JSX.Element => {
    const [selected, setSelected] = useState<InputType>(InputType.File)

    const handleClose = (): void => {
        callback('onClose')
    }

    const handleCallback = (type: CreateFilePopupData): void => {
        callback('onConfirm', type)
    }

    useEffect(() => {
        setSelected(type)
    }, [type])

    const Content = useMemo(() => {
        if (isKeyOf(selected, InputTypeDataMap)) {
            document.documentElement.style.setProperty('--dialog-width', `${InputTypeDataMap[selected].width}px`)
            return InputTypeDataMap[selected]?.content
        }
        return null
    }, [selected])

    return (
        <Dialog id={id} onClose={handleClose}>
            <div className={styles.main}>
                <div className={styles.header}>
                    <div className='center-flex fill-height square'>
                        <AddIcon/>
                    </div>
                    <LocalizedText id='dialog-createFile-header'/>
                    <Tooltip placement='right' title={<LocalizedText id='dialog-createFile-closeTooltips'/>}>
                        <button className='center-flex fill-height square' onClick={close}>
                            <CloseIcon/>
                        </button>
                    </Tooltip>
                </div>
                <div className={styles.body}>
                    <div className={styles.navigation}>
                        { keysOf(InputTypeDataMap).map((key, index) => (
                            <Tooltip placement='left' key={index} title={<LocalizedText id={InputTypeDataMap[key].text}/>}>
                                <button
                                    className={styles.iconButton}
                                    onClick={() => { setSelected(key as InputType) }}
                                    data={key === selected ? 'open' : 'closed'}>
                                    {InputTypeDataMap[key].icon}
                                </button>
                            </Tooltip>
                        ))}
                    </div>
                    <div className={styles.content}>
                        { Content != null && <Content callback={handleCallback}/>}
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default CreateFilePopup
