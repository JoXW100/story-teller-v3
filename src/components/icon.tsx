import type { CSSProperties } from 'react'
import Tooltip from '@mui/material/Tooltip'
import IconMap, { type IconType } from 'assets/icons'
import type { LanguageKey } from 'data'
import LocalizedText from './localizedText'

type IconParams = React.PropsWithRef<{
    icon: IconType
    tooltipsId?: LanguageKey
    tooltipsArgs?: any[]
    data?: string
    className?: string
    style?: CSSProperties
}>

export const Icon: React.FC<IconParams> = ({ icon, tooltipsId, tooltipsArgs, ...props }) => {
    const Component = IconMap[icon]
    if (tooltipsId !== undefined) {
        return (
            <Tooltip title={<LocalizedText id='render-spell-concentration'/>}>
                <Component {...props}/>
            </Tooltip>
        )
    } else {
        return <Component {...props}/>
    }
}

export default Icon
