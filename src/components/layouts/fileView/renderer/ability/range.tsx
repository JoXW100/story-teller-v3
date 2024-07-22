import Elements from 'components/elements'
import LocalizedText from 'components/localizedText'
import { useLocalizedText } from 'utils/hooks/localizedText'
import { AbilityType } from 'structure/database/files/ability/common'
import type { AbilityData } from 'structure/database/files/ability/factory'
import styles from '../styles.module.scss'

type AbilityRangeProps = React.PropsWithRef<{
    data: AbilityData
}>

const AbilityRange: React.FC<AbilityRangeProps> = ({ data }) => {
    const targetIconTooltips = useLocalizedText(data.type === AbilityType.Attack && data.targetIcon !== null ? `icon-${data.targetIcon}` : null) ?? null
    switch (data.type) {
        case AbilityType.Attack:
            return (
                <div>
                    <LocalizedText id='render-range' className='font-bold'/>
                    {data.targetText}
                    { data.targetIcon !== null &&
                        <span className={styles.iconRow}>
                            <Elements.icon icon={data.targetIcon} tooltips={targetIconTooltips}/>
                        </span>
                    }
                </div>
            )
        case AbilityType.RangedAttack:
        case AbilityType.RangedWeapon:
            return (
                <div>
                    <LocalizedText id='render-range' className='font-bold'/>
                    {`${data.range} (${data.rangeLong}) ft`}
                </div>
            )
        case AbilityType.MeleeAttack:
        case AbilityType.MeleeWeapon:
            return (
                <div>
                    <LocalizedText id='render-reach' className='font-bold'/>
                    {`${data.reach} ft`}
                </div>
            )
        case AbilityType.ThrownWeapon:
            return (
                <div>
                    <LocalizedText id='render-reach' className='font-bold'/>
                    {`${data.reach} ft`}
                    <br/>
                    <LocalizedText id='render-range' className='font-bold'/>
                    {`${data.range} (${data.rangeLong}) ft`}
                </div>
            )
        case AbilityType.Feature:
        case AbilityType.Custom:
        default:
            return null
    }
}

export default AbilityRange
