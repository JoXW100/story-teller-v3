import { useEffect, useState } from 'react'
import { AbilityLinkRenderer } from './link'
import type { LanguageKey } from 'data'
import CollapsibleGroup from 'components/layouts/collapsibleGroup'
import { keysOf } from 'utils'
import { ActionType } from 'structure/dnd'
import { EmptyCreatureStats } from 'structure/database'
import type { IAbilityData } from 'types/database/files/ability'
import type { ICreatureStats } from 'types/editor'
import LocalizedText from 'components/localizedText'

interface AbilityCategory {
    headerId: LanguageKey
    headerArgs?: any[]
    content: string[]
}

type AbilityGroupsProps = React.PropsWithRef<{
    abilities: Record<string, IAbilityData>
    stats?: ICreatureStats
    expendedCharges: Record<string, number>
    setExpendedCharges?: (value: Record<string, number>) => void
}>

const AbilityGroups: React.FC<AbilityGroupsProps> = ({ abilities, stats = EmptyCreatureStats, expendedCharges, setExpendedCharges }) => {
    const [categories, setCategories] = useState<Partial<Record<ActionType, AbilityCategory>>>({})

    useEffect(() => {
        const attacks: number = stats.multiAttack
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

        setCategories(categories)
    }, [abilities, stats.multiAttack])

    const handleSetExpendedCharges = (value: number, key: string): void => {
        setExpendedCharges?.({ ...expendedCharges, [key]: value })
    }

    return keysOf(categories)
        .map((type) => categories[type]!.content.length > 0 &&
            <CollapsibleGroup key={type} header={<LocalizedText id={categories[type]!.headerId} args={categories[type]!.headerArgs}/>}>
                { categories[type]!.content.map((key) => key in abilities && (
                    <AbilityLinkRenderer
                        id={key}
                        key={key}
                        data={abilities[key]}
                        stats={stats}
                        expendedCharges={isNaN(expendedCharges[key]) ? 0 : expendedCharges[key]}
                        setExpendedCharges={(value) => { handleSetExpendedCharges(value, key) }}/>
                ))}
            </CollapsibleGroup>
        )
}

export default AbilityGroups
