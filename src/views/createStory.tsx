import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import LocalizedText from 'components/localizedText'
import Loading from 'components/loading'
import AppBar from 'components/layouts/appBar'
import SettingsButton from 'components/layouts/settingsButton'
import { asBooleanString, isValidURL } from 'utils'
import Navigation from 'utils/navigation'
import Communication from 'utils/communication'
import Logger from 'utils/logger'
import type { ObjectId } from 'types'
import styles from 'styles/pages/createStory.module.scss'

interface CreateStoryState {
    name: string
    description: string
    image: string
    url: string
    loading: boolean
    error: string | null
}

interface CreateStoryViewProps {
    storyId?: ObjectId | null
}

const DefaultImageURL: string = '/defaultImage.jpg'
const DefaultState: CreateStoryState = {
    name: '',
    description: '',
    image: '',
    url: DefaultImageURL,
    loading: false,
    error: null
}

const CreateStoryView: React.FC<CreateStoryViewProps> = ({ storyId = null }) => {
    const router = useRouter()
    const [state, setState] = useState<CreateStoryState>(DefaultState)

    const handleBack = (): void => {
        void router.push(Navigation.storiesURL())
    }

    const nameChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState((state) => ({ ...state, name: e.target.value }))
    }

    const descriptionChangeHandler: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setState((state) => ({ ...state, description: e.target.value }))
    }

    const imageChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState((state) => ({ ...state, image: e.target.value }))
    }

    const confirmClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        if (state.loading) {
            return
        }

        if (storyId !== null) {
            Communication.updateStory(storyId, { name: state.name, description: state.description, image: state.image })
                .then((response) => {
                    if (response.success) {
                        setState((state) => ({ ...state, loading: false, name: '', description: '', url: '', error: null }))
                        void router.push(Navigation.storiesURL())
                    } else {
                        Logger.error('CreateStoryView.updateStory', response.result)
                        setState((state) => ({ ...state, loading: false, error: response.result }))
                    }
                }, (error) => {
                    Logger.throw('CreateStoryView.updateStory', error)
                    setState((state) => ({ ...state, loading: false, error: String(error) }))
                })
        } else {
            const image = state.url === DefaultImageURL ? null : state.url
            Communication.addStory(state.name, state.description, image)
                .then((response) => {
                    if (response.success) {
                        setState((state) => ({ ...state, loading: false, error: null }))
                        void router.push(Navigation.storiesURL())
                    } else {
                        Logger.error('CreateStoryView.addStory', response.result)
                        setState((state) => ({ ...state, loading: false, error: response.result }))
                    }
                }, (error: unknown) => {
                    Logger.throw('CreateStoryView.addStory', error)
                    setState((state) => ({ ...state, loading: false, error: String(error) }))
                })
        }

        setState((state) => ({ ...state, error: null, loading: true }))
    }

    const confirmErrorHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        setState((state) => ({ ...state, error: null }))
    }

    useEffect(() => {
        setState((state) => {
            if (!state.loading && storyId !== null) {
                Communication.getStory(storyId).then((response) => {
                    if (response.success) {
                        setState((state) => ({
                            ...state,
                            loading: false,
                            name: response.result.name,
                            description: response.result.description,
                            image: response.result.image ?? '',
                            error: null
                        }))
                    } else {
                        Logger.error('CreateStoryView.getStory', response.result)
                        setState((state) => ({ ...state, loading: false, error: response.result }))
                    }
                }, (error: unknown) => {
                    Logger.throw('CreateStoryView.getStory', error)
                    setState((state) => ({ ...state, loading: false, error: String(error) }))
                })
                return { ...state, loading: true }
            }
            return state
        })
    }, [storyId, router])

    useEffect(() => {
        setState((state) => {
            if (isValidURL(state.image)) {
                return { ...state, url: state.image }
            }
            if (state.url !== DefaultImageURL) {
                return { ...state, url: DefaultImageURL }
            }
            return state
        })
    }, [state.image])

    const isValid = state.name.length > 0

    return (
        <div className={styles.view}>
            <AppBar headerId='create-story-header' iconId='story' handleBack={handleBack}>
                <SettingsButton/>
            </AppBar>
            <Loading loaded={!state.loading}>
                { state.error === null
                    ? <div className={styles.content}>
                        <label>
                            <LocalizedText className='no-line-break' id='create-story-label-name'/>
                            <input type='text' value={state.name} onChange={nameChangeHandler}/>
                        </label>
                        <label>
                            <LocalizedText className='no-line-break' id='create-story-label-description'/>
                            <textarea value={state.description} onChange={descriptionChangeHandler}/>
                        </label>
                        <label>
                            <LocalizedText className='no-line-break' id='create-story-label-image'/>
                            <input type='url' value={state.image} onChange={imageChangeHandler} error={asBooleanString(state.url === DefaultImageURL)}/>
                            <img src={state.url} alt=''/>
                        </label>
                        <button disabled={!isValid} onClick={confirmClickHandler}>
                            <LocalizedText className='no-line-break' id={storyId !== null ? 'create-story-update' : 'create-story-create'}/>
                        </button>
                    </div>
                    : <div className={styles.error}>
                        <span>{state.error}</span>
                        <button onClick={confirmErrorHandler}>
                            <LocalizedText className='no-line-break' id='create-story-confirmError'/>
                        </button>
                    </div>
                }
            </Loading>
        </div>
    )
}

export default CreateStoryView
