import { EncounterCardFactory } from './factory'
import type EncounterCard from './card'
import { isRecord, isString, keysOf } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IEncounterCard, IEncounterStorage } from 'types/database/files/encounter'

function simplifyCardRecord(value: Record<string, IEncounterCard>): Simplify<Record<string, IEncounterCard>> | null {
    const result: Simplify<Record<string, IEncounterCard>> = {}
    let flag = false
    for (const key of keysOf(value)) {
        result[key] = EncounterCardFactory.simplify(value[key])
        flag ||= Object.keys(result[key]).length > 0
    }
    return flag ? result : null
}

class EncounterStorage implements IEncounterStorage {
    public readonly groups: string[]
    public readonly cards: Record<string, EncounterCard>

    public constructor(storage: Simplify<IEncounterStorage>) {
        this.groups = EncounterStorage.properties.groups.value
        if (storage.groups !== undefined) {
            for (const group of storage.groups) {
                if (isString(group)) {
                    this.groups.push(group)
                }
            }
        }
        this.cards = EncounterStorage.properties.cards.value
        if (storage.cards !== undefined) {
            for (const key of keysOf(storage.cards)) {
                this.cards[key] = EncounterCardFactory.create(storage.cards[key])
            }
        }
    }

    public static properties: DataPropertyMap<IEncounterStorage, EncounterStorage> = {
        cards: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isString(key) && EncounterCardFactory.validate(val)),
            simplify: simplifyCardRecord
        },
        groups: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(isString),
            simplify: (value) => value.length > 0 ? value : null
        }
    }
}

export default EncounterStorage
