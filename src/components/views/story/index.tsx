import { useContext } from 'react'
import { useRouter } from 'next/router'
import FileView from './fileView'
import { Context as AppContext, ViewMode } from 'components/contexts/app'
import { Context as StoryContext } from 'components/contexts/story'
import RollContext from 'components/contexts/roll'
import AppBar from 'components/controls/appBar'
import FileSystem from 'components/controls/fileSystem'
import Divider from 'components/controls/divider'
import EditButton from 'components/controls/editButton'
import DieButton from 'components/controls/dicePanel/diceButton'
import SettingsButton from 'components/controls/settingsButton'
import RollHistoryButton from 'components/controls/rollHistoryButton'
import FileSystemCollapsedMenu from 'components/controls/fileSystem/collapsedMenu'
import Navigation from 'utils/navigation'
import type { ObjectId } from 'types'
import styles from './style.module.scss'

interface StoryViewProps {
    fileId: ObjectId | null
}

const StoryView: React.FC<StoryViewProps> = ({ fileId }) => {
    const router = useRouter()
    const [appContext] = useContext(AppContext)
    const [storyContext] = useContext(StoryContext)

    const handleBack = (): void => {
        if (fileId === null) {
            void router.push(Navigation.homeURL())
        } else {
            void router.push(Navigation.storyURL(storyContext.story.id))
        }
    }

    return (
        <div className={styles.view}>
            <RollContext>
                <AppBar headerId='empty' headerArgs={[storyContext.story.name]} iconId='story' handleBack={handleBack}>
                    <SettingsButton/>
                    <EditButton/>
                    <RollHistoryButton/>
                    <DieButton/>
                </AppBar>
                { (storyContext.editEnabled || appContext.viewMode === ViewMode.SplitView)
                    ? <Divider
                        className='fill-width'
                        rightClassName='z-1'
                        leftClassName='z-2'
                        defaultSlider={0}
                        collapsed={!storyContext.sidePanelExpanded}
                        minLeft='8em'
                        minRight='2em'
                        left={<FileSystem fileId={fileId}/>}
                        right={<FileView fileId={fileId} editEnabled={storyContext.editEnabled}/>}
                        collapsedLeft={<FileSystemCollapsedMenu/>}/>
                    : <FileView fileId={fileId} editEnabled={storyContext.editEnabled}/>
                }
            </RollContext>
        </div>
    )
}

export default StoryView
