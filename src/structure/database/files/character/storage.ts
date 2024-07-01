import CreatureStorage from '../creature/storage'
import { isEnum, isNumber, isObjectId, isRecord, keysOf } from 'utils'
import { SpellLevel, SpellPreparationType } from 'structure/dnd'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ICharacterStorage } from 'types/database/files/character'

function simplifySpell(value: Record<ObjectId, Record<ObjectId, SpellPreparationType>>): Record<ObjectId, Record<ObjectId, SpellPreparationType>> | null {
    const result: Record<ObjectId, Record<ObjectId, SpellPreparationType>> = {}
    let hasValue: boolean = false
    for (const id of keysOf(value)) {
        const classPreparations = value[id]
        for (const key of keysOf(classPreparations)) {
            const type = classPreparations[key]
            if (type !== SpellPreparationType.None) {
                hasValue = true
                result[id] = { ...result[id] ?? {}, [key]: type }
            }
        }
    }

    return hasValue ? result : null
}

class CharacterStorage extends CreatureStorage implements ICharacterStorage {
    public readonly spellPreparations: Record<ObjectId, Record<ObjectId, SpellPreparationType>>
    public readonly preparationsExpendedSlots: Record<ObjectId, Partial<Record<SpellLevel, number>>>

    public constructor(storage: Simplify<ICharacterStorage>) {
        super(storage)
        this.spellPreparations = CharacterStorage.properties.spellPreparations.value
        if (storage.spellPreparations !== undefined) {
            for (const id of keysOf(storage.spellPreparations)) {
                const classPreparations = storage.spellPreparations[id]
                if (classPreparations !== undefined) {
                    this.spellPreparations[id] = {}
                    for (const key of keysOf(classPreparations)) {
                        const type = classPreparations[key]
                        if (type !== undefined) {
                            this.spellPreparations[id][key] = type
                        }
                    }
                }
            }
        }
        this.preparationsExpendedSlots = CharacterStorage.properties.preparationsExpendedSlots.value
        if (storage.preparationsExpendedSlots !== undefined) {
            for (const id of keysOf(storage.preparationsExpendedSlots)) {
                const expendedSlots = storage.preparationsExpendedSlots[id]
                if (expendedSlots !== undefined) {
                    this.preparationsExpendedSlots[id] = {}
                    for (const key of keysOf(expendedSlots)) {
                        const type = expendedSlots[key]
                        if (type !== undefined) {
                            this.preparationsExpendedSlots[id][key] = type
                        }
                    }
                }
            }
        }
    }

    public static properties: DataPropertyMap<ICharacterStorage, CharacterStorage> = {
        ...CreatureStorage.properties,
        spellPreparations: {
            get value() { return {} },
            validate: (value) => isRecord(value, (classId, classPreparations) =>
                isObjectId(classId) && isRecord(classPreparations, (spellId, type) =>
                    isObjectId(spellId) && isEnum(type, SpellPreparationType))),
            simplify: simplifySpell
        },
        preparationsExpendedSlots: {
            get value() { return {} },
            validate: (value) => isRecord(value, (classId, expendedSlots) =>
                isObjectId(classId) && isRecord(expendedSlots, (level, count) =>
                    isEnum(level, SpellLevel) && isNumber(count)))
        }
    }
}

export default CharacterStorage
