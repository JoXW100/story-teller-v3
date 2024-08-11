import type { IDatabaseFileData, IDatabaseFileStorage } from '..'
import type { ObjectId } from 'types'

export interface IEncounterData extends IDatabaseFileData {
    readonly name: string
    readonly description: string
    readonly content: string
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

export interface IEncounterStorage extends IDatabaseFileStorage {
    readonly groups: string[]
    readonly cards: Record<string, IEncounterCard>
}
