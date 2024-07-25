import type { IFileContent, IFileMetadata, IFileStorage } from '.'
import type { ICreatureMetadata } from './creature'
import type { DiceType, Gender } from '../dnd'
import type { ObjectId } from '..'
import type InventoryItemData from './inventoryItem'

interface ICharacterContent extends IFileContent {
}

interface ICharacterMetadata extends IFileMetadata, ICreatureMetadata {
    simple?: boolean
    gender?: Gender
    age?: string
    height?: string
    weight?: string
    raceName?: string
    occupation?: string
    // Texts
    appearance?: string
    history?: string
    notes?: string
    // Race
    raceFile?: ObjectId | null
    // Class
    classFile?: ObjectId | null
}

interface ICharacterAbilityStorageData {
    expendedCharges?: number
}

interface ICharacterStorage extends IFileStorage {
    health?: number
    tempHealth?: number
    hitDice?: Partial<Record<DiceType, number>>
    inventory?: Record<string, InventoryItemData>
    inventoryOther?: string
    attunement?: [ObjectId, ObjectId, ObjectId]
    classData?: Record<string, any>
    cantrips?: ObjectId[]
    learnedSpells?: ObjectId[]
    preparedSpells?: ObjectId[]
    abilityData?: Record<string, ICharacterAbilityStorageData>
    spellData?: number[]
}

export type {
    ICharacterContent,
    ICharacterMetadata,
    ICharacterStorage,
    ICharacterAbilityStorageData
}
