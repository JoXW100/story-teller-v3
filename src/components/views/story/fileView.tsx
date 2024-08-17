import Editor from '../editor'
import Renderer from '../renderer'
import FileHomeView from './fileHomeView'
import FileContext from 'components/contexts/file'
import Divider from 'components/controls/divider'
import { isObjectId } from 'utils'
import type { ObjectId } from 'types'
import styles from './style.module.scss'

interface DocumentViewParams {
    fileId: ObjectId | null
    editEnabled?: boolean
}

const FileView: React.FC<DocumentViewParams> = ({ fileId, editEnabled = false }) => {
    return isObjectId(fileId)
        ? <FileContext fileId={fileId}>
            { editEnabled
                ? <Divider
                    className={styles.divider}
                    minLeft='1em'
                    minRight='1em'
                    left={<Editor/>}
                    right={<Renderer/>}/>
                : <Renderer/>
            }
        </FileContext>
        : <FileHomeView/>
}

export default FileView
