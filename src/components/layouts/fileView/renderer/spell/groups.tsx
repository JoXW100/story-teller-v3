import React, { useMemo } from 'react'
import { SpellToggleRenderer } from '.'
import ChargesRenderer from '../charges'
import Elements from 'components/elements'
import { keysOf } from 'utils'
import { SpellLevel } from 'structure/dnd'
import { getOptionType } from 'structure/optionData'
import { EmptyCreatureStats } from 'structure/database'
import type { ObjectId } from 'types'
import type { ICreatureStats } from 'types/editor'
import type { ISpellData } from 'types/database/files/spell'

type SpellGroupsProps = React.PropsWithRef<{
    spells: Record<ObjectId, ISpellData>
    spellSlots: Partial<Record<SpellLevel, number>>
    expendedSlots: Partial<Record<SpellLevel, number>>
    stats?: ICreatureStats
    setExpendedSlots?: (value: Partial<Record<SpellLevel, number>>) => void
}>

const SpellGroups: React.FC<SpellGroupsProps> = ({ spells, spellSlots, expendedSlots, stats = EmptyCreatureStats, setExpendedSlots }) => {
    const categories = useMemo(() => {
        const categories: Partial<Record<SpellLevel, Array<keyof typeof spells>>> = {}
        for (const key of keysOf(spells)) {
            const spell = spells[key]
            categories[spell.level] = [...categories[spell.level] ?? [], key]
        }
        return categories
    }, [spells])

    const option = getOptionType('spellLevel')

    return (
        <>
            { keysOf(spellSlots).map(level => (
                <React.Fragment key={level}>
                    <Elements.row>
                        <Elements.b>
                            { option.options[level] }
                        </Elements.b>
                        { level !== SpellLevel.Cantrip &&
                            <ChargesRenderer
                                charges={spellSlots[level] ?? 0}
                                expended={expendedSlots[level] ?? 0}
                                setExpended={(value) => { setExpendedSlots?.({ ...expendedSlots, [level]: value }) }}/>
                        }
                    </Elements.row>
                    <Elements.space/>
                    { categories[level]?.map((id) =>
                        <SpellToggleRenderer key={id} id={id} data={spells[id]} stats={stats}/>
                    )}
                    <Elements.space/>
                </React.Fragment>
            ))}
        </>
    )
}

export default SpellGroups
