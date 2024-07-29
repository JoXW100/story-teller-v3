import { useEffect, useMemo, useState } from 'react'
import PageSelector, { type IPageSelectorData } from '../pageSelector'
import SpellList from './spellList'
import type { FileContextDispatch } from 'components/contexts/file'
import CollapsibleGroup from 'components/controls/collapsibleGroup'
import LocalizedText from 'components/controls/localizedText'
import Elements from 'components/elements'
import LinkInput from 'components/controls/linkInput'
import { isObjectId, keysOf } from 'utils'
import { getSpellLevelValue } from 'utils/calculations'
import { useLocalizedText } from 'utils/hooks/localization'
import { DocumentFileType } from 'structure/database'
import type DatabaseFile from 'structure/database/files'
import type CharacterFacade from 'structure/database/files/character/facade'
import SpellDocument from 'structure/database/files/spell'
import type { SpellData } from 'structure/database/files/spell/factory'
import { OptionalAttribute, SpellLevel, SpellPreparationType } from 'structure/dnd'
import type { ObjectId } from 'types'
import styles from '../styles.module.scss'

type CharacterSpellPageProps = React.PropsWithRef<{
    facade: CharacterFacade
    spells: Record<ObjectId, SpellData>
    setStorage: FileContextDispatch['setStorage']
}>

const allowedTypes = [DocumentFileType.Spell]

const CharacterSpellPage: React.FC<CharacterSpellPageProps> = ({ facade, spells, setStorage }) => {
    const [spellInput, setSpellInput] = useState<string>('')
    const [selectedClass, setSelectedClass] = useState<ObjectId | null>(null)
    const pages = useMemo(() => {
        const pages: Record<ObjectId, IPageSelectorData> = {}
        for (const classId of keysOf(facade.classes)) {
            if (facade.getClassSpellAttribute(classId) !== OptionalAttribute.None) {
                pages[classId] = { key: 'empty', args: [facade.classesData[classId].name] }
            }
        }
        return pages
    }, [facade])
    const preparations = useMemo(() => facade.getSpellPreparations(), [facade])
    const [knownCantrips, knownSpells, preparedSpells, numKnownCantrips, numKnownSpells, numPreparedSpells] = useMemo(() => {
        const knownCantrips: Record<ObjectId, SpellData> = {}
        const knownSpells: Record<ObjectId, SpellData> = {}
        const preparedSpells: Record<ObjectId, SpellData> = {}
        let numKnownCantrips: number = 0
        let numKnownSpells: number = 0
        let numPreparedSpells: number = 0
        if (selectedClass !== null) {
            const classPreparations = preparations[selectedClass] ?? {}
            for (const key of keysOf(classPreparations)) {
                const preparation = classPreparations[key]
                if (key in spells) {
                    switch (preparation) {
                        case SpellPreparationType.None:
                            break
                        case SpellPreparationType.AlwaysPrepared:
                            if (spells[key].level === SpellLevel.Cantrip) {
                                knownCantrips[key] = spells[key]
                            } else {
                                knownSpells[key] = spells[key]
                            }
                            break
                        case SpellPreparationType.Learned:
                            if (spells[key].level === SpellLevel.Cantrip) {
                                knownCantrips[key] = spells[key]
                                numKnownCantrips++
                            } else {
                                knownSpells[key] = spells[key]
                                numKnownSpells++
                            }
                            break
                        case SpellPreparationType.Prepared:
                            preparedSpells[key] = spells[key]
                            knownSpells[key] = spells[key]
                            numPreparedSpells++
                            numKnownSpells++
                            break
                    }
                }
            }
        }
        return [knownCantrips, knownSpells, preparedSpells, numKnownCantrips, numKnownSpells, numPreparedSpells]
    }, [preparations, selectedClass, spells])
    const [learnedSlots, preparationSlots, spellSlots, maxSpellLevels] = useMemo(() => {
        if (selectedClass === null) {
            return [0, 0, {}, SpellLevel.Cantrip]
        }
        return facade.getClassSpellSlotInfo(selectedClass)
    }, [facade, selectedClass])
    const addSpellPlaceholder = useLocalizedText('render-spellPage-addSpell-placeholder')

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

    const getValidatedPrepared = (): Record<ObjectId, Record<ObjectId, SpellPreparationType>> => {
        const result: Record<ObjectId, Record<ObjectId, SpellPreparationType>> = {}
        for (const classId of keysOf(facade.classes)) {
            if (classId in facade.storage.spellPreparations) {
                const classPreparations = facade.storage.spellPreparations[classId]
                const value: Record<ObjectId, SpellPreparationType> = result[classId] = {}
                for (const preparedId of keysOf(classPreparations)) {
                    if (preparedId in spells) {
                        value[preparedId] = classPreparations[preparedId]
                    }
                }
            }
        }
        return result
    }

    const handleRemoveSpell = (spellId: ObjectId): void => {
        if (selectedClass !== null && selectedClass in facade.storage.spellPreparations) {
            const prepared = getValidatedPrepared()
            const { [spellId]: _, ...rest } = prepared[selectedClass] ?? {}
            prepared[selectedClass] = rest
            setStorage('spellPreparations', prepared)
        }
    }

    const handleRemovePrepared = (spellId: ObjectId): void => {
        if (selectedClass !== null && selectedClass in facade.storage.spellPreparations &&
            preparations[selectedClass][spellId] === SpellPreparationType.Prepared) {
            const prepared = getValidatedPrepared()
            prepared[selectedClass] = { ...(prepared[selectedClass] ?? {}), [spellId]: SpellPreparationType.Learned }
            setStorage('spellPreparations', prepared)
        }
    }

    const handlePrepare = (spellId: ObjectId): void => {
        if (selectedClass !== null && selectedClass in facade.storage.spellPreparations) {
            const prepared = getValidatedPrepared()
            prepared[selectedClass] = { ...(prepared[selectedClass] ?? {}), [spellId]: SpellPreparationType.Prepared }
            setStorage('spellPreparations', prepared)
        }
    }

    const handleAddClick = (value: DatabaseFile | null): void => {
        if (selectedClass !== null && value instanceof SpellDocument && !(value.id in preparations)) {
            const prepared = facade.storage.spellPreparations
            prepared[selectedClass] = {
                ...(prepared[selectedClass] ?? {}),
                [value.id]: SpellPreparationType.Learned
            }
            setStorage('spellPreparations', prepared)
        }
        setSpellInput('')
    }

    const handleValidateAdd = (value: DatabaseFile): boolean => {
        return selectedClass !== null && (!(selectedClass in preparations) || (
            value instanceof SpellDocument && !(value.id in preparations[selectedClass]) &&
                getSpellLevelValue(value.data.level) <= getSpellLevelValue(maxSpellLevels) && (
                (value.data.level !== SpellLevel.Cantrip && numKnownSpells < learnedSlots) ||
                (value.data.level === SpellLevel.Cantrip && numKnownCantrips < (spellSlots[SpellLevel.Cantrip] ?? 0))
            )))
    }

    return (
        <>
            { Object.keys(pages).length > 1 &&
                <>
                    <PageSelector pages={pages} selected={selectedClass} setSelected={setSelectedClass}/>
                    <Elements.line width='2px'/>
                </>
            }
            { selectedClass !== null &&
                <>
                    <SpellList
                        header={<LocalizedText id='render-spellList-knownSpells' args={[numKnownSpells, learnedSlots]}/>}
                        spells={knownSpells}
                        maxLevel={maxSpellLevels}
                        validate={(id) => knownSpells[id].levelValue <= getSpellLevelValue(maxSpellLevels)}
                        removeIsDisabled={(id) => preparations[selectedClass][id] !== SpellPreparationType.Learned}
                        prepareIsDisabled={(id) => preparations[selectedClass][id] !== SpellPreparationType.Learned}
                        handleRemove={handleRemoveSpell}
                        handlePrepare={handlePrepare}/>
                    <SpellList
                        header={<LocalizedText id='render-spellList-cantrips' args={[numKnownCantrips, spellSlots[SpellLevel.Cantrip] ?? 0]}/>}
                        spells={knownCantrips}
                        validate={(id) => spells[id].level === SpellLevel.Cantrip}
                        removeIsDisabled={(id) => id in facade.spells || preparations[id][selectedClass] === SpellPreparationType.AlwaysPrepared}
                        handleRemove={handleRemoveSpell}/>
                    <SpellList
                        header={<LocalizedText id='render-spellList-preparedSpells' args={[numPreparedSpells, preparationSlots]}/>}
                        spells={preparedSpells}
                        maxLevel={maxSpellLevels}
                        validate={(id) => spells[id].levelValue <= getSpellLevelValue(maxSpellLevels) && spells[id].level !== SpellLevel.Cantrip}
                        removeIsDisabled={(id) => id in facade.spells || preparations[id][selectedClass] === SpellPreparationType.AlwaysPrepared}
                        handleRemove={handleRemovePrepared}/>
                    <CollapsibleGroup header={<LocalizedText id='render-spellPage-addSpell'/>}>
                        <div className={styles.modifierChoice}>
                            <Elements.b>Spell: </Elements.b>
                            <LinkInput
                                value={spellInput}
                                placeholder={addSpellPlaceholder}
                                allowedTypes={allowedTypes}
                                allowText={false}
                                onChange={setSpellInput}
                                onAdd={handleAddClick}
                                validateAdd={handleValidateAdd}/>
                        </div>
                    </CollapsibleGroup>
                </>
            }
        </>
    )
}

export default CharacterSpellPage
