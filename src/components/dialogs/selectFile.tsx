import { useCallback, useEffect, useState } from 'react'
import { Tooltip } from '@mui/material'
import ReloadIcon from '@mui/icons-material/CachedSharp'
import CloseIcon from '@mui/icons-material/CloseSharp'
import Dialog from '.'
import Communication from 'utils/communication'
import Logger from 'utils/logger'
import Loading from 'components/loading'
import LocalizedText from 'components/localizedText'
import SearchBar from 'components/layouts/searchBar'
import type { DocumentType } from 'structure/database'
import type { DocumentTypeMap } from 'structure/database/files/factory'
import type { DialogArgs } from 'types/dialog'
import styles from './style.module.scss'
import Error from 'components/error'

interface ISelectFileDialogState {
    selected: DocumentTypeMap[DocumentType] | null
    files: Array<DocumentTypeMap[DocumentType]>
    search: string
    loading: boolean
    error: string | null
}

const SelectFileDialog: React.FC<DialogArgs<'selectFile'>> = ({ id, allowedTypes, storyId, callback }) => {
    const [state, setState] = useState<ISelectFileDialogState>({
        selected: null,
        files: [],
        search: '',
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

    const setSearch = (search: string): void => {
        setState((state) => ({ ...state, search: search }))
    }

    const filterFiles = (file: (typeof state.files)[number]): boolean => {
        return file.getTitle().toLowerCase().includes(state.search.toLowerCase())
    }

    const loadContent = useCallback((): void => {
        setState((state) => {
            if (state.loading) {
                return state
            }

            Communication.getSubscribedFilesOfTypes(storyId, allowedTypes).then((response) => {
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
    }, [allowedTypes, storyId])

    useEffect(() => {
        loadContent()
    }, [loadContent])

    return (
        <Dialog id={id} onClose={handleClose}>
            <div className={styles.holder + ' ' + styles.fullWindow}>
                <Error error={state.error}>
                    <div className={styles.dialogHeaderWithButtons}>
                        <LocalizedText className={styles.dialogHeaderText} id='dialog-selectFile-header'/>
                        <SearchBar className='fill' value={state.search} onChange={setSearch}/>
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
                        <div>
                            <Loading loaded={!state.loading}>
                                { state.files.filter(filterFiles).map((file) => (
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
                    </div>
                    <div className={styles.dialogButtonGroup}>
                        <button id='selectFile-button' onClick={handleSelect} disabled={state.selected === null}>
                            <LocalizedText id='dialog-selectFile-button' args={[state.selected?.getTitle() ?? '...']}/>
                        </button>
                    </div>
                </Error>
            </div>
        </Dialog>
    )
}

export default SelectFileDialog
