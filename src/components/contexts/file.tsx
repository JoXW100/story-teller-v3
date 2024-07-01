import React, { useEffect, useMemo, useReducer } from 'react'
import Loading from 'components/loading'
import { isKeyOf, isRecord } from 'utils'
import Communication from 'utils/communication'
import Logger from 'utils/logger'
import RequestBuffer from 'utils/buffer'
import type { EditorPageKeyType } from 'components/layouts/fileView/editor'
import type DatabaseFile from 'structure/database/files'
import DocumentFactory from 'structure/database/files/factory'
import type { ObjectId } from 'types'
import type { IToken } from 'types/language'
import type { ContextProvider, DispatchAction, DispatchActionNoData, DispatchActionWithDispatch, ISetFieldData } from 'types/context'
import type { DBResponse } from 'types/database'

export interface IEditorPageData {
    pageKey: EditorPageKeyType
    root: string
    name: string
    deps: string[]
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
    setData: (field: string, value: any, deps?: string[]) => void
    setStorage: (field: string, value: any, deps?: string[]) => void
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

export function getRelativeFieldObject(field: string, data: Record<string, unknown>): { key: string, relative: Record<string, unknown> } | null {
    const keys = field.split('.')
    let relativeData: Record<string, unknown> = data
    for (let i = 0; i < keys.length - 1; i++) {
        if (keys[i].length === 0) {
            continue
        }

        const next = relativeData[keys[i]]
        if (isRecord(next) || Array.isArray(next)) {
            relativeData = next as Record<string, unknown>
        } else {
            return null
        }
    }

    const key = keys[keys.length - 1]
    if (!isKeyOf(key, relativeData)) {
        return null
    }

    return {
        key: key,
        relative: relativeData
    }
}

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
                return { ...state }
            }

            match.relative[match.key] = action.data.value // Update local value
            const file = state.file.updateData(data)
            const result = { data: DocumentFactory.dataFactory(file.type)?.simplify(file.data) ?? file.data }

            state.buffer.add(() => {
                Communication.updateFile(state.file.id, state.file.type, result).then((response) => {
                    if (!response.success || !response.result) {
                        Logger.warn('FileContext.setData', 'Failed to update file data')
                    }
                }, (error: unknown) => {
                    Logger.throw('FileContext.setData', 'Database failed set file data', error)
                })
            }, 'update.data')
            return { ...state, file: file }
        }
        case 'setStorage': {
            const storage = { ...state.file.storage }
            const match = getRelativeFieldObject(action.data.field, storage)
            if (match === null) {
                Logger.throw('FileContext.setStorage', 'Failed to get relative object', storage, action.data)
                return { ...state }
            }

            match.relative[match.key] = action.data.value // Update local value
            const file = state.file.updateStorage(storage)
            const result = { storage: DocumentFactory.storageFactory(file.type)?.simplify(file.storage) ?? file.storage }

            state.buffer.add(() => {
                Communication.updateFile(state.file.id, state.file.type, result).then((response) => {
                    if (!response.success || !response.result) {
                        Logger.warn('FileContext.setStorage', 'Failed to update file storage')
                    }
                }, (error: unknown) => {
                    Logger.throw('FileContext.setStorage', 'Database failed set file storage', error)
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

    useEffect(() => {
        dispatch({ type: 'init' })
    }, [])

    useEffect(() => {
        dispatch({ type: 'fetchFile', data: fileId, dispatch: dispatch })
    }, [fileId])

    const memoisedDispatch = useMemo<FileContextDispatch>(() => ({
        setToken(field, value) { dispatch({ type: 'setToken', data: { field: field, value: value } }) },
        setData(field, value, deps = []) { dispatch({ type: 'setData', data: { field: field, value: value, deps: deps }, dispatch: dispatch }) },
        setStorage(field, value, deps = []) { dispatch({ type: 'setStorage', data: { field: field, value: value, deps: deps }, dispatch: dispatch }) },
        setEditorPage(data) { dispatch({ type: 'setEditorPage', data: data }) },
        pushEditorPage(data) { dispatch({ type: 'pushEditorPage', data: data }) },
        popEditorPage() { dispatch({ type: 'popEditorPage' }) }
    }), [])

    return (
        <Context.Provider value={[state, memoisedDispatch]}>
            <Loading loaded={!state.loading && state.file !== null}>
                { children }
            </Loading>
        </Context.Provider>
    )
}

export default FileContext
