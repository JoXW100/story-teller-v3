import type { ObjectId } from 'types'

export interface IEncounterData {
    readonly name: string
    readonly description: string
    readonly challenge: number
    readonly xp: number
    readonly creatures: Record<ObjectId, number>
}

export interface IEncounterCard {
    readonly group: number
    readonly health: number
    readonly randomMaxHealth: number // Seed for randomization
    readonly initiative: number
    readonly notes: string
}

export interface IEncounterStorage {
    readonly groups: string[]
    readonly cards: Record<string, IEncounterCard>
}
