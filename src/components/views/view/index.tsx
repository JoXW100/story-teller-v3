import { useRouter } from 'next/router'
import AppBar from 'components/controls/appBar'
import SettingsButton from 'components/controls/settingsButton'
import RollHistoryButton from 'components/controls/rollHistoryButton'
import RollContext from 'components/contexts/roll'
import FileView from 'components/views/fileView'
import Navigation from 'utils/navigation'
import type { ObjectId } from 'types'
import styles from './style.module.scss'

interface ViewViewProps {
    fileId: ObjectId | null
}

const ViewView: React.FC<ViewViewProps> = ({ fileId }) => {
    const router = useRouter()

    const handleBack = (): void => {
        void router.push(Navigation.homeURL())
    }

    return (
        <div className={styles.view}>
            <RollContext>
                <AppBar headerId='view-header' iconId='story' handleBack={handleBack}>
                    <SettingsButton/>
                    <RollHistoryButton/>
                </AppBar>
                <FileView fileId={fileId}/>
            </RollContext>
        </div>
    )
}

export default ViewView
