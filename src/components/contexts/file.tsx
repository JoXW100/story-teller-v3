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
import DocumentFactory from 'structure/database/files/factory'
import type { ObjectId } from 'types'
import type { IToken } from 'types/language'
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
    tokens: Record<string, IToken | null>
}

export interface FileContextDispatch {
    setToken: (field: string, token: IToken | null) => void
    setData: (field: string, value: any) => void
    setStorage: (field: string, value: any) => void
    setEditorPage: (data: IEditorPageData) => void
    pushEditorPage: (data: IEditorPageData) => void
    popEditorPage: () => void
}

type FileContextAction =
    DispatchActionNoData<'init'>
    | DispatchActionNoData<'update'>
    | DispatchActionWithDispatch<'fetchFile', ObjectId, FileContextAction>
    | DispatchAction<'setFile', DBResponse<DatabaseFile>>
    | DispatchAction<'setToken', { field: string, value: IToken | null }>
    | DispatchActionWithDispatch<'setData', ISetFieldData, FileContextAction>
    | DispatchActionWithDispatch<'setStorage', ISetFieldData, FileContextAction>
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
    buffer: new RequestBuffer(),
    tokens: {}
} satisfies FileContextState

const defaultContextDispatch: FileContextDispatch = {
    setToken() {},
    setData() {},
    setStorage() {},
    setEditorPage() {},
    pushEditorPage() {},
    popEditorPage() {}
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
        case 'setToken': {
            return { ...state, tokens: { ...state.tokens, [action.data.field]: action.data.value } }
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
            const result = { data: DocumentFactory.dataFactory(file.type)?.simplify(file.data) ?? file.data }

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
            const result = { storage: DocumentFactory.storageFactory(file.type)?.simplify(file.storage) ?? file.storage }

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
        setToken(field, value) { dispatch({ type: 'setToken', data: { field: field, value: value } }) },
        setData(field, value) { dispatch({ type: 'setData', data: { field: field, value: value }, dispatch: dispatch }) },
        setStorage(field, value) { dispatch({ type: 'setStorage', data: { field: field, value: value }, dispatch: dispatch }) },
        setEditorPage(data) { dispatch({ type: 'setEditorPage', data: data }) },
        pushEditorPage(data) { dispatch({ type: 'pushEditorPage', data: data }) },
        popEditorPage() { dispatch({ type: 'popEditorPage' }) }
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

const FileHeader: React.FC<FileHeaderProps> = ({ file }): JSX.Element => {
    const fileTitle = (file != null ? file.getTitle() + ' - ' : '') + 'Story Teller'
    const fileDescription = file?.getDescription() ?? 'Create your own story!'

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
