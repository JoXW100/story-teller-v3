import { useRouter } from 'next/router'
import { openDialog } from '../../dialogs/handler'
import EmptyCard from './empty'
import RemoveIcon from '@mui/icons-material/DeleteOutlineOutlined'
import EditIcon from '@mui/icons-material/DriveFileRenameOutline'
import { Tooltip } from '@mui/material'
import LocalizedText from 'components/controls/localizedText'
import type DatabaseStory from 'structure/database/story'
import Navigation from 'utils/navigation'
import Communication from 'utils/communication'
import Logger from 'utils/logger'
import styles from './style.module.scss'

interface StoryCardProps {
    story: DatabaseStory
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
    const router = useRouter()

    const handleDeleteConfirmed = (): void => {
        Communication.deleteStory(story.id).then((response) => {
            if (response.success) {
                router.reload()
            } else {
                if (response.result !== null) {
                    openDialog('notice', {
                        id: 'storyCardNotice',
                        headerTextId: 'dialog-notice-error-header',
                        bodyTextId: 'dialog-notice-error-body',
                        bodyTextArgs: [response.result]
                    })
                }
                Logger.error('StoryCard.deleteStory', response.result)
            }
        }, (error: unknown) => {
            Logger.throw('StoryCard.deleteStory', error)
        })
    }

    const handleDelete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation()
        e.preventDefault()
        openDialog('confirmation', {
            id: 'deleteStory',
            headerTextId: 'dialog-confirm-deletion-header',
            headerTextArgs: [story.name],
            bodyTextId: 'dialog-confirm-common-body'
        }).onConfirm(handleDeleteConfirmed)
    }

    const handleEdit: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation()
        e.preventDefault()
        void router.push(Navigation.editStoryURL(story.id))
    }

    return (
        <EmptyCard header={story.name} href={Navigation.storyURL(story.id)}>
            <div className={styles.description}>
                <div>
                    {story.description}
                </div>
            </div>
            <div className={styles.bottomBar}>
                <Tooltip title={<LocalizedText id='stories-card-tooltip-delete'/>}>
                    <button
                        className='icon square circular-center padding-small margin-none'
                        onClick={handleDelete}>
                        <RemoveIcon/>
                    </button>
                </Tooltip>
                <Tooltip title={<LocalizedText id='stories-card-tooltip-edit'/>}>
                    <button
                        className='icon square circular-center padding-small margin-none'
                        onClick={handleEdit}>
                        <EditIcon/>
                    </button>
                </Tooltip>
                <Tooltip title={<LocalizedText id='stories-card-tooltip-dateUpdated'/>}>
                    <div className='justify-right no-line-break'>
                        { new Date(story.dateUpdated).toLocaleDateString('se-SW', {
                            hour: 'numeric',
                            minute: 'numeric'
                        })}
                    </div>
                </Tooltip>
            </div>
        </EmptyCard>
    )
}

export default StoryCard
