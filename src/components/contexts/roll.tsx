import React, { useMemo, useReducer } from 'react'
import type { IRollContext } from 'structure/dice'
import Beyond20 from 'utils/beyond20'
import Logger from 'utils/logger'
import type { ContextProvider, DispatchAction, DispatchActionNoData } from 'types/context'

export interface IRollEvent {
    context: IRollContext
    time: number
}

interface RollContextState {
    rollHistory: Array<IRollEvent | null>
}

interface RollContextDispatch {
    roll: (context: IRollContext) => void
    clearRollHistory: () => void
}

type RollContextProvider = ContextProvider<RollContextState, RollContextDispatch>

type RollContextAction =
    | DispatchAction<'roll', IRollContext>
    | DispatchActionNoData<'clearRollHistory'>
const defaultContextState = {
    rollHistory: Array.from({ length: 10 }).map<IRollEvent | null>(() => null)
} satisfies RollContextState

const defaultContextDispatch: RollContextDispatch = {
    roll() {},
    clearRollHistory() {}
}

export const Context = React.createContext<RollContextProvider>([
    defaultContextState,
    defaultContextDispatch
])

const reducer: React.Reducer<RollContextState, RollContextAction> = (state, action) => {
    Logger.log('story.reducer', action.type)
    switch (action.type) {
        case 'roll': {
            const [, ...history] = state.rollHistory
            return { ...state, rollHistory: [...history, { time: Date.now(), context: action.data }] }
        }
        case 'clearRollHistory': {
            return { ...state, rollHistory: state.rollHistory.map(entry => entry !== null ? ({ ...entry, time: 0 }) : null) }
        }
        default:
            return state
    }
}

const RollContext: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, { ...defaultContextState })

    const memoisedDispatch = useMemo<RollContextDispatch>(() => ({
        roll(context) {
            Beyond20.sendRoll(context)
            dispatch({ type: 'roll', data: context })
        },
        clearRollHistory() { dispatch({ type: 'clearRollHistory' }) }
    }), [dispatch])

    return (
        <Context.Provider value={[state, memoisedDispatch]}>
            { children }
        </Context.Provider>
    )
}

export default RollContext
