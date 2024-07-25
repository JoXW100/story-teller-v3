import type { IFileContent, IFileMetadata, IFileStorage } from '.'
import type { ObjectId } from '..'

interface IEncounterContent extends IFileContent {
}

interface IEncounterCard {
    initiative?: number
    health?: number
    maxHealth?: number
    notes?: string
    group?: number
}

interface IEncounterMetadata extends IFileMetadata {
    creatures?: ObjectId[]
    challenge?: number
    xp?: number
}

interface IEncounterStorage extends IFileStorage {
    cards: IEncounterCard[]
    groups: string[]
}

export type {
    IEncounterContent,
    IEncounterMetadata,
    IEncounterStorage,
    IEncounterCard
}
