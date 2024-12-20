import React, { useEffect, useMemo, useReducer } from 'react'
import Loading from 'components/controls/loading'
import { openDialog } from 'components/dialogs/handler'
import Communication from 'utils/communication'
import Logger from 'utils/logger'
import type DatabaseStory from 'structure/database/story'
import type { ObjectId } from 'types'
import type { ContextProvider, DispatchAction, DispatchActionNoData, DispatchActionWithDispatch } from 'types/context'
import type { DBResponse } from 'types/database'

type StoryContextProps = React.PropsWithChildren<{
    storyId: ObjectId
    edit: boolean
}>

interface StoryContextState {
    story: DatabaseStory
    loading: boolean
    error: string | null
    editEnabled: boolean
    sidePanelExpanded: boolean
}

interface StoryContextDispatch {
    expandSizePanel: () => void
    collapseSidePanel: () => void
}

type StoryContextProvider = ContextProvider<StoryContextState, StoryContextDispatch>

type StoryContextAction =
    DispatchActionNoData<'init'>
    | DispatchActionNoData<'update'>
    | DispatchActionWithDispatch<'fetchStory', ObjectId, StoryContextAction>
    | DispatchAction<'setStory', DBResponse<DatabaseStory>>
    | DispatchAction<'setEditEnabled', boolean>

    | DispatchAction<'setSidePanelExpanded', boolean>
const defaultContextState = {
    story: null as any,
    loading: false,
    error: null,
    editEnabled: false,
    sidePanelExpanded: true
} satisfies StoryContextState

const defaultContextDispatch: StoryContextDispatch = {
    expandSizePanel() {},
    collapseSidePanel() {}
}

export const Context = React.createContext<StoryContextProvider>([
    defaultContextState,
    defaultContextDispatch
])

const reducer: React.Reducer<StoryContextState, StoryContextAction> = (state, action) => {
    Logger.log('story.reducer', action.type)
    switch (action.type) {
        case 'init':
            return state
        case 'update':
            return { ...state }
        case 'fetchStory': {
            if (state.loading) {
                return state
            }
            const storyId = action.data
            if (state.story?.id !== storyId) {
                Communication.getStory(storyId).then((response) => {
                    action.dispatch({ type: 'setStory', data: response })
                }, (error: unknown) => {
                    Logger.throw('StoryContext.getStory', error)
                    action.dispatch({ type: 'setStory', data: { success: false, result: String(error) } })
                })
                return { ...state, loading: true }
            }
            return state
        }
        case 'setStory': {
            const response = action.data
            if (response.success) {
                return { ...state, loading: false, error: null, story: response.result }
            } else {
                openDialog('notice', {
                    id: 'story.setStory',
                    headerTextId: 'common-error',
                    bodyTextId: 'story-dialog-setStory',
                    bodyTextArgs: [response.result ?? 'Unknown Error']
                })
                return { ...state, loading: false, error: response.result, story: defaultContextState.story }
            }
        }
        case 'setEditEnabled':
            return { ...state, editEnabled: action.data }
        case 'setSidePanelExpanded':
            return { ...state, sidePanelExpanded: action.data }
        default:
            return state
    }
}

const StoryContext: React.FC<StoryContextProps> = ({ children, storyId, edit }) => {
    const [state, dispatch] = useReducer(reducer, { ...defaultContextState })

    useEffect(() => {
        dispatch({ type: 'init' })
    }, [])

    useEffect(() => {
        dispatch({ type: 'fetchStory', data: storyId, dispatch: dispatch })
    }, [storyId])

    useEffect(() => {
        dispatch({ type: 'setEditEnabled', data: edit })
    }, [edit])

    const memoisedDispatch = useMemo<StoryContextDispatch>(() => ({
        expandSizePanel() { dispatch({ type: 'setSidePanelExpanded', data: true }) },
        collapseSidePanel() { dispatch({ type: 'setSidePanelExpanded', data: false }) }
    }), [dispatch])

    return (
        <Context.Provider value={[state, memoisedDispatch]}>
            <Loading loaded={!state.loading && state.story !== null}>
                { state.error === null ? children : <div className='fill center-flex'>{state.error}</div> }
            </Loading>
        </Context.Provider>
    )
}

export default StoryContext
