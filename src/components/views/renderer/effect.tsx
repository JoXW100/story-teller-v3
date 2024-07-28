import Icons from 'assets/icons'
import Elements from 'components/elements'
import type { LanguageKey } from 'assets'
import { isKeyOf } from 'utils'
import { RollMethodType, RollType } from 'structure/dice'
import { EffectType } from 'structure/database/effect/common'
import type { Effect } from 'structure/database/effect/factory'
import { useLocalizedEnums, useLocalizedText } from 'utils/hooks/localization'
import type { IBonusGroup, IProperties } from 'types/editor'
import styles from './styles.module.scss'

type EffectRendererProps = React.PropsWithRef<{
    data: Effect
    properties: IProperties
    bonuses: IBonusGroup
    desc: string
    tooltipsId: LanguageKey
    tooltipsArgs?: any[]
}>

const EffectRenderer: React.FC<EffectRendererProps> = ({ data, properties, bonuses, desc, tooltipsId, tooltipsArgs = [] }) => {
    const tooltips = useLocalizedText(tooltipsId, tooltipsArgs)
    const options = useLocalizedEnums('damageType')
    switch (data.type) {
        case EffectType.Text:
            return (
                <div className={styles.iconRow}>
                    <Elements.b>{data.label} </Elements.b>
                    { data.text }
                </div>
            )
        case EffectType.Damage:
            return (
                <div className={styles.iconRow}>
                    <Elements.b>{data.label} </Elements.b>
                    <Elements.roll
                        dice={data.getDiceRollText(properties, bonuses)}
                        desc={desc}
                        details={null}
                        tooltips={tooltips}
                        critRange={properties.critRange}
                        critDieCount={properties.critDieCount}
                        mode={RollMethodType.Normal}
                        type={RollType.Damage}>
                        { isKeyOf(data.damageType, Icons) &&
                            <Elements.icon
                                icon={data.damageType}
                                tooltips={options[data.damageType]}/>
                        }
                    </Elements.roll>
                </div>
            )
        case EffectType.Die:
            return (
                <div className={styles.iconRow}>
                    <Elements.b>{data.label} </Elements.b>
                    <Elements.roll
                        dice={data.getDiceRollText(properties)}
                        desc={desc}
                        details={null}
                        tooltips={tooltips}
                        critRange={properties.critRange}
                        critDieCount={properties.critDieCount}
                        mode={RollMethodType.Normal}
                        type={RollType.General}/>
                </div>
            )
    }
}

export default EffectRenderer
