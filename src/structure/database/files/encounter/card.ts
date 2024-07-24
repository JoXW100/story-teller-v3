import { asNumber, isNumber, isString } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IEncounterCard } from 'types/database/files/encounter'

class EncounterCard implements IEncounterCard {
    public readonly group: number
    public readonly health: number
    public readonly initiative: number
    public readonly randomMaxHealth: number
    public readonly notes: string

    public constructor(data: Simplify<IEncounterCard>) {
        this.group = data.group ?? EncounterCard.properties.group.value
        this.health = asNumber(data.health, EncounterCard.properties.health.value)
        this.randomMaxHealth = asNumber(data.randomMaxHealth, EncounterCard.properties.randomMaxHealth.value)
        this.initiative = asNumber(data.initiative, EncounterCard.properties.initiative.value)
        this.notes = data.notes ?? EncounterCard.properties.notes.value
    }

    public static properties: DataPropertyMap<IEncounterCard, EncounterCard> = {
        group: {
            value: NaN,
            validate: (value) => isNumber(value, true),
            simplify: (value) => isNumber(value) ? value : null
        },
        health: {
            value: NaN,
            validate: (value) => isNumber(value, true),
            simplify: (value) => isNumber(value) ? value : null
        },
        randomMaxHealth: {
            value: NaN,
            validate: (value) => isNumber(value, true),
            simplify: (value) => isNumber(value) ? value : null
        },
        initiative: {
            value: NaN,
            validate: (value) => isNumber(value, true),
            simplify: (value) => isNumber(value) ? value : null
        },
        notes: {
            value: '',
            validate: isString
        }
    }
}

export default EncounterCard
