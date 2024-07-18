import LocalizedText from 'components/localizedText'
import { AbilityType } from 'structure/database/files/ability/common'
import type { AbilityData } from 'structure/database/files/ability/factory'

type AbilityRangeProps = React.PropsWithRef<{
    data: AbilityData
}>

const AbilityRange: React.FC<AbilityRangeProps> = ({ data }) => {
    switch (data.type) {
        case AbilityType.Attack:
            return (
                <div>
                    <LocalizedText id='render-range' className='font-bold'/>
                    {`${data.range} ft`}
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
        case AbilityType.Feat:
        case AbilityType.FightingStyle:
        default:
            return null
    }
}

export default AbilityRange
