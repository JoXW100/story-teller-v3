import EmptyCard from './empty'
import { Tooltip } from '@mui/material'
import { ElementDictionary } from 'components/elements'
import LocalizedText from 'components/controls/localizedText'
import Navigation from 'utils/navigation'
import type { Document } from 'types/database/files/factory'
import styles from './style.module.scss'

interface FileCardProps {
    file: Document
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
    return (
        <EmptyCard header={file.getTitle()} href={Navigation.fileURL(file.id)}>
            <div className={styles.description}>
                <div>
                    {file.getTokenizedDescription(ElementDictionary).build() }
                </div>
            </div>
            <div className={styles.bottomBar}>
                <div className='font-bold no-line-break'>
                    <span>{`${file.name}.${file.type}`}</span>
                </div>
                <Tooltip title={<LocalizedText id='stories-card-tooltip-dateUpdated'/>}>
                    <div className='justify-right no-line-break'>
                        { new Date(file.dateUpdated).toLocaleDateString('se-SW', {
                            hour: 'numeric',
                            minute: 'numeric'
                        })}
                    </div>
                </Tooltip>
            </div>
        </EmptyCard>
    )
}

export default FileCard
