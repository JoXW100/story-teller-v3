import Tooltip from '@mui/material/Tooltip'
import Icons from 'assets/icons'
import IconElement, { type IconElementParams } from 'structure/elements/icon'
import styles from './styles.module.scss'

export const IconComponent: React.FC<IconElementParams> = ({ icon, tooltips }) => {
    const IconComponent = Icons[icon]
    return (
        <Tooltip title={tooltips} disabled={tooltips === null}>
            <span>
                <IconComponent className={styles.icon}/>
            </span>
        </Tooltip>
    )
}

export const element = {
    'icon': new IconElement(({ key, ...props }) => <IconComponent key={key} {...props}/>)
}

export default IconComponent
