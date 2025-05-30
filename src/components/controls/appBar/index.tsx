import { Tooltip } from '@mui/material'
import BackIcon from '@mui/icons-material/ArrowBackSharp'
import Icon from 'components/controls/icon'
import LocalizedText from 'components/controls/localizedText'
import type { IconType } from 'assets/icons'
import type { LanguageKey } from 'assets'
import styles from './style.module.scss'

type AppBarProps = React.PropsWithChildren<{
    headerId: LanguageKey
    headerArgs?: (string | number)[]
    iconId: IconType
    handleBack?: () => void
}>

const AppBar: React.FC<AppBarProps> = ({ children, headerId, headerArgs, iconId, handleBack }) => {
    return (
        <div id='app-bar' className={styles.main}>
            { handleBack !== undefined &&
                <Tooltip className='square' title={<LocalizedText id='component-appBar-backButton-tooltips'/>}>
                    <button onClick={handleBack}>
                        <BackIcon/>
                    </button>
                </Tooltip>
            }
            { children }
            <span className={styles.header}>
                <Icon className='icon' icon={iconId}/>
                <LocalizedText className='no-line-break' id={headerId} args={headerArgs}/>
            </span>
        </div>
    )
}

export default AppBar
