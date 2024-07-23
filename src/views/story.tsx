import { useContext } from 'react'
import { useRouter } from 'next/router'
import { Context } from 'components/contexts/story'
import AppBar from 'components/layouts/appBar'
import FileSystem from 'components/layouts/fileSystem'
import Divider from 'components/layouts/divider'
import EditButton from 'components/layouts/editButton'
import SettingsButton from 'components/layouts/settingsButton'
import RollHistoryButton from 'components/layouts/rollHistoryButton'
import FileSystemCollapsedMenu from 'components/layouts/fileSystem/collapsedMenu'
import FileView from 'components/layouts/fileView'
import Navigation from 'utils/navigation'
import type { ObjectId } from 'types'
import styles from 'styles/pages/story.module.scss'

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
                right={<FileView fileId={fileId}/>}
                collapsedLeft={<FileSystemCollapsedMenu/>}
            />
        </div>
    )
}

export default StoryView
