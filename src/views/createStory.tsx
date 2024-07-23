import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import LocalizedText from 'components/localizedText'
import Loading from 'components/loading'
import AppBar from 'components/layouts/appBar'
import SettingsButton from 'components/layouts/settingsButton'
import ListMenu from 'components/layouts/menus/list'
import Checkbox from 'components/layouts/checkbox'
import { openDialog } from 'components/dialogs/handler'
import { asBooleanString, isObjectId, isValidURL, keysOf } from 'utils'
import Navigation from 'utils/navigation'
import Communication from 'utils/communication'
import Logger from 'utils/logger'
import type DatabaseStory from 'structure/database/story'
import { FlagType } from 'structure/database'
import type { ObjectId } from 'types'
import styles from 'styles/pages/createStory.module.scss'
import { Tooltip } from '@mui/material'

interface CreateStoryState {
    name: string
    description: string
    image: string
    url: string
    sources: ObjectId[]
    flags: FlagType[]
    hasChanges: boolean
    loading: boolean
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
    sources: [],
    flags: [],
    hasChanges: false,
    loading: false
}

const CreateStoryView: React.FC<CreateStoryViewProps> = ({ storyId = null }) => {
    const router = useRouter()
    const [state, setState] = useState<CreateStoryState>(DefaultState)
    const [stories, setStories] = useState<DatabaseStory[]>([])

    const options = useMemo(() => {
        const options: Record<ObjectId, React.ReactNode> = {}
        for (const story of stories) {
            if (!state.sources.includes(story.id) && story.id !== storyId) {
                options[story.id] = <StoryComponent story={story}/>
            }
        }
        return options
    }, [stories, state.sources, storyId])

    const handleBack = (): void => {
        if (state.hasChanges) {
            openDialog('confirmation', {
                id: 'lave-page',
                headerTextId: 'common-unsavedChanges',
                bodyTextId: 'common-unsavedChanges-description'
            }).onConfirm(() => {
                void router.push(Navigation.storiesURL())
            })
        } else {
            void router.push(Navigation.storiesURL())
        }
    }

    const nameChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState((state) => ({ ...state, name: e.target.value, hasChanges: true }))
    }

    const descriptionChangeHandler: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setState((state) => ({ ...state, description: e.target.value, hasChanges: true }))
    }

    const imageChangeHandler: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState((state) => ({ ...state, image: e.target.value, hasChanges: true }))
    }

    const sourcesChangeHandler = (values: unknown[]): void => {
        if (values.every(isObjectId)) {
            setState((state) => ({ ...state, sources: values, hasChanges: true }))
        }
    }

    const flagChangeHandler = (value: boolean, flag: FlagType): void => {
        setState((state) => {
            const excluded = state.flags.filter((value) => value !== flag)
            return { ...state, flags: value ? [...excluded, flag] : excluded, hasChanges: true }
        })
    }

    const confirmClickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
        if (state.loading) {
            return
        }

        if (storyId !== null) {
            Communication.updateStory(storyId, { name: state.name, description: state.description, image: state.image, sources: state.sources, flags: state.flags })
                .then((response) => {
                    if (response.success) {
                        setState({ ...DefaultState })
                        void router.push(Navigation.storiesURL())
                    } else {
                        openDialog('notice', {
                            id: 'file.field',
                            headerTextId: 'common-error',
                            bodyTextId: 'create-story-dialog-updateStory',
                            bodyTextArgs: [response.result ?? 'Missing']
                        })
                        Logger.error('CreateStoryView.updateStory', response.result)
                    }
                }, (error) => {
                    openDialog('notice', {
                        id: 'file.field',
                        headerTextId: 'common-error',
                        bodyTextId: 'create-story-dialog-updateStory',
                        bodyTextArgs: [String(error)]
                    })
                    Logger.throw('CreateStoryView.updateStory', error)
                }).finally(() => {
                    setState((state) => ({ ...state, loading: false }))
                })
        } else {
            const image = state.url === DefaultImageURL ? null : state.url
            Communication.addStory(state.name, state.description, image, state.sources, state.flags)
                .then((response) => {
                    if (response.success) {
                        setState({ ...DefaultState })
                        void router.push(Navigation.storiesURL())
                    } else {
                        openDialog('notice', {
                            id: 'file.field',
                            headerTextId: 'common-error',
                            bodyTextId: 'create-story-dialog-addStory',
                            bodyTextArgs: [response.result ?? 'Missing']
                        })
                        Logger.error('CreateStoryView.addStory', response.result)
                    }
                }, (error: unknown) => {
                    openDialog('notice', {
                        id: 'file.field',
                        headerTextId: 'common-error',
                        bodyTextId: 'create-story-dialog-addStory',
                        bodyTextArgs: [String(error)]
                    })
                    Logger.throw('CreateStoryView.addStory', error)
                }).finally(() => {
                    setState((state) => ({ ...state, loading: false }))
                })
        }

        setState((state) => ({ ...state, loading: true }))
    }

    const validateInput = (value: unknown): boolean => {
        return stories.some((story) => story.id === value && !state.sources.includes(value as ObjectId))
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
                            sources: response.result.sources ?? [],
                            flags: response.result.flags ?? []
                        }))
                    } else {
                        openDialog('notice', {
                            id: 'file.field',
                            headerTextId: 'common-error',
                            bodyTextId: 'create-story-dialog-getStory',
                            bodyTextArgs: [response.result ?? 'Missing']
                        })
                        Logger.error('CreateStoryView.getStory', response.result)
                    }
                }, (error: unknown) => {
                    openDialog('notice', {
                        id: 'file.field',
                        headerTextId: 'common-error',
                        bodyTextId: 'create-story-dialog-getStory',
                        bodyTextArgs: [String(error)]
                    })
                    Logger.throw('CreateStoryView.getStory', error)
                }).finally(() => {
                    setState((state) => ({ ...state, loading: false }))
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

    useEffect(() => {
        setStories(() => {
            Communication.getAllAvailableSources().then((response) => {
                if (response.success) {
                    setStories(response.result)
                } else {
                    openDialog('notice', {
                        id: 'file.field',
                        headerTextId: 'common-error',
                        bodyTextId: 'create-story-dialog-getPublicStories',
                        bodyTextArgs: [response.result ?? 'Missing']
                    })
                    setStories([])
                    Logger.error('CreateStoryView.getPublicStories', response.result)
                }
            }, (error: unknown) => {
                openDialog('notice', {
                    id: 'file.field',
                    headerTextId: 'common-error',
                    bodyTextId: 'create-story-dialog-getPublicStories',
                    bodyTextArgs: [String(error)]
                })
                setStories([])
                Logger.throw('CreateStoryView.getPublicStories', error)
            })
            return []
        })
    }, [])

    // Prevent leaving page with unsaved changes
    useEffect(() => {
        if (window !== undefined && window !== null) {
            const text = 'There are unsaved changes'
            const handler = (e: BeforeUnloadEvent): string | undefined => {
                if (state.hasChanges) {
                    e.preventDefault()
                    return (e.returnValue = text)
                }
            }
            window.addEventListener('beforeunload', handler)
            return () => {
                window.removeEventListener('beforeunload', handler)
            }
        }
    }, [state.hasChanges])

    const isValid = state.name.length > 0

    return (
        <div className={styles.view}>
            <AppBar headerId='create-story-header' iconId='story' handleBack={handleBack}>
                <SettingsButton/>
            </AppBar>
            <Loading loaded={!state.loading}>
                <div className={styles.content}>
                    <div className={styles.item}>
                        <LocalizedText className='no-line-break' id='create-story-label-name'/>
                        <input type='text' value={state.name} onChange={nameChangeHandler}/>
                    </div>
                    <div className={styles.item}>
                        <LocalizedText className='no-line-break' id='create-story-label-description'/>
                        <textarea value={state.description} onChange={descriptionChangeHandler}/>
                    </div>
                    <div className={styles.item}>
                        <LocalizedText className='no-line-break' id='create-story-label-image'/>
                        <input type='url' value={state.image} onChange={imageChangeHandler} error={asBooleanString(state.url === DefaultImageURL)}/>
                        <img src={state.url} alt=''/>
                    </div>
                    <div className={styles.item}>
                        <LocalizedText className='no-line-break' id='create-story-label-sources'/>
                        <ListMenu
                            className={styles.listMenu}
                            itemClassName={styles.listMenuItem}
                            type='enum'
                            defaultValue={keysOf(options)[0]}
                            values={state.sources}
                            options={options}
                            validateInput={validateInput}
                            onChange={sourcesChangeHandler}
                            createComponent={(value) => <StoryComponent key={String(value)} story={stories.find((story) => story.id === value)}/>}
                            addLast/>
                    </div>
                    <div className={styles.item}>
                        <LocalizedText className='no-line-break' id='create-story-label-public'/>
                        <Checkbox
                            className={styles.checkbox}
                            value={state.flags.includes(FlagType.Public)}
                            onChange={(value) => { flagChangeHandler(value, FlagType.Public) }}/>
                    </div>
                    <div className={styles.item}>
                        <LocalizedText className='no-line-break' id='create-story-label-official'/>
                        <Checkbox
                            className={styles.checkbox}
                            value={state.flags.includes(FlagType.Official)}
                            onChange={(value) => { flagChangeHandler(value, FlagType.Official) }}/>
                    </div>
                    <button disabled={!isValid || !state.hasChanges} onClick={confirmClickHandler}>
                        <LocalizedText className='no-line-break' id={storyId !== null ? 'create-story-update' : 'create-story-create'}/>
                    </button>
                </div>
            </Loading>
        </div>
    )
}

const StoryComponent: React.FC<{ story?: DatabaseStory }> = ({ story }) => {
    return (
        <Tooltip title={story?.description}>
            <div className={styles.storyItem}>
                <span>{story?.name ?? <LocalizedText id='common-missing'/>}</span>
                { story !== undefined && story.flags.includes(FlagType.Official) &&
                    <LocalizedText id='create-story-official'/>
                }
            </div>
        </Tooltip>
    )
}

export default CreateStoryView
