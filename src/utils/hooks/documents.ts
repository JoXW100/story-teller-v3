import { useEffect, useState } from 'react'
import Communication from 'utils/communication'
import { isObjectId, keysOf } from 'utils'
import Logger from 'utils/logger'
import { toAbility } from 'utils/importers/stringFormatAbilityImporter'
import { DocumentType } from 'structure/database'
import { OptionalAttribute, PreparedSpellPreparationType, type SpellPreparationType } from 'structure/dnd'
import CreatureFacade from 'structure/database/files/creature/facade'
import CharacterFacade from 'structure/database/files/character/facade'
import type { AbilityData } from 'structure/database/files/ability/factory'
import type { SpellData } from 'structure/database/files/spell/factory'
import type ModifierDocument from 'structure/database/files/modifier'
import type ClassData from 'structure/database/files/class/data'
import type CreatureDocument from 'structure/database/files/creature'
import type CharacterDocument from 'structure/database/files/character'
import type RaceDocument from 'structure/database/files/race'
import Modifier from 'structure/database/files/modifier/modifier'
import type { ObjectId } from 'types'
import type { IConditionProperties } from 'types/database/condition'
import { getPreviousClassLevels } from 'utils/calculations'

type AbilitiesState = [Record<string, AbilityData>, boolean]
export function useAbilities(ids: Array<ObjectId | string | null>): AbilitiesState {
    const [state, setState] = useState<AbilitiesState>([{}, true])

    useEffect(() => {
        setState((state) => {
            const fileIds = new Set<ObjectId>()
            let values: Record<string, AbilityData> = {}
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
                            values = { ...values, ...res.result }
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

type SpellsState = [Record<ObjectId, SpellData>, boolean]
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

type ClassesState = [Record<ObjectId, ClassData>, boolean]
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

type ModifiersState = [Record<ObjectId, ModifierDocument>, boolean]
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

interface ICreatureFacadeState {
    facade: CreatureFacade
    abilities: Record<ObjectId | string, AbilityData>
    spells: Record<ObjectId, SpellData>
    loading: boolean
}

interface ICharacterFacadeState extends ICreatureFacadeState {
    facade: CharacterFacade
    classes: Record<ObjectId, ClassData>
    race: RaceDocument | null
    loading: boolean
}

async function fetchModifiers(ids: ObjectId[], modifier: Modifier): Promise<void> {
    if (ids.length > 0) {
        const fetchIds = new Set<ObjectId>()
        for (const id of ids) {
            fetchIds.add(id)
        }
        const raceModifierResponse = await Communication.getFilesOfTypes(Array.from(fetchIds), [DocumentType.Modifier])
        if (raceModifierResponse.success) {
            for (const modifierDocument of Object.values(raceModifierResponse.result)) {
                modifier.subscribe(modifierDocument)
            }
        }
    }
}

async function fetchAbilities(ids: Array<ObjectId | string>, abilities: Record<ObjectId | string, AbilityData>, modifier: Modifier): Promise<number> {
    const fetchIds = new Set<ObjectId>()
    let count = 0
    for (const id of ids) {
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
        let modifierIds: ObjectId[] = []
        for (const abilityDocument of Object.values(abilitiesFetchResult.result)) {
            abilities[abilityDocument.id] = abilityDocument.data
            modifierIds = modifierIds.concat(abilityDocument.data.modifiers)
        }
        await fetchModifiers(modifierIds, modifier)
    }

    return fetchIds.size
}

async function fetchSpells(ids: ObjectId[]): Promise<Record<ObjectId, SpellData>> {
    const spells: Record<ObjectId, SpellData> = {}
    if (ids.length > 0) {
        const spellsResponse = await Communication.getFilesOfTypes(ids, [DocumentType.Spell])
        if (spellsResponse.success) {
            for (const spellDocument of Object.values(spellsResponse.result)) {
                spells[spellDocument.id] = spellDocument.data
            }
        }
    }
    return spells
}

async function fetchCreatureData(creature: CreatureDocument, current: ICreatureFacadeState): Promise<ICreatureFacadeState> {
    const modifier = new Modifier()
    // Start ability/modifier fetch loop
    const abilityIdsBase: Array<ObjectId | string> = creature.data.abilities
    const abilities: Record<ObjectId | string, AbilityData> = {}
    let properties: Partial<IConditionProperties> = {}
    for (let depth = 0; depth < 100; depth++) {
        // Find new abilities to fetch
        const facade = new CreatureFacade(creature.data, creature.storage, modifier, properties)
        properties = facade.createProperties()
        const abilityIds = modifier.abilities.call(abilityIdsBase, properties, creature.storage.choices)

        if (await fetchAbilities(abilityIds, abilities, modifier) <= 0) {
            // No more abilities to fetch, complete by fetching spells
            const spellIds = modifier.spells.call(creature.data.spells, properties, creature.storage.choices)
            const spells = await fetchSpells(spellIds)
            return { facade, abilities, spells, loading: false }
        }
    }
    Logger.throw('fetchCreatureData', 'maximum depth exceeded')
    return current
}

async function fetchCharacterData(character: CharacterDocument, current: ICharacterFacadeState): Promise<ICharacterFacadeState> {
    let race: RaceDocument | null = null
    if (character.data.race !== null) {
        const raceResponse = await Communication.getFileOfTypes(character.data.race, [DocumentType.Race])
        if (raceResponse.success) {
            race = raceResponse.result
        }
    }
    // Fetch classes
    const classes: Record<ObjectId, ClassData> = {}
    const classIds = keysOf(character.data.classes)
    if (classIds.length > 0) {
        const classesResponse = await Communication.getFilesOfTypes(classIds, [DocumentType.Class])
        if (classesResponse.success) {
            for (const classDocument of Object.values(classesResponse.result)) {
                classes[classDocument.id] = classDocument.data
            }
        }
    }
    const modifier = new Modifier()
    const abilities: Record<ObjectId | string, AbilityData> = {}
    // Fetch initial ids from race and classes
    const initialModifierIds: ObjectId[] = []
    const initialAbilityIds: Array<ObjectId | string> = character.data.abilities
    if (race !== null) {
        for (const id of race.data.modifiers) {
            initialModifierIds.push(id)
        }
        for (const id of race.data.abilities) {
            initialAbilityIds.push(id)
        }
    }

    for (const classId of classIds) {
        const classData = classes[classId]
        for (const level of getPreviousClassLevels(character.data.classes[classId])) {
            const levelData = classData.levels[level]
            for (const id of levelData.modifiers) {
                initialModifierIds.push(id)
            }
            for (const id of levelData.abilities) {
                initialAbilityIds.push(id)
            }
        }
    }

    await fetchModifiers(initialModifierIds, modifier)
    let properties: Partial<IConditionProperties> = {}

    // Start ability/modifier fetch loop
    for (let depth = 0; depth < 100; depth++) {
        // Find new abilities to fetch
        const facade = new CharacterFacade(character.data, character.storage, modifier, race?.data, classes, properties)
        properties = facade.createProperties()
        const abilityIds = modifier.abilities.call(initialAbilityIds, properties, character.storage.choices)

        if (await fetchAbilities(abilityIds, abilities, modifier) <= 0) {
            // No more abilities to fetch, complete by fetching spells
            const initialSpellIds: ObjectId[] = []
            if (facade.spellAttribute !== OptionalAttribute.None) {
                for (const id of character.data.spells) {
                    initialSpellIds.push(id)
                }
            }

            for (const classId of classIds) {
                const classData = classes[classId]
                if (classData.spellAttribute !== OptionalAttribute.None && classId in facade.storage.spellPreparations) {
                    for (const id of keysOf(facade.storage.spellPreparations[classId])) {
                        initialSpellIds.push(id)
                    }
                }
            }

            const spells = await fetchSpells(modifier.spells.call(initialSpellIds, properties, character.storage.choices))
            return { facade, abilities, spells, classes, race, loading: false }
        }
    }
    Logger.throw('fetchCharacterData', 'maximum depth exceeded')
    return current
}

export function useCreatureFacade(creature: CreatureDocument): ICreatureFacadeState {
    const [state, setState] = useState<ICreatureFacadeState>({
        facade: new CreatureFacade(creature.data, creature.storage, new Modifier()),
        abilities: {},
        spells: {},
        loading: true
    })

    useEffect(() => {
        setState((state) => {
            fetchCreatureData(creature, state).then((res) => {
                setState(res)
            }, (error: unknown) => {
                Logger.throw('useCreatureFacade', error)
                setState((state) => ({ ...state, loading: false }))
            })
            return { ...state, loading: true }
        })
    }, [creature])

    return state
}

export function useCharacterFacade(character: CharacterDocument): ICharacterFacadeState {
    const [state, setState] = useState<ICharacterFacadeState>({
        facade: new CharacterFacade(character.data, character.storage, new Modifier()),
        abilities: {},
        spells: {},
        classes: {},
        race: null,
        loading: true
    })

    useEffect(() => {
        setState((state) => {
            fetchCharacterData(character, state).then((res) => {
                setState(res)
            }, (error: unknown) => {
                Logger.throw('useCharacterFacade', error)
                setState((state) => ({ ...state, loading: false }))
            })
            return { ...state, loading: true }
        })
    }, [character])

    return state
}
