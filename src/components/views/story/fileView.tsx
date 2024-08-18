import { useContext } from 'react'
import Editor from '../editor'
import Renderer from '../renderer'
import FileHomeView from './fileHomeView'
import { Context, ViewMode } from 'components/contexts/app'
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
    const [context] = useContext(Context)

    if (!isObjectId(fileId)) {
        return <FileHomeView/>
    }

    return (
        <FileContext fileId={fileId}>
            { context.viewMode === ViewMode.SplitView && editEnabled &&
                <Divider
                    className={styles.divider}
                    minLeft='1em'
                    minRight='1em'
                    left={<Editor/>}
                    right={<Renderer/>}/>
            }{ context.viewMode === ViewMode.Exclusive && editEnabled &&
                <Editor/>
            }{ !editEnabled &&
                <Renderer/>
            }
        </FileContext>
    )
}

export default FileView
