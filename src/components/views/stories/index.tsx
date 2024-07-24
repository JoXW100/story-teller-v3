import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AddSharpIcon from '@mui/icons-material/AddSharp'
import StoryCard, { EmptyCard } from '../storyCard'
import LocalizedText from 'components/controls/localizedText'
import Loading from 'components/controls/loading'
import AppBar from 'components/controls/appBar'
import SettingsButton from 'components/controls/settingsButton'
import { openDialog } from 'components/dialogs/handler'
import { isString } from 'utils'
import Navigation from 'utils/navigation'
import Communication from 'utils/communication'
import Logger from 'utils/logger'
import type DatabaseStory from 'structure/database/story'
import styles from './style.module.scss'

interface StoriesViewState {
    stories: DatabaseStory[]
    loading: boolean
}

const StoriesView: React.FC = () => {
    const router = useRouter()
    const [state, setState] = useState<StoriesViewState>({
        stories: [],
        loading: false
    })

    const handleBack = (): void => {
        void router.push(Navigation.homeURL())
    }

    useEffect(() => {
        setState((state) => {
            if (!state.loading) {
                Communication.getAllStories().then((response) => {
                    if (response.success) {
                        setState((state) => ({ ...state, loading: false, stories: response.result }))
                    } else {
                        openDialog('notice', {
                            id: 'file.setData',
                            headerTextId: 'common-error',
                            bodyTextId: 'stories-dialog-getAllStories',
                            bodyTextArgs: [isString(response.result) ? response.result : 'Unknown Error']
                        })
                        Logger.error('StoriesView.getAllStories', response.result)
                        setState((state) => ({ ...state, loading: false, stories: [] }))
                    }
                }, (error: unknown) => {
                    openDialog('notice', {
                        id: 'file.setData',
                        headerTextId: 'common-error',
                        bodyTextId: 'stories-dialog-getAllStories',
                        bodyTextArgs: [String(error)]
                    })
                    Logger.throw('StoriesView.getAllStories', error)
                    setState((state) => ({ ...state, loading: false, stories: [] }))
                })

                return { ...state, loading: true }
            }

            if (state.stories.length > 0) {
                return { ...state, stories: [] }
            }

            return state
        })
    }, [])

    return (
        <div className={styles.view}>
            <AppBar headerId='stories-header' iconId='library' handleBack={handleBack}>
                <SettingsButton/>
            </AppBar>
            <div className={styles.content}>
                <Loading loaded={!state.loading}>
                    <EmptyCard
                        href={Navigation.createStoryURL()}
                        header={<LocalizedText id='stories-card-addStory'/>}>
                        <AddSharpIcon/>
                    </EmptyCard>
                    { state.stories.map((story) => (
                        <StoryCard key={story.id} story={story}/>
                    ))}
                </Loading>
            </div>
        </div>
    )
}

export default StoriesView
