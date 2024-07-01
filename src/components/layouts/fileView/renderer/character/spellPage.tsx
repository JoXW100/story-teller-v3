import { useMemo, useState } from 'react'
import PageSelector, { type IPageSelectorData } from '../pageSelector'
import SpellList from './spellList'
import type { FileContextDispatch } from 'components/contexts/file'
import CollapsibleGroup from 'components/layouts/collapsibleGroup'
import LocalizedText from 'components/localizedText'
import Elements from 'components/elements'
import LinkInput from 'components/layouts/linkInput'
import { keysOf } from 'utils'
import { getMaxSpellLevel, getPreviousClassLevels, getSpellLevelValue } from 'utils/calculations'
import { useLocalizedText } from 'utils/hooks/localizedText'
import { DocumentFileType } from 'structure/database'
import type DatabaseFile from 'structure/database/files'
import type CharacterFacade from 'structure/database/files/character/facade'
import { LevelModifyType } from 'structure/database/files/class/levelData'
import SpellDocument from 'structure/database/files/spell'
import type { SpellData } from 'structure/database/files/spell/factory'
import { OptionalAttribute, SpellLevel, SpellPreparationType } from 'structure/dnd'
import type { ObjectId } from 'types'
import type { ICreatureStats } from 'types/editor'
import styles from '../styles.module.scss'

type CharacterSpellPageProps = React.PropsWithRef<{
    facade: CharacterFacade
    spells: Record<ObjectId, SpellData>
    stats: ICreatureStats
    setStorage: FileContextDispatch['setStorage']
}>

const allowedTypes = [DocumentFileType.Spell]

const CharacterSpellPage: React.FC<CharacterSpellPageProps> = ({ facade, spells, stats, setStorage }) => {
    const [spellInput, setSpellInput] = useState<string>('')
    const [selectedPage, setSelectedPage] = useState<ObjectId | null>(null)
    const selectedClass = useMemo(() =>
        selectedPage !== null && selectedPage in facade.classesData && facade.classesData[selectedPage].levels[facade.classes[selectedPage]].spellAttribute !== OptionalAttribute.None
            ? selectedPage
            : keysOf(facade.classes).find((key) =>
                key in facade.classesData && facade.classesData[key].levels[facade.classes[key]].spellAttribute !== OptionalAttribute.None
            ) ?? null
    , [facade.classes, facade.classesData, selectedPage])
    const [knownCantrips, knownSpells, preparedSpells, numKnownCantrips, numKnownSpells, numPreparedSpells] = useMemo(() => {
        const knownCantrips: Record<ObjectId, SpellData> = {}
        const knownSpells: Record<ObjectId, SpellData> = {}
        const preparedSpells: Record<ObjectId, SpellData> = {}
        let numKnownCantrips: number = 0
        let numKnownSpells: number = 0
        let numPreparedSpells: number = 0
        if (selectedClass !== null && selectedClass in facade.classesData) {
            const classPreparations = facade.storage.spellPreparations[selectedClass] ?? {}
            for (const key of keysOf(classPreparations)) {
                const preparation = classPreparations[key]
                switch (preparation) {
                    case SpellPreparationType.None:
                        break
                    case SpellPreparationType.AlwaysPrepared:
                        preparedSpells[key] = spells[key]
                        break
                    case SpellPreparationType.FreeCantrip:
                        knownCantrips[key] = spells[key]
                        break
                    case SpellPreparationType.Cantrip:
                        knownCantrips[key] = spells[key]
                        numKnownCantrips++
                        break
                    case SpellPreparationType.Learned:
                        knownSpells[key] = spells[key]
                        numKnownSpells++
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
        return [knownCantrips, knownSpells, preparedSpells, numKnownCantrips, numKnownSpells, numPreparedSpells]
    }, [facade.classesData, facade.storage.spellPreparations, selectedClass, spells])
    const [learnedSlots, preparationSlots, spellSlots, maxSpellLevels] = useMemo(() => {
        let spellSlots: Partial<Record<SpellLevel, number>> = {}
        let learnedSlots: number = 0
        let preparationSlots: number = 0
        let maxSpellLevels: SpellLevel = SpellLevel.Cantrip
        if (selectedClass !== null && selectedClass in facade.classesData) {
            const classLevel = facade.classes[selectedClass]
            const classData = facade.classesData[selectedClass]
            learnedSlots = facade.getAttributeModifier(classData.learnedSlotsScaling)
            preparationSlots = facade.getAttributeModifier(classData.preparationSlotsScaling)
            for (const level of getPreviousClassLevels(classLevel)) {
                const levelData = classData.levels[level]
                switch (levelData.type) {
                    case LevelModifyType.Add:
                        learnedSlots += levelData.learnedSlots
                        preparationSlots += levelData.preparationSlots
                        for (const spellLevel of keysOf(levelData.spellSlots)) {
                            spellSlots[spellLevel] = (spellSlots[spellLevel] ?? 0) + (levelData.spellSlots[spellLevel] ?? 0)
                        }
                        break
                    case LevelModifyType.Replace:
                        learnedSlots = levelData.learnedSlots
                        preparationSlots = levelData.preparationSlots
                        spellSlots = { ...levelData.spellSlots }
                        break
                }
            }
            maxSpellLevels = getMaxSpellLevel(...keysOf(spellSlots))
        }
        return [learnedSlots, preparationSlots, spellSlots, maxSpellLevels]
    }, [facade, selectedClass])
    const pages = useMemo(() => {
        const pages: Record<ObjectId, IPageSelectorData> = {}
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
    }, [facade.classes, facade.classesData])
    const addSpellPlaceholder = useLocalizedText('render-spellPage-addSpell-placeholder')

    const handleRemoveSpell = (spellId: ObjectId): void => {
        if (selectedClass !== null && selectedClass in facade.storage.spellPreparations) {
            const { [spellId]: _, ...rest } = facade.storage.spellPreparations[selectedClass] ?? {}
            setStorage('spellPreparations', { ...facade.storage.spellPreparations, [selectedClass]: rest })
        }
    }

    const handleRemovePrepared = (spellId: ObjectId): void => {
        if (selectedClass !== null && selectedClass in facade.storage.spellPreparations &&
            facade.storage.spellPreparations[selectedClass][spellId] === SpellPreparationType.Prepared) {
            setStorage('spellPreparations', {
                ...facade.storage.spellPreparations,
                [selectedClass]: {
                    ...facade.storage.spellPreparations[selectedClass] ?? {},
                    [spellId]: SpellPreparationType.Learned
                }
            })
        }
    }

    const handlePrepare = (spellId: ObjectId): void => {
        if (selectedClass !== null && selectedClass in facade.storage.spellPreparations) {
            setStorage('spellPreparations', {
                ...facade.storage.spellPreparations,
                [selectedClass]: {
                    ...facade.storage.spellPreparations[selectedClass],
                    [spellId]: SpellPreparationType.Prepared
                }
            })
        }
    }

    const handleAddClick = (value: DatabaseFile | null): void => {
        if (selectedClass !== null && value instanceof SpellDocument) {
            setStorage('spellPreparations', {
                ...facade.storage.spellPreparations ?? {},
                [selectedClass]: {
                    ...facade.storage.spellPreparations[selectedClass],
                    [value.id]: value.data.level === SpellLevel.Cantrip
                        ? SpellPreparationType.Cantrip
                        : SpellPreparationType.Learned
                }
            })
        }
        setSpellInput('')
    }

    const handleValidateAdd = (value: DatabaseFile): boolean => {
        return selectedClass !== null && (!(selectedClass in facade.storage.spellPreparations) || (
            value instanceof SpellDocument && !(value.id in facade.storage.spellPreparations[selectedClass]) &&
                getSpellLevelValue(value.data.level) <= getSpellLevelValue(maxSpellLevels) && (
                (value.data.level !== SpellLevel.Cantrip && numKnownSpells < learnedSlots) ||
                (value.data.level === SpellLevel.Cantrip && numKnownCantrips < (spellSlots[SpellLevel.Cantrip] ?? 0))
            )))
    }

    return (
        <>
            { Object.keys(pages).length > 1 &&
                <>
                    <PageSelector pages={pages} selected={selectedPage} setSelected={setSelectedPage}/>
                    <Elements.line width='2px'/>
                </>
            }
            { selectedClass !== null && selectedClass in facade.classesData &&
                <>
                    <SpellList
                        header={<LocalizedText id='render-spellList-knownSpells' args={[numKnownSpells, learnedSlots]}/>}
                        spells={knownSpells}
                        maxLevel={maxSpellLevels}
                        validate={(id) => knownSpells[id].levelValue <= getSpellLevelValue(maxSpellLevels)}
                        removeIsDisabled={(id) => facade.storage.spellPreparations[selectedClass][id] !== SpellPreparationType.Learned}
                        prepareIsDisabled={(id) => facade.storage.spellPreparations[selectedClass][id] !== SpellPreparationType.Learned}
                        handleRemove={handleRemoveSpell}
                        handlePrepare={handlePrepare}/>
                    <SpellList
                        header={<LocalizedText id='render-spellList-cantrips' args={[numKnownCantrips, spellSlots[SpellLevel.Cantrip] ?? 0]}/>}
                        spells={knownCantrips}
                        validate={(id) => spells[id].level === SpellLevel.Cantrip}
                        removeIsDisabled={(id) => id in facade.spells}
                        handleRemove={handleRemoveSpell}/>
                    <SpellList
                        header={<LocalizedText id='render-spellList-preparedSpells' args={[numPreparedSpells, preparationSlots]}/>}
                        spells={preparedSpells}
                        maxLevel={maxSpellLevels}
                        validate={(id) => spells[id].levelValue <= getSpellLevelValue(maxSpellLevels) && spells[id].level !== SpellLevel.Cantrip}
                        removeIsDisabled={(id) => id in facade.spells}
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
