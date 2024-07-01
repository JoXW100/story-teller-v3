import Icons from 'assets/icons'
import Elements from 'components/elements'
import type { LanguageKey } from 'data'
import { isKeyOf } from 'utils'
import { useLocalizedText } from 'utils/hooks/localizedText'
import { RollMethodType, RollType } from 'structure/dice'
import { EffectType } from 'structure/database/effect/common'
import { getOptionType } from 'structure/optionData'
import type { Effect } from 'structure/database/effect/factory'
import type { ICreatureStats } from 'types/editor'
import styles from './styles.module.scss'

type EffectRendererProps = React.PropsWithRef<{
    data: Effect
    stats: ICreatureStats
    desc: string
    tooltipsId: LanguageKey
    tooltipsArgs?: any[]
}>

const EffectRenderer: React.FC<EffectRendererProps> = ({ data, stats, desc, tooltipsId, tooltipsArgs = [] }) => {
    const tooltips = useLocalizedText(tooltipsId, tooltipsArgs)
    return (
        <div className={styles.iconRow}>
            <Elements.b>{data.label} </Elements.b>
            { data.type === EffectType.Text
                ? data.text
                : <Elements.roll
                    dice={data.getDiceRollText(stats)}
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
            }
        </div>
    )
}

export default EffectRenderer
