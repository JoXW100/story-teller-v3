import { isEnum, isNumber, isNumberOrNull, isRecord, keysOf } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ICreatureStorage } from 'types/database/files/creature'
import { SpellLevel } from 'structure/dnd'

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
        }
    }
}

export default CreatureStorage
