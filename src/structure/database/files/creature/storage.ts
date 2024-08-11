import { isEnum, isNumber, isNumberOrNull, isObjectId, isRecord, keysOf } from 'utils'
import { SpellLevel } from 'structure/dnd'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ICreatureStorage } from 'types/database/files/creature'

function simplifyExpended<K extends string | number>(value: Partial<Record<K, number>>): Partial<Record<K, number>> | null {
    const result: Partial<typeof value> = {}
    let hasValue: boolean = false
    for (const key of keysOf(value)) {
        const num = value[key]
        if (num !== undefined && num > 0) {
            hasValue = true
            result[key] = num
        }
    }
    return hasValue ? result : null
}

class CreatureStorage implements ICreatureStorage {
    public readonly health: number | null
    public readonly healthTemp: number | null
    public readonly abilitiesExpendedCharges: Record<string, number>
    public readonly spellsExpendedSlots: Partial<Record<SpellLevel, number>>
    public readonly choices: Record<string, unknown>
    public readonly conditions: ObjectId[]

    public constructor(storage: Simplify<ICreatureStorage>) {
        this.health = storage.health ?? CreatureStorage.properties.health.value
        this.healthTemp = storage.healthTemp ?? CreatureStorage.properties.healthTemp.value
        this.abilitiesExpendedCharges = CreatureStorage.properties.abilitiesExpendedCharges.value
        if (storage.abilitiesExpendedCharges !== undefined) {
            for (const key of keysOf(storage.abilitiesExpendedCharges)) {
                const value = storage.abilitiesExpendedCharges[key]
                if (isNumber(value)) {
                    this.abilitiesExpendedCharges[key] = value
                }
            }
        }
        this.spellsExpendedSlots = CreatureStorage.properties.spellsExpendedSlots.value
        if (storage.spellsExpendedSlots !== undefined) {
            for (const key of keysOf(storage.spellsExpendedSlots)) {
                const value = storage.spellsExpendedSlots[key]
                if (isNumber(value)) {
                    this.spellsExpendedSlots[key] = value
                }
            }
        }
        this.choices = CreatureStorage.properties.choices.value
        if (storage.choices !== undefined) {
            for (const key of keysOf(storage.choices)) {
                this.choices[key] = storage.choices[key]
            }
        }
        this.conditions = CreatureStorage.properties.conditions.value
        if (storage.conditions !== undefined) {
            for (const value of storage.conditions) {
                if (isObjectId(value)) {
                    this.conditions.push(value)
                }
            }
        }
    }

    public static properties: DataPropertyMap<ICreatureStorage, CreatureStorage> = {
        health: {
            value: null,
            validate: isNumberOrNull
        },
        healthTemp: {
            value: null,
            validate: isNumberOrNull
        },
        abilitiesExpendedCharges: {
            get value() { return {} },
            validate: (value) => isRecord(value, (_, value) => isNumber(value)),
            simplify: simplifyExpended
        },
        spellsExpendedSlots: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, SpellLevel) && isNumber(value)),
            simplify: simplifyExpended
        },
        choices: {
            get value() { return {} },
            validate: (value) => isRecord(value),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        conditions: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(isObjectId),
            simplify: (value) => value.length > 0 ? value : null
        }
    }
}

export default CreatureStorage
