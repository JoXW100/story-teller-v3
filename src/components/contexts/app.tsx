import React, { useEffect, useMemo, useReducer } from 'react'
import { asBoolean, asEnum, asKeyOf, isKeyOf, keysOf } from 'utils'
import Storage from 'utils/storage'
import { TextData, type LanguageType } from 'data'
import Palettes from 'data/palettes'
import type { ContextProvider, DispatchAction, DispatchActionNoData, ISetFieldData } from 'types/context'
import type { LocalizationItem } from 'types/localization'

export enum ViewMode {
    SplitView = 'split',
    Exclusive = 'exclusive'
}

interface AppContextState {
    palette: keyof typeof Palettes
    language: LanguageType
    localization: LocalizationItem
    viewMode: ViewMode
    enableEditorWordWrap: boolean
    enableColorFileByType: boolean
    hideRolls: boolean
}

type OptionField = 'language' | 'viewMode' | 'enableColorFileByType' | 'enableEditorWordWrap' | 'hideRolls'

interface AppContextDispatch {
    setLanguage: (language: string) => void
    setOption: (field: OptionField, value: any) => void
}

type AppContextAction =
    DispatchActionNoData<'init'>
    | DispatchAction<'setLanguage', string>
    | DispatchAction<'setOption', ISetFieldData<OptionField>>

type AppContextProvider = ContextProvider<AppContextState, AppContextDispatch>

const defaultPalette = keysOf(Palettes)[0]
const defaultLanguage: LanguageType = 'eng'
const defaultContextState = {
    palette: defaultPalette,
    language: defaultLanguage,
    localization: TextData[defaultLanguage],
    viewMode: ViewMode.SplitView,
    enableEditorWordWrap: true,
    enableColorFileByType: true,
    hideRolls: false
} satisfies AppContextState

const defaultContextDispatch: AppContextDispatch = {
    setLanguage: () => {},
    setOption: () => {}
}

export const Context = React.createContext<AppContextProvider>([
    defaultContextState,
    defaultContextDispatch
])

const setPalette = (palette: keyof typeof Palettes): void => {
    if (typeof window !== 'undefined') {
        keysOf(Palettes[palette]).forEach((color) => {
            const value: string = Palettes[palette][color]
            document.documentElement.style.setProperty(`--color-${color}`, value)
        })
    }
}

const reducer: React.Reducer<AppContextState, AppContextAction> = (state, action) => {
    switch (action.type) {
        case 'init':
            return {
                ...state,
                palette: Storage.getKeyOf('palette', Palettes) ?? defaultContextState.palette,
                language: Storage.getKeyOf('language', TextData) ?? defaultContextState.language,
                viewMode: Storage.getEnum('viewMode', ViewMode) ?? defaultContextState.viewMode,
                enableEditorWordWrap: Storage.getBoolean('enableEditorWordWrap') ?? defaultContextState.enableEditorWordWrap,
                enableColorFileByType: Storage.getBoolean('enableColorFileByType') ?? defaultContextState.enableColorFileByType,
                hideRolls: Storage.getBoolean('hideRolls') ?? defaultContextState.hideRolls
            }
        case 'setLanguage': {
            if (isKeyOf(action.data, TextData)) {
                const localization = TextData[action.data]
                return { ...state, localization: localization }
            }
            return state
        }
        case 'setOption': {
            switch (action.data.field) {
                case 'language': {
                    const value = asKeyOf(action.data.value, TextData, defaultContextState.language)
                    Storage.setString('language', value)
                    return { ...state, language: value }
                }
                case 'viewMode': {
                    const value = asEnum(action.data.value, ViewMode, defaultContextState.viewMode)
                    Storage.setString('viewMode', value)
                    return { ...state, viewMode: value }
                }
                case 'enableColorFileByType': {
                    const value = asBoolean(action.data.value, defaultContextState.enableColorFileByType)
                    Storage.setBoolean('enableColorFileByType', value)
                    return { ...state, enableColorFileByType: value }
                }
                case 'enableEditorWordWrap': {
                    const value = asBoolean(action.data.value, defaultContextState.enableEditorWordWrap)
                    Storage.setBoolean('enableEditorWordWrap', value)
                    return { ...state, enableEditorWordWrap: value }
                }
                case 'hideRolls': {
                    const value = asBoolean(action.data.value, defaultContextState.hideRolls)
                    Storage.setBoolean('hideRolls', value)
                    return { ...state, hideRolls: value }
                }
                default:
                    return state
            }
        }
        default:
            return state
    }
}

const AppContext: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultContextState)

    useEffect(() => {
        dispatch({ type: 'init' })
    }, [])

    useEffect(() => {
        setPalette(state.palette)
    }, [state.palette])

    useEffect(() => {
        dispatch({ type: 'setLanguage', data: state.language })
    }, [state.language])

    const memoisedDispatch = useMemo<AppContextDispatch>(() => ({
        setLanguage(language) { dispatch({ type: 'setLanguage', data: language }) },
        setOption(field, value) { dispatch({ type: 'setOption', data: { field: field, value: value, deps: [] } }) }
    }), [dispatch])

    return (
        <Context.Provider value={[state, memoisedDispatch]}>
            { children }
        </Context.Provider>
    )
}

export default AppContext
