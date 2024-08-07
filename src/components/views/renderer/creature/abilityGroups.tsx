import { useMemo } from 'react'
import { AbilityToggleRenderer } from '../ability/toggle'
import type { LanguageKey } from 'assets'
import LocalizedText from 'components/controls/localizedText'
import CollapsibleGroup from 'components/controls/collapsibleGroup'
import { keysOf } from 'utils'
import { ActionType } from 'structure/dnd'
import type CreatureFacade from 'structure/database/files/creature/facade'
import type { IAbilityData } from 'types/database/files/ability'

interface AbilityCategory {
    headerId: LanguageKey
    headerArgs?: any[]
    content: string[]
}

type AbilityGroupsProps = React.PropsWithRef<{
    facade: CreatureFacade
    abilities: Record<string, IAbilityData>
    expendedCharges: Record<string, number>
    setExpendedCharges?: (value: Record<string, number>) => void
}>

const AbilityGroups: React.FC<AbilityGroupsProps> = ({ facade, abilities, expendedCharges, setExpendedCharges }) => {
    const properties = useMemo(() => facade.createProperties(), [facade])
    const attackBonuses = useMemo(() => facade.getAttackBonuses(), [facade])
    const damageBonuses = useMemo(() => facade.getDamageBonuses(), [facade])
    const categories = useMemo(() => {
        const attacks: number = properties.multiAttack
        const categories: Record<ActionType, AbilityCategory> = {
            [ActionType.Action]: {
                headerId: attacks > 1
                    ? 'render-group-actions-multi'
                    : 'render-group-actions',
                headerArgs: [attacks],
                content: []
            },
            [ActionType.BonusAction]: {
                headerId: 'render-group-bonusActions',
                content: []
            },
            [ActionType.Reaction]: {
                headerId: 'render-group-reaction',
                content: []
            },
            [ActionType.Special]: {
                headerId: 'render-group-special',
                content: []
            },
            [ActionType.Legendary]: {
                headerId: 'render-group-legendary',
                content: []
            },
            [ActionType.None]: {
                headerId: 'render-group-other',
                content: []
            }
        }

        for (const key of keysOf(abilities)) {
            const ability = abilities[key]
            if (abilities[key] !== undefined && key != null) {
                categories[ability.action ?? ActionType.Action].content.push(key)
            }
        }
        return categories
    }, [abilities, properties.multiAttack])

    const handleSetExpendedCharges = (value: number, key: string): void => {
        setExpendedCharges?.({ ...expendedCharges, [key]: value })
    }

    return keysOf(categories)
        .map((type) => categories[type].content.length > 0 &&
            <CollapsibleGroup key={type} header={<LocalizedText id={categories[type].headerId} args={categories[type].headerArgs}/>}>
                { categories[type].content.map((key) => key in abilities && (
                    <AbilityToggleRenderer
                        key={key}
                        data={abilities[key]}
                        properties={{ ...properties, classLevel: facade.getClassLevel(key) }}
                        attackBonuses={attackBonuses}
                        damageBonuses={damageBonuses}
                        expendedCharges={isNaN(expendedCharges[key]) ? 0 : expendedCharges[key]}
                        setExpendedCharges={(value) => { handleSetExpendedCharges(value, key) }}
                        startCollapsed/>
                ))}
            </CollapsibleGroup>
        )
}

export default AbilityGroups
