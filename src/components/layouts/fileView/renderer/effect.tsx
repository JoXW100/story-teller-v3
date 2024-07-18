import Icons from 'assets/icons'
import Elements from 'components/elements'
import type { LanguageKey } from 'data'
import { isKeyOf } from 'utils'
import { useLocalizedText } from 'utils/hooks/localizedText'
import { RollMethodType, RollType } from 'structure/dice'
import { EffectType } from 'structure/database/effect/common'
import { getOptionType } from 'structure/optionData'
import type { Effect } from 'structure/database/effect/factory'
import type { IBonusGroup, ICreatureStats } from 'types/editor'
import styles from './styles.module.scss'

type EffectRendererProps = React.PropsWithRef<{
    data: Effect
    stats: ICreatureStats
    bonuses: IBonusGroup
    desc: string
    tooltipsId: LanguageKey
    tooltipsArgs?: any[]
}>

const EffectRenderer: React.FC<EffectRendererProps> = ({ data, stats, bonuses, desc, tooltipsId, tooltipsArgs = [] }) => {
    const tooltips = useLocalizedText(tooltipsId, tooltipsArgs)
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
                        dice={data.getDiceRollText(stats, bonuses)}
                        desc={desc}
                        details={null}
                        tooltips={tooltips}
                        critRange={stats.critRange}
                        mode={RollMethodType.Normal}
                        type={RollType.Damage}>
                        { isKeyOf(data.damageType, Icons) &&
                            <Elements.icon
                                icon={data.damageType}
                                tooltips={getOptionType('damageType').options[data.damageType]}/>
                        }
                    </Elements.roll>
                </div>
            )
        case EffectType.Die:
            return (
                <div className={styles.iconRow}>
                    <Elements.b>{data.label} </Elements.b>
                    <Elements.roll
                        dice={data.getDiceRollText(stats)}
                        desc={desc}
                        details={null}
                        tooltips={tooltips}
                        critRange={stats.critRange}
                        mode={RollMethodType.Normal}
                        type={RollType.General}/>
                </div>
            )
    }
}

export default EffectRenderer
