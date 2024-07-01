import FileContext from 'components/contexts/file'
import Editor from './editor'
import Divider from '../divider'
import Renderer from './renderer'
import type { ObjectId } from 'types'
import styles from './style.module.scss'

interface DocumentViewParams {
    fileId: ObjectId | null
}

const FileView: React.FC<DocumentViewParams> = ({ fileId }) => {
    if (fileId === null) {
        return null
    }
    return (
        <FileContext fileId={fileId}>
            <Divider
                className={styles.divider}
                minLeft='1em'
                minRight='1em'
                left={<Editor/>}
                right={<Renderer/>}/>
        </FileContext>
    )
}

export default FileView
