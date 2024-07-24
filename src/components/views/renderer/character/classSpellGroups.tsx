import { useEffect, useMemo, useState } from 'react'
import SpellGroups from '../spell/groups'
import PageSelector, { type IPageSelectorData } from '../pageSelector'
import type { FileContextDispatch } from 'components/contexts/file'
import Elements from 'components/elements'
import { asObjectId, isObjectId, keysOf } from 'utils'
import { useLocalizedOptions } from 'utils/hooks/localization'
import { OptionalAttribute, type SpellLevel, SpellPreparationType } from 'structure/dnd'
import type CharacterFacade from 'structure/database/files/character/facade'
import type { SpellData } from 'structure/database/files/spell/factory'
import { RollMethodType, RollType } from 'structure/dice'
import type { ObjectId } from 'types'
import type { ICreatureStats } from 'types/editor'

type ClassSpellGroupsProps = React.PropsWithRef<{
    facade: CharacterFacade
    spells: Record<ObjectId, SpellData>
    setStorage: FileContextDispatch['setStorage']
}>

const ClassSpellGroups: React.FC<ClassSpellGroupsProps> = ({ facade, spells, setStorage }) => {
    const [selectedClass, setSelectedClass] = useState<ObjectId | null>(null)
    const options = useLocalizedOptions('optionalAttr')
    const pages = useMemo(() => {
        const pages: Record<ObjectId | 'none', IPageSelectorData> = {} as any
        if (facade.spellAttribute !== OptionalAttribute.None || keysOf(facade.spells).length > 0) {
            pages.none = { key: 'render-spells' }
        }
        for (const classId of keysOf(facade.classes)) {
            if (facade.getClassSpellAttribute(classId) !== OptionalAttribute.None) {
                pages[classId] = { key: 'empty', args: [facade.classesData[classId].name] }
            }
        }
        return pages
    }, [facade])
    const preparedSpells = useMemo(() => {
        const preparedSpells: Record<ObjectId, SpellData> = {}
        if (selectedClass !== null) {
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
        } else {
            for (const id of facade.spells) {
                if (id in spells) {
                    preparedSpells[id] = spells[id]
                }
            }
        }
        return preparedSpells
    }, [facade.spells, facade.storage.spellPreparations, selectedClass, spells])
    const spellSlots = useMemo(() => {
        if (selectedClass !== null) {
            return facade.getClassSpellSlots(selectedClass)
        } else {
            return facade.spellSlots
        }
    }, [facade, selectedClass])
    const expendedSlots = useMemo(() => {
        if (selectedClass !== null) {
            return facade.storage.preparationsExpendedSlots[selectedClass] ?? {}
        } else {
            return facade.storage.spellsExpendedSlots
        }
    }, [facade.storage.preparationsExpendedSlots, facade.storage.spellsExpendedSlots, selectedClass])
    const modifiedStats = useMemo<ICreatureStats>(() => {
        if (selectedClass !== null) {
            return { ...facade.getStats(), casterLevel: Number(facade.classes[selectedClass]), spellAttribute: facade.getClassSpellAttribute(selectedClass) }
        } else {
            return facade.getStats()
        }
    }, [selectedClass, facade])

    useEffect(() => {
        const classIds = keysOf(pages)
        const classId = classIds.find(isObjectId)
        setSelectedClass((selected) => {
            if (selected !== null && classIds.includes(selected)) {
                return selected
            } else {
                return classId ?? null
            }
        })
    }, [facade.classes, pages])

    const handleSetExpendedSlots = (slots: Partial<Record<SpellLevel, number>>): void => {
        if (selectedClass !== null) {
            setStorage('preparationsExpendedSlots', { ...facade.storage, [selectedClass]: slots })
        } else {
            setStorage('spellsExpendedSlots', slots)
        }
    }

    const handlePageChanged = (page: keyof typeof pages): void => {
        setSelectedClass(asObjectId(page))
    }

    if (selectedClass === null && keysOf(preparedSpells).length < 1) {
        return null
    }

    return (
        <>
            { Object.keys(pages).length > 1 &&
                <>
                    <PageSelector pages={pages} selected={selectedClass ?? 'none'} setSelected={handlePageChanged}/>
                    <Elements.line width='2px'/>
                </>
            }
            <Elements.align direction='h' weight='1' width='100%'>
                <Elements.align direction='h' weight='2' width='100%'>
                    <Elements.h2 underline={false}> Spells: </Elements.h2>
                </Elements.align>
                <Elements.align direction='vc' weight='2' width='100%'>
                    <Elements.b>Spellcasting Attribute</Elements.b>
                    <Elements.b>{options[modifiedStats.spellAttribute]}</Elements.b>
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
