import { useMemo, useState } from 'react'
import SpellGroups from '../spell/groups'
import PageSelector, { type IPageSelectorData } from '../pageSelector'
import type { FileContextDispatch } from 'components/contexts/file'
import { isObjectId, keysOf } from 'utils'
import { OptionalAttribute, type SpellLevel, SpellPreparationType } from 'structure/dnd'
import { getPreviousClassLevels } from 'utils/calculations'
import Elements from 'components/elements'
import type CharacterFacade from 'structure/database/files/character/facade'
import type { ObjectId } from 'types'
import type { SpellData } from 'structure/database/files/spell/factory'
import { LevelModifyType } from 'structure/database/files/class/levelData'
import type { ICreatureStats } from 'types/editor'
import { RollMethodType, RollType } from 'structure/dice'
import { getOptionType } from 'structure/optionData'

type ClassSpellGroupsProps = React.PropsWithRef<{
    facade: CharacterFacade
    spells: Record<ObjectId, SpellData>
    stats: ICreatureStats
    setStorage: FileContextDispatch['setStorage']
}>

const ClassSpellGroups: React.FC<ClassSpellGroupsProps> = ({ facade, spells, stats, setStorage }) => {
    const [selectedPage, setSelectedPage] = useState<ObjectId | 'none' | null>(facade.spellAttribute === OptionalAttribute.None ? null : 'none')
    const selectedClass = useMemo(() =>
        isObjectId(selectedPage) && selectedPage in facade.classesData &&
        facade.classesData[selectedPage].levels[facade.classes[selectedPage]].spellAttribute !== OptionalAttribute.None
            ? selectedPage
            : keysOf(facade.classes).find((key) =>
                key in facade.classesData && facade.classesData[key].levels[facade.classes[key]].spellAttribute !== OptionalAttribute.None
            ) ?? null
    , [facade.classes, facade.classesData, selectedPage])
    const pages = useMemo(() => {
        const pages: Record<ObjectId | 'none', IPageSelectorData> = {} as any
        if (facade.spellAttribute !== OptionalAttribute.None) {
            pages.none = { key: 'render-spells' }
        }
        for (const classId of keysOf(facade.classes)) {
            if (classId in facade.classesData) {
                const classLevel = facade.classes[classId]
                const classData = facade.classesData[classId]
                if (classData.levels[classLevel].spellAttribute !== OptionalAttribute.None) {
                    pages[classId] = { key: 'empty', args: [classData.name] }
                }
            }
        }
        return pages
    }, [facade.classes, facade.classesData, facade.spellAttribute])
    const preparedSpells = useMemo(() => {
        const preparedSpells: Record<ObjectId, SpellData> = {}
        if (selectedPage === 'none') {
            for (const id of facade.spells) {
                if (id in spells) {
                    preparedSpells[id] = spells[id]
                }
            }
        } else if (selectedClass !== null && selectedClass in facade.classesData) {
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
    }, [facade.classesData, facade.spells, facade.storage.spellPreparations, selectedClass, selectedPage, spells])
    const spellSlots = useMemo(() => {
        if (selectedPage === 'none') {
            return facade.spellSlots
        }
        let spellSlots: Partial<Record<SpellLevel, number>> = {}
        if (selectedClass !== null && selectedClass in facade.classesData) {
            const classLevel = facade.classes[selectedClass]
            const classData = facade.classesData[selectedClass]
            for (const level of getPreviousClassLevels(classLevel)) {
                const levelData = classData.levels[level]
                switch (levelData.type) {
                    case LevelModifyType.Add:
                        for (const spellLevel of keysOf(levelData.spellSlots)) {
                            spellSlots[spellLevel] = (spellSlots[spellLevel] ?? 0) + (levelData.spellSlots[spellLevel] ?? 0)
                        }
                        break
                    case LevelModifyType.Replace:
                        spellSlots = { ...levelData.spellSlots }
                        break
                }
            }
        }
        return spellSlots
    }, [facade.classes, facade.classesData, facade.spellSlots, selectedClass, selectedPage])
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
        if (selectedPage !== 'none' && selectedClass !== null && selectedClass in facade.classesData) {
            return { ...stats, spellAttribute: facade.classesData[selectedClass].levels[facade.classes[selectedClass]].spellAttribute }
        }
        return stats
    }, [selectedPage, selectedClass, facade.classesData, facade.classes, stats])

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
