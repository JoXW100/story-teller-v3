import { useContext } from 'react'
import ExpandIcon from '@mui/icons-material/ChevronRightSharp'
import { Tooltip } from '@mui/material'
import { Context } from 'components/contexts/story'
import LocalizedText from 'components/controls/localizedText'
import styles from './style.module.scss'

const FileSystemCollapsedMenu: React.FC = () => {
    const [, dispatch] = useContext(Context)

    return (
        <div className='fill-height'>
            <Tooltip title={<LocalizedText id='common-expand'/>}>
                <button
                    className={styles.collapsedButton}
                    onClick={dispatch.expandSizePanel}>
                    <ExpandIcon/>
                </button>
            </Tooltip>
        </div>
    )
}

export default FileSystemCollapsedMenu
