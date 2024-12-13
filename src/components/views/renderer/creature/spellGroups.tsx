import React, { useMemo } from 'react'
import ChargesRenderer from '../charges'
import SpellToggleRenderer from '../spell/toggle'
import Elements from 'components/elements'
import { keysOf } from 'utils'
import { useLocalizedEnums } from 'utils/hooks/localization'
import { OptionalAttribute, SpellLevel } from 'structure/dnd'
import type CreatureFacade from 'structure/database/files/creature/facade'
import type { ObjectId } from 'types'
import type { ISpellData } from 'types/database/files/spell'

type SpellGroupsProps = React.PropsWithRef<{
    facade: CreatureFacade
    spells: Record<ObjectId, ISpellData>
    spellSlots: Partial<Record<SpellLevel, number>>
    expendedSlots: Partial<Record<SpellLevel, number>>
    setExpendedSlots?: (value: Partial<Record<SpellLevel, number>>) => void
}>

const SpellGroups: React.FC<SpellGroupsProps> = ({ facade, spells, spellSlots, expendedSlots, setExpendedSlots }) => {
    const stats = useMemo(() => facade.createProperties(), [facade])
    const options = useLocalizedEnums('spellLevel')
    const categories = useMemo(() => {
        const categories: Partial<Record<SpellLevel, (keyof typeof spells)[]>> = {}
        for (const key of keysOf(spellSlots)) {
            categories[key] = []
        }
        for (const key of keysOf(spells)) {
            const spell = spells[key]
            categories[spell.level] = [...categories[spell.level] ?? [], key]
        }
        return categories
    }, [spellSlots, spells])
    const spellAttributeMap = facade.spells

    return (
        <>
            { keysOf(categories).map(level => (
                <React.Fragment key={level}>
                    <Elements.row>
                        <Elements.b>{ options[level] }</Elements.b>
                        { level !== SpellLevel.Cantrip &&
                            <ChargesRenderer
                                charges={spellSlots[level] ?? 0}
                                expended={expendedSlots[level] ?? 0}
                                setExpended={(value) => { setExpendedSlots?.({ ...expendedSlots, [level]: value }) }}/>
                        }
                    </Elements.row>
                    <Elements.space/>
                    { categories[level]?.map((id) =>
                        <SpellToggleRenderer
                            key={id}
                            data={spells[id]}
                            properties={{
                                ...stats,
                                spellAttribute: spellAttributeMap[id] !== OptionalAttribute.None
                                    ? spellAttributeMap[id] ?? facade.spellAttribute
                                    : facade.spellAttribute
                            }}
                            startCollapsed/>
                    )}
                    <Elements.space/>
                </React.Fragment>
            ))}
        </>
    )
}

export default SpellGroups
