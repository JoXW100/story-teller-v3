import { useMemo, useState } from 'react'
import SpellGroups from '../spell/groups'
import PageSelector, { type IPageSelectorData } from '../pageSelector'
import type { FileContextDispatch } from 'components/contexts/file'
import { asObjectId, isKeyOf, isObjectId, keysOf } from 'utils'
import { OptionalAttribute, type SpellLevel, SpellPreparationType } from 'structure/dnd'
import Elements from 'components/elements'
import type CharacterFacade from 'structure/database/files/character/facade'
import type { ObjectId } from 'types'
import type { SpellData } from 'structure/database/files/spell/factory'
import type { ICreatureStats } from 'types/editor'
import { RollMethodType, RollType } from 'structure/dice'
import { getOptionType } from 'structure/optionData'

type ClassSpellGroupsProps = React.PropsWithRef<{
    facade: CharacterFacade
    spells: Record<ObjectId, SpellData>
    setStorage: FileContextDispatch['setStorage']
}>

const ClassSpellGroups: React.FC<ClassSpellGroupsProps> = ({ facade, spells, setStorage }) => {
    const [selectedPage, setSelectedPage] = useState<ObjectId | 'none'>('none')
    const pages = useMemo(() => {
        const pages: Record<ObjectId | 'none', IPageSelectorData> = {} as any
        if (facade.spellAttribute !== OptionalAttribute.None) {
            pages.none = { key: 'render-spells' }
        }
        for (const classId of keysOf(facade.classes)) {
            if (facade.getClassSpellAttribute(classId) !== OptionalAttribute.None) {
                pages[classId] = { key: 'empty', args: [facade.classesData[classId].name] }
            }
        }
        return pages
    }, [facade])
    const selectedClass = useMemo(() => isObjectId(selectedPage) && isKeyOf(selectedPage, pages)
        ? selectedPage
        : asObjectId(keysOf(pages).find((key) => key !== 'none'))
    , [selectedPage, pages])
    const preparedSpells = useMemo(() => {
        const preparedSpells: Record<ObjectId, SpellData> = {}
        if (selectedPage === 'none') {
            for (const id of facade.spells) {
                if (id in spells) {
                    preparedSpells[id] = spells[id]
                }
            }
        } else if (selectedClass !== null) {
            const classPreparations = facade.storage.spellPreparations[selectedClass] ?? {}
            for (const key of keysOf(classPreparations)) {
                const preparation = classPreparations[key]
                switch (preparation) {
                    case SpellPreparationType.None:
                    case SpellPreparationType.Learned:
                        break
                    case SpellPreparationType.FreeCantrip:
                    case SpellPreparationType.AlwaysPrepared:
                    case SpellPreparationType.Cantrip:
                    case SpellPreparationType.Prepared:
                        preparedSpells[key] = spells[key]
                        break
                }
            }
        }
        return preparedSpells
    }, [facade.spells, facade.storage.spellPreparations, selectedClass, selectedPage, spells])
    const spellSlots = useMemo(() => {
        if (selectedPage === 'none') {
            return facade.spellSlots
        } else if (selectedClass !== null) {
            return facade.getClassSpellSlots(selectedClass)
        }
        return {}
    }, [facade, selectedClass, selectedPage])
    const expendedSlots = useMemo(() => {
        if (selectedPage === 'none') {
            return facade.storage.spellsExpendedSlots
        }
        if (selectedClass === null) {
            return {}
        }
        return facade.storage.preparationsExpendedSlots[selectedClass] ?? {}
    }, [facade.storage.preparationsExpendedSlots, facade.storage.spellsExpendedSlots, selectedClass, selectedPage])
    const modifiedStats = useMemo<ICreatureStats>(() => {
        if (selectedPage !== 'none' && selectedClass !== null) {
            return { ...facade.getStats(), casterLevel: Number(facade.classes[selectedClass]), spellAttribute: facade.getClassSpellAttribute(selectedClass) }
        }
        return facade.getStats()
    }, [selectedPage, selectedClass, facade])

    const handleSetExpendedSlots = (slots: Partial<Record<SpellLevel, number>>): void => {
        if (selectedPage !== 'none' && selectedClass !== null) {
            setStorage('preparationsExpendedSlots', { ...facade.storage, [selectedClass]: slots })
        } else {
            setStorage('spellsExpendedSlots', slots)
        }
    }

    return (
        <>
            { Object.keys(pages).length > 1 &&
                <>
                    <PageSelector pages={pages} selected={selectedPage ?? selectedClass} setSelected={setSelectedPage}/>
                    <Elements.line width='2px'/>
                </>
            }
            <Elements.align direction='h' weight='1' width='100%'>
                <Elements.align direction='h' weight='2' width='100%'>
                    <Elements.h2 underline={false}> Spells: </Elements.h2>
                </Elements.align>
                <Elements.align direction='vc' weight='2' width='100%'>
                    <Elements.b>Spellcasting Attribute</Elements.b>
                    <Elements.b>{getOptionType('optionalAttr').options[modifiedStats.spellAttribute]}</Elements.b>
                </Elements.align>
                <Elements.align direction='vc' weight='1' width='100%'>
                    <Elements.b>Spell Modifier</Elements.b>
                    <Elements.roll
                        dice={String(facade.getAttributeModifier(modifiedStats.spellAttribute))}
                        desc='Spell Modifier'
                        details={null}
                        tooltips={null}
                        critRange={20}
                        mode={RollMethodType.Normal}
                        type={RollType.General}/>
                </Elements.align>
                <Elements.space/>
                <Elements.align direction='vc' weight='1' width='100%'>
                    <Elements.b>Spell Attack</Elements.b>
                    <Elements.roll
                        dice={String(facade.spellAttackModifier)}
                        desc='Spell Attack'
                        details={null}
                        tooltips={null}
                        critRange={20}
                        mode={RollMethodType.Normal}
                        type={RollType.Attack}/>
                </Elements.align>
                <Elements.space/>
                <Elements.align direction='vc' weight='1' width='100%'>
                    <Elements.bold>Spell Save</Elements.bold>
                    <Elements.save value={facade.spellSaveModifier} type={null} tooltips={null}/>
                </Elements.align>
            </Elements.align>
            <SpellGroups
                spells={preparedSpells}
                spellSlots={spellSlots}
                expendedSlots={expendedSlots}
                stats={modifiedStats}
                setExpendedSlots={handleSetExpendedSlots}/>
        </>
    )
}

export default ClassSpellGroups
