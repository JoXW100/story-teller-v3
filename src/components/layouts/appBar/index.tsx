import { Tooltip } from '@mui/material'
import BackIcon from '@mui/icons-material/ArrowBackSharp'
import Icon from 'components/icon'
import LocalizedText from 'components/localizedText'
import type { IconType } from 'assets/icons'
import type { LanguageKey } from 'data'
import styles from './style.module.scss'

type AppBarProps = React.PropsWithChildren<{
    headerId: LanguageKey
    headerArgs?: Array<string | number>
    iconId: IconType
    handleBack?: () => void
}>

const AppBar: React.FC<AppBarProps> = ({ children, headerId, headerArgs, iconId, handleBack }) => {
    return (
        <div id='app-bar' className={styles.main}>
            { handleBack !== undefined &&
                <Tooltip title={<LocalizedText id='component-appBar-backButton-tooltips'/>}>
                    <button className='square' onClick={handleBack}>
                        <BackIcon/>
                    </button>
                </Tooltip>
            }
            { children }
            <span className={styles.header}>
                <Icon icon={iconId}/>
                <LocalizedText className='no-line-break' id={headerId} args={headerArgs}/>
            </span>
        </div>
    )
}

export default AppBar
