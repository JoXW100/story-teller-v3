import { useEffect, useState } from 'react'
import { useTranslator, type TranslationHandler } from './localization'
import Communication from 'utils/communication'
import { asObjectId, isObjectId, keysOf } from 'utils'
import Logger from 'utils/logger'
import { getPreviousClassLevels } from 'utils/calculations'
import { toAbility } from 'utils/importers/stringFormatAbilityImporter'
import { OptionalAttribute, PreparedSpellPreparationType, type SpellPreparationType } from 'structure/dnd'
import { DocumentType, EmptyProperties } from 'structure/database'
import Modifier, { SourceType } from 'structure/database/files/modifier/modifier'
import CreatureFacade from 'structure/database/files/creature/facade'
import CharacterFacade from 'structure/database/files/character/facade'
import type { AbilityData } from 'structure/database/files/ability/factory'
import type { SpellData } from 'structure/database/files/spell/factory'
import type ModifierDocument from 'structure/database/files/modifier'
import CharacterDocument from 'structure/database/files/character'
import type ClassData from 'structure/database/files/class/data'
import type SubclassData from 'structure/database/files/subclass/data'
import type CreatureDocument from 'structure/database/files/creature'
import type RaceDocument from 'structure/database/files/race'
import type SubraceDocument from 'structure/database/files/subrace'
import type { ItemData } from 'structure/database/files/item/factory'
import type { ObjectId } from 'types'
import type { IProperties } from 'types/editor'

interface ICreatureFacadeState {
    facade: CreatureFacade
    abilities: Record<ObjectId | string, AbilityData>
    spells: Record<ObjectId, SpellData>
    variables: Record<string, string>
    loading: boolean
}

interface ICharacterFacadeState extends ICreatureFacadeState {
    facade: CharacterFacade
    classes: Record<ObjectId, ClassData>
    subclasses: Record<ObjectId, SubclassData>
    race: RaceDocument | null
    items: Record<ObjectId, ItemData>
    loading: boolean
}

type AbilitiesState = [Record<string, AbilityData>, boolean]
type SpellsState = [Record<ObjectId, SpellData>, boolean]
type ClassesState = [Record<ObjectId, ClassData>, boolean]
type ModifiersState = [Record<ObjectId, ModifierDocument>, boolean]

async function fetchModifiers(values: Record<string, ObjectId>, modifier: Modifier): Promise<void> {
    const keys = keysOf(values)
    if (keys.length > 0) {
        const modifierResponse = await Communication.getFilesOfTypes(Object.values(values), [DocumentType.Modifier])
        if (modifierResponse.success) {
            for (const key of keys) {
                const id = values[key]
                const document = modifierResponse.result[id]
                if (document !== undefined) {
                    modifier.subscribe(document, key)
                }
            }
        }
    }
}

async function fetchAbilities(ids: Record<string, ObjectId | string>, abilities: Record<ObjectId | string, AbilityData>, modifier: Modifier): Promise<number> {
    const fetchIds = new Set<ObjectId>()
    let count = 0
    for (const id of Object.values(ids)) {
        const key = isObjectId(id) ? String(id) : `custom.${count++}`
        if (key in abilities) {
            continue
        } else if (isObjectId(id)) {
            fetchIds.add(id)
        } else if (id !== null) {
            const ability = toAbility(id)
            if (ability !== null) {
                abilities[key] = ability
            }
        }
    }

    if (fetchIds.size <= 0) {
        // No more abilities to fetch, complete by fetching spells
        return 0
    }

    const abilitiesFetchResult = await Communication.getFilesOfTypes(Array.from(fetchIds), [DocumentType.Ability])
    if (abilitiesFetchResult.success) {
        const modifierIds: Record<string, ObjectId> = {}
        for (const abilityDocument of Object.values(abilitiesFetchResult.result)) {
            abilities[abilityDocument.id] = abilityDocument.data
            for (const id of abilityDocument.data.modifiers) {
                modifierIds[`${abilityDocument.id}.${id}`] = id
            }
        }
        await fetchModifiers(modifierIds, modifier)
    } else {
        return 0
    }

    return fetchIds.size
}

async function fetchSpells(spells: Record<ObjectId, OptionalAttribute>): Promise<Record<ObjectId, SpellData>> {
    const result: Record<ObjectId, SpellData> = {}
    const ids = keysOf(spells)
    if (ids.length > 0) {
        const spellsResponse = await Communication.getFilesOfTypes(ids, [DocumentType.Spell])
        if (spellsResponse.success) {
            for (const spellDocument of Object.values(spellsResponse.result)) {
                result[spellDocument.id] = spellDocument.data
            }
        }
    }
    return result
}

async function fetchCreatureData(creature: CreatureDocument, current: ICreatureFacadeState, translator: TranslationHandler): Promise<ICreatureFacadeState> {
    const modifier = new Modifier()
    // Start ability/modifier fetch loop
    const initialAbilityIds: Record<string, ObjectId | string> = {}
    for (let i = 0; i < creature.data.abilities.length; i++) {
        const id = creature.data.abilities[i]
        initialAbilityIds[asObjectId(id) ?? String(i)] = id
    }

    const abilities: Record<ObjectId | string, AbilityData> = {}
    let properties: IProperties = EmptyProperties
    for (let depth = 0; depth < 100; depth++) {
        // Find new abilities to fetch
        const facade = new CreatureFacade(creature.data, creature.storage, modifier, translator, properties)
        properties = facade.createProperties()
        const abilityIds = modifier.abilities.call(initialAbilityIds, properties, creature.storage.choices)

        if (await fetchAbilities(abilityIds, abilities, modifier) <= 0) {
            // No more abilities to fetch, complete by fetching spells
            const spellIds = modifier.spells.call(creature.data.spells, properties, creature.storage.choices)
            const spells = await fetchSpells(spellIds)
            const variables = modifier.variables.call({}, properties, creature.storage.choices)
            return { facade, abilities, spells, variables, loading: false }
        }
    }
    Logger.throw('fetchCreatureData', 'maximum depth exceeded')
    return current
}

async function fetchCharacterData(character: CharacterDocument, current: ICharacterFacadeState, translator: TranslationHandler): Promise<ICharacterFacadeState> {
    const modifier = new Modifier()

    let race: RaceDocument | null = null
    let subraceId: ObjectId | null = null
    const raceId = character.data.race
    if (raceId !== null) {
        const raceResponse = await Communication.getFileOfTypes(raceId, [DocumentType.Race])
        if (raceResponse.success) {
            race = raceResponse.result
            subraceId = character.data.subrace
        }
    }

    let subrace: SubraceDocument | null = null
    if (subraceId !== null) {
        const subraceResponse = await Communication.getFileOfTypes(subraceId, [DocumentType.Subrace])
        if (subraceResponse.success && subraceResponse.result.data.parentFile === race!.id) {
            subrace = subraceResponse.result
        }
    }

    // Fetch classes
    const classes: Record<ObjectId, ClassData> = {}
    const classIds = keysOf(character.data.classes)
    const subclassIds: ObjectId[] = []
    if (classIds.length > 0) {
        const classesResponse = await Communication.getFilesOfTypes(classIds, [DocumentType.Class])
        if (classesResponse.success) {
            for (const classDocument of Object.values(classesResponse.result)) {
                classes[classDocument.id] = classDocument.data
                if (Number(character.data.classes[classDocument.id]) >= Number(classDocument.data.subclassLevel) && classDocument.id in character.data.subclasses) {
                    const subclassId = character.data.subclasses[classDocument.id]
                    subclassIds.push(subclassId)
                    modifier.addSource(subclassId, SourceType.Class, classDocument.id)
                }
            }
        }
    }
    // Fetch subclasses
    const subclasses: Record<ObjectId, SubclassData> = {}
    if (subclassIds.length > 0) {
        const subclassesResponse = await Communication.getFilesOfTypes(subclassIds, [DocumentType.Subclass])
        if (subclassesResponse.success) {
            for (const subclassDocument of Object.values(subclassesResponse.result)) {
                if (subclassDocument.data.parentFile !== null && subclassDocument.data.parentFile in classes) {
                    subclasses[subclassDocument.id] = subclassDocument.data
                }
            }
        }
    }
    // Fetch items
    const items: Record<ObjectId, ItemData> = {}
    const itemIds = keysOf(character.storage.inventory)
    if (itemIds.length > 0) {
        const itemsResponse = await Communication.getFilesOfTypes(itemIds, [DocumentType.Item])
        if (itemsResponse.success) {
            for (const itemDocument of Object.values(itemsResponse.result)) {
                items[itemDocument.id] = itemDocument.data
            }
        }
    }

    const abilities: Record<ObjectId | string, AbilityData> = {}
    // Fetch initial ids from race and classes
    const initialModifierIds: Record<string, ObjectId> = {}
    const initialAbilityIds: Record<string, ObjectId | string> = {}
    for (let i = 0; i < character.data.abilities.length; i++) {
        const id = character.data.abilities[i]
        initialAbilityIds[asObjectId(id) ?? String(i)] = id
    }
    if (race !== null) {
        for (const id of race.data.modifiers) {
            const key = `race.${id}`
            initialModifierIds[key] = id
            modifier.addSource(key, SourceType.Race, raceId!)
        }
        for (let i = 0; i < race.data.abilities.length; i++) {
            const id = race.data.abilities[i]
            const key = `race.${id}.${asObjectId(id) ?? String(i)}`
            initialAbilityIds[key] = id
            modifier.addSource(key, SourceType.Race, raceId!)
        }
    }
    if (subrace !== null) {
        for (const id of subrace.data.modifiers) {
            const key = `subrace.${id}`
            initialModifierIds[key] = id
            modifier.addSource(key, SourceType.Subrace, raceId!)
        }
        for (let i = 0; i < subrace.data.abilities.length; i++) {
            const id = subrace.data.abilities[i]
            const key = `subrace.${asObjectId(id) ?? String(i)}`
            initialAbilityIds[key] = id
            modifier.addSource(key, SourceType.Subrace, raceId!)
        }
    }

    for (const classId of keysOf(classes)) {
        const classData = classes[classId]
        for (const level of getPreviousClassLevels(character.data.classes[classId])) {
            const levelData = classData.levels[level]
            for (const id of levelData.modifiers) {
                const key = `class.${classId}.${level}.${id}`
                initialModifierIds[key] = id
                modifier.addSource(key, SourceType.Class, classId)
            }
            for (let i = 0; i < levelData.abilities.length; i++) {
                const id = levelData.abilities[i]
                const key = `class.${classId}.${asObjectId(id) ?? String(i)}`
                initialAbilityIds[key] = id
                modifier.addSource(key, SourceType.Class, classId)
            }
        }
    }

    for (const subclassId of keysOf(subclasses)) {
        const subclassData = subclasses[subclassId]
        if (subclassData.parentFile === null) {
            continue
        }
        for (const level of getPreviousClassLevels(character.data.classes[subclassData.parentFile])) {
            const levelData = subclassData.levels[level]
            for (const id of levelData.modifiers) {
                const key = `subclass.${subclassId}.${level}.${id}`
                initialModifierIds[key] = id
                modifier.addSource(key, SourceType.Subclass, subclassId)
            }
            for (let i = 0; i < levelData.abilities.length; i++) {
                const id = levelData.abilities[i]
                const key = `subclass.${subclassId}.${asObjectId(id) ?? String(i)}`
                initialAbilityIds[key] = id
                modifier.addSource(key, SourceType.Subclass, subclassId)
            }
        }
    }

    for (const itemId of keysOf(items)) {
        const itemData = items[itemId]
        if (character.storage.inventory[itemId]?.equipped && (!itemData.attunement || character.storage.attunement.includes(itemId))) {
            for (const id of itemData.modifiers) {
                const key = `item.${id}`
                initialModifierIds[key] = id
                modifier.addSource(key, SourceType.Item, itemId)
            }
            const ability = itemData.createAbility()
            if (ability !== null) {
                const key = `itemAbility.${itemId}`
                abilities[key] = ability
                modifier.addSource(key, SourceType.Item, itemId)
            }
        }
    }

    let properties: IProperties = EmptyProperties
    await fetchModifiers(initialModifierIds, modifier)

    // Start ability/modifier fetch loop
    for (let depth = 0; depth < 100; depth++) {
        // Find new abilities to fetch
        const facade = new CharacterFacade(character.data, character.storage, modifier, translator, properties, race?.data, subrace?.data, classes, subclasses, items)
        properties = facade.createProperties()
        const abilityIds = modifier.abilities.call(initialAbilityIds, properties, character.storage.choices)

        if (await fetchAbilities(abilityIds, abilities, modifier) <= 0) {
            // No more abilities to fetch, complete by fetching spells
            const initialSpellIds: Record<ObjectId, OptionalAttribute> = {}
            for (const id of keysOf(character.data.spells)) {
                initialSpellIds[id] = character.data.spells[id]
            }

            const preparations = facade.getSpellPreparations()
            for (const classId of classIds) {
                const attribute = facade.getClassSpellAttribute(classId)
                if (attribute !== OptionalAttribute.None && classId in preparations) {
                    for (const id of keysOf(preparations[classId])) {
                        initialSpellIds[id] = attribute
                        modifier.addSource(id, SourceType.Class, classId)
                    }
                }
            }

            const spells = await fetchSpells(modifier.spells.call(initialSpellIds, properties, character.storage.choices))
            const variables = modifier.variables.call({}, properties, character.storage.choices)
            return { facade, abilities, spells, classes, subclasses: subclasses, race, variables, items, loading: false }
        }
    }
    Logger.throw('fetchCharacterData', 'maximum depth exceeded')
    return current
}

export function useAbilities(ids: Array<ObjectId | string | null>): AbilitiesState {
    const [state, setState] = useState<AbilitiesState>([{}, true])

    useEffect(() => {
        setState((state) => {
            const fileIds = new Set<ObjectId>()
            const values: Record<string, AbilityData> = {}
            let count = 0
            for (const id of ids) {
                const key = isObjectId(id) ? String(id) : `custom.${count++}`
                if (key in values) {
                    continue
                } else if (key in state[0]) {
                    values[key] = state[0][key]
                } else if (isObjectId(id)) {
                    fileIds.add(id)
                } else if (id !== null) {
                    const ability = toAbility(id)
                    if (ability !== null) {
                        values[key] = ability
                    }
                }
            }

            if (fileIds.size > 0) {
                Communication.getFilesOfTypes(Array.from(fileIds), [DocumentType.Ability])
                    .then((res) => {
                        if (res.success) {
                            for (const id of keysOf(res.result)) {
                                values[id] = res.result[id].data
                            }
                        }
                    }, (e: unknown) => {
                        Logger.throw('useAbilities', e)
                    }).finally(() => {
                        setState([values, false])
                    })
                return [values, true]
            } else {
                return state
            }
        })
    }, [ids])

    return state
}

export function useSpells(ids: Array<ObjectId | null>, preparations?: Record<ObjectId, SpellPreparationType>): SpellsState {
    const [state, setState] = useState<SpellsState>([{}, true])

    useEffect(() => {
        const fileIds = new Set<ObjectId>()
        for (const id of ids) {
            if (isObjectId(id)) {
                fileIds.add(id)
            }
        }

        if (preparations !== undefined) {
            for (const id of keysOf(preparations)) {
                if (PreparedSpellPreparationType.has(preparations[id])) {
                    fileIds.add(id)
                }
            }
        }

        const values: Record<ObjectId, SpellData> = {}
        if (fileIds.size > 0) {
            Communication.getFilesOfTypes(Array.from(fileIds), [DocumentType.Spell])
                .then((res) => {
                    if (res.success) {
                        for (const file of Object.values(res.result)) {
                            values[file.id] = file.data
                        }
                    }
                }, (e: unknown) => {
                    Logger.throw('useSpells', e)
                }).finally(() => {
                    setState([values, false])
                })
        } else {
            setState([values, false])
        }
    }, [ids, preparations])

    return state
}

export function useClasses(ids: Record<ObjectId, any>): ClassesState {
    const [state, setState] = useState<ClassesState>([{}, true])

    useEffect(() => {
        const fileIds = new Set<ObjectId>(keysOf(ids))
        const values: Record<ObjectId, ClassData> = {}
        if (fileIds.size > 0) {
            Communication.getFilesOfTypes(Array.from(fileIds), [DocumentType.Class])
                .then((res) => {
                    if (res.success) {
                        for (const file of Object.values(res.result)) {
                            values[file.id] = file.data
                        }
                    }
                }, (e: unknown) => {
                    Logger.throw('useClasses', e)
                }).finally(() => {
                    setState([values, false])
                })
        } else {
            setState([values, false])
        }
    }, [ids])

    return state
}

export function useModifiers(ids: readonly ObjectId[]): ModifiersState {
    const [state, setState] = useState<ModifiersState>([{}, true])

    useEffect(() => {
        let values: Record<ObjectId, ModifierDocument> = {}
        if (ids.length > 0) {
            Communication.getFilesOfTypes(ids, [DocumentType.Modifier])
                .then((res) => {
                    if (res.success) {
                        values = { ...values, ...res.result }
                    }
                }, (e: unknown) => {
                    Logger.throw('useModifiers', e)
                }).finally(() => {
                    setState([values, false])
                })
        } else {
            setState([values, false])
        }
    }, [ids])

    return state
}

export function useCreatureFacade(creature: CreatureDocument): ICreatureFacadeState {
    const translator = useTranslator()
    const [state, setState] = useState<ICreatureFacadeState>({
        facade: new CreatureFacade(creature.data, creature.storage, new Modifier(), translator),
        abilities: {},
        spells: {},
        variables: {},
        loading: true
    })

    useEffect(() => {
        setState((state) => {
            fetchCreatureData(creature, state, translator).then((res) => {
                setState(res)
            }, (error: unknown) => {
                Logger.throw('useCreatureFacade', error)
                setState((state) => ({ ...state, loading: false }))
            })
            return { ...state, loading: true }
        })
    }, [creature, translator])

    return state
}

export function useCharacterFacade(character: CharacterDocument): ICharacterFacadeState {
    const translator = useTranslator()
    const [state, setState] = useState<ICharacterFacadeState>({
        facade: new CharacterFacade(character.data, character.storage, new Modifier(), translator),
        abilities: {},
        spells: {},
        classes: {},
        subclasses: {},
        variables: {},
        items: {},
        race: null,
        loading: true
    })

    useEffect(() => {
        setState((state) => {
            fetchCharacterData(character, state, translator).then((res) => {
                setState(res)
            }, (error: unknown) => {
                Logger.throw('useCharacterFacade', error)
                setState((state) => ({ ...state, loading: false }))
            })
            return { ...state, loading: true }
        })
    }, [character, translator])

    return state
}

export function useCharacterCreatureFacade(creature: CreatureDocument | CharacterDocument): ICreatureFacadeState {
    const translator = useTranslator()
    const [state, setState] = useState(creature instanceof CharacterDocument
        ? {
            facade: new CharacterFacade(creature.data, creature.storage, new Modifier(), translator),
            abilities: {},
            spells: {},
            classes: {},
            subclasses: {},
            variables: {},
            items: {},
            race: null,
            loading: true
        }
        : {
            facade: new CreatureFacade(creature.data, creature.storage, new Modifier(), translator),
            abilities: {},
            spells: {},
            variables: {},
            loading: true
        })

    useEffect(() => {
        setState((state) => {
            if (creature instanceof CharacterDocument) {
                fetchCharacterData(creature, state as ICharacterFacadeState, translator).then((res) => {
                    setState(res as ICreatureFacadeState)
                }, (error: unknown) => {
                    Logger.throw('useCreatureFacade', error)
                    setState((state) => ({ ...state, loading: false }))
                })
            } else {
                fetchCreatureData(creature, state, translator).then((res) => {
                    setState(res)
                }, (error: unknown) => {
                    Logger.throw('useCreatureFacade', error)
                    setState((state) => ({ ...state, loading: false }))
                })
            }
            return { ...state, loading: true }
        })
    }, [creature, translator])

    return state
}
