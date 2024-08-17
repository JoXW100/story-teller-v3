import React, { useEffect, useMemo, useReducer } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import Loading from 'components/controls/loading'
import { openDialog } from 'components/dialogs/handler'
import Communication from 'utils/communication'
import { getRelativeFieldObject, isString } from 'utils'
import Logger from 'utils/logger'
import RequestBuffer from 'utils/buffer'
import { useLocalizedText } from 'utils/hooks/localization'
import type { EditorPageKeyType } from 'components/views/editor'
import type DatabaseFile from 'structure/database/files'
import type { DocumentDataMap } from 'structure/database/files/factory'
import type { ObjectId, ValueOf } from 'types'
import type { ContextProvider, DispatchAction, DispatchActionNoData, DispatchActionWithDispatch, ISetFieldData } from 'types/context'
import type { DBResponse } from 'types/database'

export interface IEditorPageData {
    pageKey: EditorPageKeyType
    root: string
    name: React.ReactNode
}

interface FileContextState {
    file: DatabaseFile
    editorPages: IEditorPageData[]
    loading: boolean
    buffer: RequestBuffer
}

export interface FileContextDispatch {
    setData: (field: string, value: any) => void
    setStorage: (field: string, value: any) => void
    setEditorPage: (data: IEditorPageData) => void
    pushEditorPage: (data: IEditorPageData) => void
    popEditorPage: () => void
    publish: (value: boolean) => void
}

type FileContextAction =
    DispatchActionNoData<'init'>
    | DispatchActionNoData<'update'>
    | DispatchActionWithDispatch<'fetchFile', ObjectId, FileContextAction>
    | DispatchAction<'setFile', DBResponse<ValueOf<DocumentDataMap>>>
    | DispatchActionWithDispatch<'setData', ISetFieldData, FileContextAction>
    | DispatchActionWithDispatch<'setStorage', ISetFieldData, FileContextAction>
    | DispatchActionWithDispatch<'publish', boolean, FileContextAction>
    | DispatchAction<'setEditorPage', IEditorPageData>
    | DispatchAction<'pushEditorPage', IEditorPageData>
    | DispatchActionNoData<'popEditorPage'>

type FileContextProvider = ContextProvider<FileContextState, FileContextDispatch>
type FileContextProps = React.PropsWithChildren<{
    fileId: ObjectId
}>

const defaultContextState = {
    file: null as any,
    editorPages: [],
    loading: false,
    buffer: new RequestBuffer()
} satisfies FileContextState

const defaultContextDispatch: FileContextDispatch = {
    setData() {},
    setStorage() {},
    setEditorPage() {},
    pushEditorPage() {},
    popEditorPage() {},
    publish() {}
}

export const Context = React.createContext<FileContextProvider>([
    defaultContextState,
    defaultContextDispatch
])

const reducer: React.Reducer<FileContextState, FileContextAction> = (state, action) => {
    Logger.log('file.reducer', action)
    switch (action.type) {
        case 'init':
            return state
        case 'update':
            return { ...state }
        case 'fetchFile': {
            const fileId = action.data
            if (state.loading || state.file?.id === fileId) {
                return state
            }
            Communication.getFile(fileId).then((response) => {
                action.dispatch({ type: 'setFile', data: response })
            }, (error: unknown) => {
                Logger.throw('FileContext.setFile', error)
                action.dispatch({ type: 'setFile', data: { success: false, result: String(error) } })
            })
            return { ...state, loading: true, tokens: {} }
        }
        case 'setFile': {
            const response = action.data
            if (response.success) {
                return { ...state, loading: false, file: response.result }
            } else {
                openDialog('notice', {
                    id: 'file.setFile',
                    headerTextId: 'common-error',
                    bodyTextId: 'file-dialog-setFile',
                    bodyTextArgs: [response.result ?? 'Unknown Error']
                })
                return { ...state, loading: false, file: defaultContextState.file }
            }
        }
        case 'setData': {
            const data: Record<string, unknown> = { ...state.file.data }
            const match = getRelativeFieldObject(action.data.field, data)
            if (match === null) {
                Logger.throw('FileContext.setData', 'Failed to get relative object', data, action.data)
                openDialog('notice', {
                    id: 'file.field',
                    headerTextId: 'common-error',
                    bodyTextId: 'file-dialog-field',
                    bodyTextArgs: [action.data.field]
                })
                return { ...state }
            }

            match.relative[match.key] = action.data.value // Update local value
            const file = state.file.updateData(data)
            const result = { data: file.getDataFactory().simplify(file.data) ?? file.data }

            state.buffer.add(() => {
                Communication.updateFile(state.file.id, state.file.type, result).then((response) => {
                    if (!response.success || !response.result) {
                        Logger.error('FileContext.setData', 'Failed to update file data')
                        openDialog('notice', {
                            id: 'file.setData',
                            headerTextId: 'common-error',
                            bodyTextId: 'file-dialog-setData',
                            bodyTextArgs: [action.data.field, isString(response.result) ? response.result : 'Unknown Error']
                        })
                    }
                }, (error: unknown) => {
                    Logger.throw('FileContext.setData', 'Database failed set file data', error)
                    openDialog('notice', {
                        id: 'file.setData',
                        headerTextId: 'common-error',
                        bodyTextId: 'file-dialog-setData',
                        bodyTextArgs: [action.data.field, String(error)]
                    })
                })
            }, 'update.data')
            return { ...state, file: file }
        }
        case 'setStorage': {
            const storage = { ...state.file.storage }
            const match = getRelativeFieldObject(action.data.field, storage)
            if (match === null) {
                Logger.throw('FileContext.setStorage', 'Failed to get relative object', storage, action.data)
                openDialog('notice', {
                    id: 'file.field',
                    headerTextId: 'common-error',
                    bodyTextId: 'file-dialog-field',
                    bodyTextArgs: [action.data.field]
                })
                return { ...state }
            }

            match.relative[match.key] = action.data.value // Update local value
            const file = state.file.updateStorage(storage)
            const result = { storage: file.getStorageFactory().simplify(file.storage) ?? file.storage }

            state.buffer.add(() => {
                Communication.updateFile(state.file.id, state.file.type, result).then((response) => {
                    if (!response.success || !response.result) {
                        Logger.warn('FileContext.setStorage', 'Failed to update file storage')
                        openDialog('notice', {
                            id: 'file.setStorage',
                            headerTextId: 'common-error',
                            bodyTextId: 'file-dialog-setStorage',
                            bodyTextArgs: [action.data.field, isString(response.result) ? response.result : 'Unknown Error']
                        })
                    }
                }, (error: unknown) => {
                    Logger.throw('FileContext.setStorage', 'Database failed set file storage', error)
                    openDialog('notice', {
                        id: 'file.setStorage',
                        headerTextId: 'common-error',
                        bodyTextId: 'file-dialog-setStorage',
                        bodyTextArgs: [action.data.field, String(error)]
                    })
                })
            }, 'update.storage')
            return { ...state, file: file }
        }
        case 'publish': {
            state.buffer.add(() => {
                Communication.publishFile(state.file.id, state.file.type, action.data).then((response) => {
                    if (!response.success || !response.result) {
                        Logger.warn('FileContext.setPublic', 'Failed to update file storage')
                        openDialog('notice', {
                            id: 'file.setPublic',
                            headerTextId: 'common-error',
                            bodyTextId: 'file-dialog-setPublic',
                            bodyTextArgs: [isString(response.result) ? response.result : 'Unknown Error']
                        }).onClose(() => {
                            action.dispatch({ type: 'fetchFile', data: state.file.id, dispatch: action.dispatch })
                        })
                    } else {
                        action.dispatch({ type: 'fetchFile', data: state.file.id, dispatch: action.dispatch })
                    }
                }, (error: unknown) => {
                    Logger.throw('FileContext.setPublic', 'Database failed set file storage', error)
                    openDialog('notice', {
                        id: 'file.setPublic',
                        headerTextId: 'common-error',
                        bodyTextId: 'file-dialog-setPublic',
                        bodyTextArgs: [String(error)]
                    }).onClose(() => {
                        action.dispatch({ type: 'fetchFile', data: state.file.id, dispatch: action.dispatch })
                    })
                }).finally()
            }, 'update.public')
            return { ...state, file: null, loading: false }
        }
        case 'setEditorPage': {
            return { ...state, editorPages: [action.data] }
        }
        case 'pushEditorPage': {
            return { ...state, editorPages: [...state.editorPages, action.data] }
        }
        case 'popEditorPage': {
            return { ...state, editorPages: state.editorPages.slice(0, -1) }
        }
        default:
            return state
    }
}

const FileContext: React.FC<FileContextProps> = ({ children, fileId }) => {
    const [state, dispatch] = useReducer(reducer, defaultContextState)
    const warningMsg = useLocalizedText('common-unsavedChanges')

    useEffect(() => {
        dispatch({ type: 'init' })
    }, [])

    useEffect(() => {
        dispatch({ type: 'fetchFile', data: fileId, dispatch: dispatch })
    }, [fileId])

    const memoisedDispatch = useMemo<FileContextDispatch>(() => ({
        setData(field, value) { dispatch({ type: 'setData', data: { field: field, value: value }, dispatch: dispatch }) },
        setStorage(field, value) { dispatch({ type: 'setStorage', data: { field: field, value: value }, dispatch: dispatch }) },
        setEditorPage(data) { dispatch({ type: 'setEditorPage', data: data }) },
        pushEditorPage(data) { dispatch({ type: 'pushEditorPage', data: data }) },
        popEditorPage() { dispatch({ type: 'popEditorPage' }) },
        publish(value) { dispatch({ type: 'publish', data: value, dispatch: dispatch }) }
    }), [])

    useEffect(() => {
        if (window !== undefined && window !== null) {
            const handler = (e: BeforeUnloadEvent): string | undefined => {
                if (state.buffer.requestIsQueued) {
                    e.preventDefault()
                    return (e.returnValue = '')
                }
            }
            const routeChangeHandler = (url: string): void => {
                if (state.buffer.requestIsQueued && Router.pathname !== url && !confirm(warningMsg)) {
                    Router.events.emit('routeChangeError')
                    // eslint-disable-next-line @typescript-eslint/no-throw-literal
                    throw 'Route change was aborted (this error can be safely ignored)'
                }
            }
            window.addEventListener('beforeunload', handler)
            Router.events.on('routeChangeStart', routeChangeHandler)
            return () => {
                window.removeEventListener('beforeunload', handler)
                Router.events.off('routeChangeStart', routeChangeHandler)
            }
        }
    }, [state.buffer, warningMsg])

    return (
        <Context.Provider value={[state, memoisedDispatch]}>
            <Loading loaded={!state.loading && state.file !== null}>
                <FileHeader file={state.file}/>
                { children }
            </Loading>
        </Context.Provider>
    )
}

type FileHeaderProps = React.PropsWithoutRef<{
    file: DatabaseFile
}>

const FileHeader: React.FC<FileHeaderProps> = ({ file }) => {
    if (file === null) {
        return null
    }

    const fileTitle = `${file.getTitle()} - Story Teller`
    const fileDescription = file.getDescription()

    return (
        <Head>
            <title key="title">{fileTitle}</title>
            <meta key="description" name="description" content={fileDescription}/>
            <meta key="og:title" property="og:title" content={fileTitle}/>
            <meta key="og:description" property="og:description" content={fileDescription}/>
        </Head>
    )
}

export default FileContext
