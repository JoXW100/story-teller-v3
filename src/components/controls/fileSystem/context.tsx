import React, { useContext, useEffect, useMemo, useReducer } from 'react'
import { Context as StoryContext } from '../../contexts/story'
import Loading from 'components/controls/loading'
import { openDialog } from 'components/dialogs/handler'
import Logger from 'utils/logger'
import Communication from 'utils/communication'
import { DocumentType, FileType, FlagType } from 'structure/database'
import FileStructure from 'structure/database/fileStructure'
import type { ObjectId } from 'types'
import type { InputType } from 'types/dialog'
import type { DBResponse, IFileStructure } from 'types/database'
import type { ContextProvider, DispatchAction, DispatchActionWithDispatch } from 'types/context'
import { isEnum, isString } from 'utils'

export type FileFilter = Record<DocumentType, boolean> & {
    search: string
    showEmptyFolders: boolean
}

interface FileSystemContextState {
    loading: boolean
    showFilterMenu: boolean
    selected: ObjectId | null
    root: FileStructure
    filter: FileFilter
}

interface FileSystemDispatch {
    setFilter: (filter: FileFilter) => void
    openCreateFileMenu: (type: InputType, parent?: ObjectId | null) => void
    openDeleteFileMenu: (file: IFileStructure) => void
    openFilterMenu: () => void
    closeFilterMenu: () => void
    setFavoriteFile: (file: IFileStructure, favorite: boolean) => void
    moveFile: (file: IFileStructure, target?: IFileStructure | null) => void
    renameFile: (file: IFileStructure, newName: string) => void
    setFileOpen: (file: IFileStructure, open: boolean) => void
    copyFile: (file: IFileStructure, holderId?: ObjectId | null, newName?: string) => void
}

type FileSystemContextAction =
    DispatchAction<'init', ObjectId | null> |
    DispatchActionWithDispatch<'load', ObjectId, FileSystemContextAction> |
    DispatchAction<'updateName', IFileStructure> |
    DispatchAction<'updateOpen', IFileStructure> |
    DispatchAction<'updateFavorite', IFileStructure> |
    DispatchAction<'setFiles', DBResponse<FileStructure>> |
    DispatchAction<'setFilter', FileFilter> |
    DispatchAction<'setShowFilterMenu', boolean>

type FileSystemContextProvider = ContextProvider<FileSystemContextState, FileSystemDispatch>
type FileSystemContextProps = React.PropsWithChildren<{
    fileId: ObjectId | null
}>

function createDefaultFileFilter(): FileFilter {
    const documentToggles: Partial<Record<DocumentType, boolean>> = {}

    for (const type of Object.values(DocumentType)) {
        documentToggles[type] = true
    }

    return {
        search: '',
        showEmptyFolders: true,
        ...documentToggles as Record<DocumentType, boolean>
    } satisfies FileFilter
}

function createNextName(name: string): string {
    let num = 0
    const regex = /(.*) \(([0-9]+)\)$/
    const match = regex.exec(name)
    if (match != null) {
        const val = parseInt(match[2])
        num = isNaN(val) ? 0 : val
        name = match[1]
    }
    return `${name} (${num + 1})`
}

const defaultContextState = {
    loading: false,
    showFilterMenu: false,
    selected: null,
    root: null as any,
    filter: createDefaultFileFilter()
} satisfies FileSystemContextState

const defaultContextDispatch: FileSystemDispatch = {
    setFilter() {},
    openCreateFileMenu() {},
    openDeleteFileMenu() {},
    openFilterMenu() {},
    closeFilterMenu() {},
    moveFile() {},
    renameFile() {},
    copyFile() {},
    setFileOpen() {},
    setFavoriteFile() {}
}

export const Context = React.createContext<FileSystemContextProvider>([
    defaultContextState,
    defaultContextDispatch
])

const reducer: React.Reducer<FileSystemContextState, FileSystemContextAction> = (state, action) => {
    switch (action.type) {
        case 'init':
            return { ...state, selected: action.data }
        case 'load': {
            if (state.loading) {
                return state
            }
            Communication.getFileStructure(action.data).then((response) => {
                action.dispatch({ type: 'setFiles', data: response })
            }, (error: unknown) => {
                Logger.throw('FileSystemContext.load', error)
                action.dispatch({ type: 'setFiles', data: { success: false, result: String(error) } })
            })
            return { ...state, loading: true, error: null, root: null as any }
        }
        case 'setFiles': {
            const response = action.data
            if (response.success) {
                return { ...state, loading: false, root: response.result }
            } else {
                openDialog('notice', {
                    id: 'fileSystem.load',
                    headerTextId: 'common-error',
                    bodyTextId: 'fileSystem-dialog-load',
                    bodyTextArgs: [response.result ?? 'Unknown Error']
                })
                return { ...state, loading: false, root: null as any }
            }
        }
        case 'setFilter': {
            return { ...state, filter: action.data }
        }
        case 'setShowFilterMenu': {
            return { ...state, showFilterMenu: action.data }
        }
        case 'updateName': {
            Communication.updateFile(action.data.id, action.data.type, {
                'name': action.data.name
            }).then((response) => {
                if (!response.success || !response.result) {
                    Logger.error('FileSystem.updateName', response.result)
                    openDialog('notice', {
                        id: 'fileSystem.updateName',
                        headerTextId: 'common-error',
                        bodyTextId: 'fileSystem-dialog-update',
                        bodyTextArgs: [action.data.name, isString(response.result) ? response.result : 'Unknown Error']
                    })
                }
            }, (error: unknown) => {
                Logger.throw('FileSystem.updateName', error)
                openDialog('notice', {
                    id: 'fileSystem.updateName',
                    headerTextId: 'common-error',
                    bodyTextId: 'fileSystem-dialog-update',
                    bodyTextArgs: [action.data.name, String(error)]
                })
            })
            return { ...state, root: new FileStructure(state.root.updateContained(action.data)) }
        }
        case 'updateOpen': {
            Communication.updateFile(action.data.id, action.data.type, {
                'data.open': action.data.open
            }).then((response) => {
                if (!response.success || !response.result) {
                    Logger.warn('FileSystem.updateOpen', response.result)
                }
            }, (error: unknown) => {
                Logger.throw('FileSystem.updateOpen', error)
            })
            return { ...state, root: new FileStructure(state.root.updateContained(action.data)) }
        }
        case 'updateFavorite': {
            Communication.updateFile(action.data.id, action.data.type, {
                'flags': action.data.flags
            }).then((response) => {
                if (!response.success || !response.result) {
                    Logger.warn('FileSystem.updateFavorite', response.result)
                }
            }, (error: unknown) => {
                Logger.throw('FileSystem.updateFavorite', error)
            })
            return { ...state, root: new FileStructure(state.root.updateContained(action.data)) }
        }
        default:
            return state
    }
}

const FileSystemContext: React.FC<FileSystemContextProps> = ({ children, fileId }) => {
    const [context] = useContext(StoryContext)
    const [state, dispatch] = useReducer(reducer, defaultContextState)

    useEffect(() => {
        dispatch({ type: 'init', data: fileId })
    }, [fileId])

    useEffect(() => {
        dispatch({ type: 'load', data: context.story.id, dispatch: dispatch })
    }, [context.story.id])

    const memoisedDispatch = useMemo<FileSystemDispatch>(() => ({
        setFilter(value) { dispatch({ type: 'setFilter', data: value }) },
        openCreateFileMenu(type, parent = null) {
            openDialog('createFile', { id: 'createFileDialog', type: type }).onConfirm((data) => {
                Communication.addFile(context.story.id, parent ?? state.root?.id ?? null, data.name, data.type, data.data)
                    .then((response) => {
                        if (response.success) {
                            dispatch({ type: 'load', data: context.story.id, dispatch: dispatch })
                        } else {
                            Logger.error('FileSystem.addFile', response.result)
                            openDialog('notice', {
                                id: 'fileSystem.addFile',
                                headerTextId: 'common-error',
                                bodyTextId: 'fileSystem-dialog-addFile',
                                bodyTextArgs: [data.name, response.result ?? 'Unknown Error']
                            })
                        }
                    }, (error: unknown) => {
                        Logger.throw('FileSystem.addFile', error)
                        openDialog('notice', {
                            id: 'fileSystem.addFile',
                            headerTextId: 'common-error',
                            bodyTextId: 'fileSystem-dialog-addFile',
                            bodyTextArgs: [data.name, String(error)]
                        })
                    })
            })
        },
        openDeleteFileMenu(file) {
            openDialog('confirmation', {
                id: 'deleteFile',
                headerTextId: 'dialog-confirm-deletion-header',
                headerTextArgs: [`${file.name}.${file.type}`],
                bodyTextId: 'dialog-confirm-common-body'
            }).onConfirm(() => {
                Communication.deleteFile(file.id).then((response) => {
                    if (response.success && response.result) {
                        dispatch({ type: 'load', data: context.story.id, dispatch: dispatch })
                    } else {
                        Logger.error('FileSystem.deleteFile', response.result)
                        openDialog('notice', {
                            id: 'fileSystem.addFile',
                            headerTextId: 'common-error',
                            bodyTextId: 'fileSystem-dialog-addFile',
                            bodyTextArgs: [file.name, isString(response.result) ? response.result : 'Unknown Error']
                        })
                    }
                }, (error: unknown) => {
                    Logger.throw('FileSystem.deleteFile', error)
                    openDialog('notice', {
                        id: 'fileSystem.addFile',
                        headerTextId: 'common-error',
                        bodyTextId: 'fileSystem-dialog-addFile',
                        bodyTextArgs: [file.name, String(error)]
                    })
                })
            })
        },
        openFilterMenu() { dispatch({ type: 'setShowFilterMenu', data: true }) },
        closeFilterMenu() { dispatch({ type: 'setShowFilterMenu', data: false }) },
        moveFile(file, target = null) {
            target ??= state.root
            if (file.id === target.id || file.holderId === target.id) {
                return
            }
            Communication.moveFile(file.id, target?.id).then((response) => {
                if (response.success && response.result) {
                    dispatch({ type: 'load', data: context.story.id, dispatch: dispatch })
                } else {
                    Logger.error('FileSystem.moveFile', response.result)
                    openDialog('notice', {
                        id: 'fileSystem.moveFile',
                        headerTextId: 'common-error',
                        bodyTextId: 'fileSystem-dialog-moveFile',
                        bodyTextArgs: [file.name, isString(response.result) ? response.result : 'Unknown Error']
                    })
                }
            }, (error: unknown) => {
                Logger.throw('FileSystem.moveFile', error)
                openDialog('notice', {
                    id: 'fileSystem.moveFile',
                    headerTextId: 'common-error',
                    bodyTextId: 'fileSystem-dialog-moveFile',
                    bodyTextArgs: [file.name, String(error)]
                })
            })
        },
        renameFile(file, newName) {
            dispatch({ type: 'updateName', data: { ...file, name: newName } })
        },
        copyFile(file, holderId, name) {
            if (name === undefined) {
                name = createNextName(file.name)
            }
            Communication.copyFile(file.id, holderId ?? state.root.id, name).then((response) => {
                if (response.success && response.result) {
                    dispatch({ type: 'load', data: context.story.id, dispatch: dispatch })
                } else {
                    Logger.error('FileSystem.copyFile', response.result)
                    openDialog('notice', {
                        id: 'fileSystem.copyFile',
                        headerTextId: 'common-error',
                        bodyTextId: 'fileSystem-dialog-copyFile',
                        bodyTextArgs: [file.name, isString(response.result) ? response.result : 'Unknown Error']
                    })
                }
            }, (error: unknown) => {
                Logger.throw('FileSystem.copyFile', error)
                openDialog('notice', {
                    id: 'fileSystem.copyFile',
                    headerTextId: 'common-error',
                    bodyTextId: 'fileSystem-dialog-copyFile',
                    bodyTextArgs: [file.name, String(error)]
                })
            })
        },
        setFileOpen(file, open) {
            if (file.type === FileType.Folder) {
                dispatch({ type: 'updateOpen', data: { ...file, open: open } })
            } else {
                Logger.throw('fileSystem.setFileOpen', 'Invalid file type', file.type)
            }
        },
        setFavoriteFile(file, favorite) {
            if (isEnum(file.type, DocumentType)) {
                const flags: FlagType[] = []
                for (const flag of file.flags) {
                    if (flag !== FlagType.Favorite) {
                        flags.push(flag)
                    }
                }
                if (favorite) {
                    flags.push(FlagType.Favorite)
                }
                dispatch({ type: 'updateFavorite', data: { ...file, flags: flags } })
            } else {
                Logger.throw('fileSystem.setFavoriteFile', 'Invalid file type', file.type)
            }
        }
    }), [context.story.id, state.root])

    return <Context.Provider value={[state, memoisedDispatch]}>
        <Loading loaded={!state.loading && state.root !== null}>
            { children }
        </Loading>
    </Context.Provider>
}

export default FileSystemContext
