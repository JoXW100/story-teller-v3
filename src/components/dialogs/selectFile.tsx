import { useCallback, useEffect, useState } from 'react'
import ReloadIcon from '@mui/icons-material/CachedSharp'
import CloseIcon from '@mui/icons-material/CloseSharp'
import Dialog from '.'
import Communication from 'utils/communication'
import Logger from 'utils/logger'
import Loading from 'components/loading'
import LocalizedText from 'components/localizedText'
import type { DocumentType } from 'structure/database'
import type { DocumentTypeMap } from 'structure/database/files/factory'
import type { DialogArgs } from 'types/dialog'
import styles from './style.module.scss'
import { Tooltip } from '@mui/material'

interface ISelectFileDialogState {
    selected: DocumentTypeMap[DocumentType] | null
    files: Array<DocumentTypeMap[DocumentType]>
    loading: boolean
    error: string | null
}

const SelectFileDialog: React.FC<DialogArgs<'selectFile'>> = ({ id, allowedTypes, callback }) => {
    const [state, setState] = useState<ISelectFileDialogState>({
        selected: null,
        files: [],
        loading: false,
        error: null
    })

    const handleClose = (): void => {
        callback('onClose')
    }

    const handleSelect = (): void => {
        if (state.selected !== null) {
            callback('onSelect', state.selected)
            callback('onClose')
        }
    }

    const loadContent = useCallback((): void => {
        setState((state) => {
            if (state.loading) {
                return state
            }

            Communication.getSubscribedFilesOfTypes(allowedTypes).then((response) => {
                if (response.success) {
                    setState((state) => ({ ...state, files: response.result, loading: false, error: null }))
                } else {
                    setState((state) => ({ ...state, files: [], loading: false, error: response.result }))
                }
            }, (error: unknown) => {
                Logger.throw('SelectFileDialog.loadContent', error)
                setState((state) => ({ ...state, files: [], loading: false, error: String(error) }))
            })

            return { ...state, files: [], loading: true, error: null }
        })
    }, [allowedTypes])

    useEffect(() => {
        loadContent()
    }, [loadContent])

    return (
        <Dialog id={id} onClose={handleClose}>
            <div className={styles.holder}>
                <div className={styles.dialogHeaderWithButtons}>
                    <LocalizedText className={styles.dialogHeaderText} id='dialog-selectFile-header'/>
                    <Tooltip title={<LocalizedText id='common-reload'/>}>
                        <span className='fill-height square'>
                            <button className='center-flex fill' id='selectFile-reload' onClick={loadContent} disabled={state.loading}>
                                <ReloadIcon className='small-icon'/>
                            </button>
                        </span>
                    </Tooltip>
                    <Tooltip title={<LocalizedText id='common-close'/>}>
                        <span className='fill-height square'>
                            <button className='center-flex fill' id='selectFile-close' onClick={handleClose}>
                                <CloseIcon className='small-icon'/>
                            </button>
                        </span>
                    </Tooltip>
                </div>
                <div className={styles.dialogBody}>
                    <Loading loaded={!state.loading}>
                        { state.files.map((file) => (
                            <button
                                key={file.id}
                                className={styles.fileItem}
                                disabled={file.id === state.selected?.id}
                                onClick={() => { setState((state) => ({ ...state, selected: file })) }}>
                                <span>{file.getTitle()}</span>
                            </button>
                        ))}
                        { state.files.length === 0 &&
                            <LocalizedText id='dialog-selectFile-noFiles'/>
                        }
                    </Loading>
                </div>
                <div className={styles.dialogButtonGroup}>
                    <button id='selectFile-button' onClick={handleSelect} disabled={state.selected === null}>
                        <LocalizedText id='dialog-selectFile-button' args={[state.selected?.getTitle() ?? '...']}/>
                    </button>
                </div>
            </div>
        </Dialog>
    )
}

export default SelectFileDialog
