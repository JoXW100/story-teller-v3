import { useContext } from 'react'
import Editor from '../editor'
import Divider from '../../controls/divider'
import Renderer from '../renderer'
import FileContext from 'components/contexts/file'
import { Context } from 'components/contexts/story'
import { isObjectId } from 'utils'
import type { ObjectId } from 'types'
import styles from './style.module.scss'

interface DocumentViewParams {
    fileId: ObjectId | null
}

const FileView: React.FC<DocumentViewParams> = ({ fileId }) => {
    const [context] = useContext(Context)

    return isObjectId(fileId) && (
        <FileContext fileId={fileId}>
            { context.editEnabled
                ? <Divider
                    className={styles.divider}
                    minLeft='1em'
                    minRight='1em'
                    left={<Editor/>}
                    right={<Renderer/>}/>
                : <Renderer/>
            }
        </FileContext>
    )
}

export default FileView
