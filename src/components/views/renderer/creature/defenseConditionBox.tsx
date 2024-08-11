import { Tooltip } from '@mui/material'
import SourceTooltips from './sourceTooltips'
import Elements from 'components/elements'
import Icon from 'components/controls/icon'
import { keysOf } from 'utils'
import { AdvantageBinding } from 'structure/dnd'
import type CreatureFacade from 'structure/database/files/creature/facade'
import type { ISourceBinding } from 'types/database/files/creature'
import { useMemo } from 'react'
import styles from '../styles.module.scss'

function getAdvantageBindingSources(sources: Partial<Record<AdvantageBinding, readonly ISourceBinding[]>>): ISourceBinding[] {
    const result: ISourceBinding[] = []
    for (const type of [AdvantageBinding.Generic, AdvantageBinding.Attack, AdvantageBinding.Checks, AdvantageBinding.Saves, AdvantageBinding.SkillChecks]) {
        if (type in sources) {
            for (const source of sources[type]!) {
                result.push(source)
            }
        }
    }
    return result
}

type DefenseConditionBoxProps = React.PropsWithRef<{
    facade: CreatureFacade
}>

const DefenseConditionBox: React.FC<DefenseConditionBoxProps> = ({ facade }) => {
    const advantages = useMemo(() => {
        return getAdvantageBindingSources(facade.advantages)
    }, [facade])
    const disadvantages = useMemo(() => {
        return getAdvantageBindingSources(facade.disadvantages)
    }, [facade])

    const damageImmunities = facade.damageImmunities
    const conditionImmunities = facade.conditionImmunities
    const resistances = facade.resistances
    const vulnerabilities = facade.vulnerabilities
    return (
        <Elements.align direction='h' weight={null} width={null}>
            <div className={styles.defensesBox}>
                <b>Defenses</b>
                { advantages.length > 0 &&
                    <Tooltip title={<SourceTooltips type='advantage' sources={advantages}/>}>
                        <span>
                            <Icon className='small-icon' icon='advantage'/>
                        </span>
                    </Tooltip>
                }{ disadvantages.length > 0 &&
                    <Tooltip title={<SourceTooltips type='advantage' sources={disadvantages}/>}>
                        <span>
                            <Icon className='small-icon' icon='advantage'/>
                        </span>
                    </Tooltip>
                }{ keysOf(damageImmunities).map((binding) =>
                    <Tooltip key={`dmg-${binding}`} title={<SourceTooltips type='damageImmunity' sources={damageImmunities[binding]}/>}>
                        <span>
                            <Icon className='small-icon' icon='immunity'/>
                            { facade.translator(`enum-damageBinding-${binding}`) }
                        </span>
                    </Tooltip>
                )}{ keysOf(conditionImmunities).map((binding) =>
                    <Tooltip key={`cnd-${binding}`} title={<SourceTooltips type='conditionImmunity' sources={conditionImmunities[binding]}/>}>
                        <span>
                            <Icon className='small-icon' icon='immunity'/>
                            { facade.translator(`enum-conditionBinding-${binding}`) }
                        </span>
                    </Tooltip>
                )}{ keysOf(resistances).map((binding) =>
                    <Tooltip key={`res-${binding}`} title={<SourceTooltips type='resistance' sources={resistances[binding]}/>}>
                        <span>
                            <Icon className='small-icon' icon='resistance'/>
                            { facade.translator(`enum-damageBinding-${binding}`) }
                        </span>
                    </Tooltip>
                )}{ keysOf(vulnerabilities).map((binding) =>
                    <Tooltip key={`vul-${binding}`} title={<SourceTooltips type='vulnerability' sources={vulnerabilities[binding]}/>}>
                        <span>
                            <Icon className='small-icon' icon='vulnerability'/>
                            { facade.translator(`enum-damageBinding-${binding}`) }
                        </span>
                    </Tooltip>
                )}
            </div>
            <div className={styles.defensesBox}>
                <b>Conditions</b>
                { keysOf(facade.conditions).map((id) =>
                    <Tooltip key={id} title={facade.conditions[id].description}>
                        <span>{ facade.conditions[id].name }</span>
                    </Tooltip>
                )}
            </div>
        </Elements.align>
    )
}

export default DefenseConditionBox
