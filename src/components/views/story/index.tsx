import { useContext } from 'react'
import { useRouter } from 'next/router'
import { Context } from 'components/contexts/story'
import RollContext from 'components/contexts/roll'
import AppBar from 'components/controls/appBar'
import FileSystem from 'components/controls/fileSystem'
import Divider from 'components/controls/divider'
import EditButton from 'components/controls/editButton'
import SettingsButton from 'components/controls/settingsButton'
import RollHistoryButton from 'components/controls/rollHistoryButton'
import FileSystemCollapsedMenu from 'components/controls/fileSystem/collapsedMenu'
import FileView from 'components/views/fileView'
import Navigation from 'utils/navigation'
import type { ObjectId } from 'types'
import styles from './style.module.scss'

interface StoryViewProps {
    fileId: ObjectId | null
}

const StoryView: React.FC<StoryViewProps> = ({ fileId }) => {
    const router = useRouter()
    const [context] = useContext(Context)

    const handleBack = (): void => {
        void router.push(Navigation.homeURL())
    }

    return (
        <div className={styles.view}>
            <RollContext>
                <AppBar headerId='empty' headerArgs={[context.story.name]} iconId='story' handleBack={handleBack}>
                    <SettingsButton/>
                    <EditButton/>
                    <RollHistoryButton/>
                </AppBar>
                <Divider
                    className='fill-width'
                    leftClassName='z-2'
                    rightClassName='z-1'
                    defaultSlider={0}
                    collapsed={!context.sidePanelExpanded}
                    minLeft='8em'
                    minRight='2em'
                    left={<FileSystem fileId={fileId}/>}
                    right={<FileView fileId={fileId} editEnabled={context.editEnabled}/>}
                    collapsedLeft={<FileSystemCollapsedMenu/>}
                />
            </RollContext>
        </div>
    )
}

export default StoryView
