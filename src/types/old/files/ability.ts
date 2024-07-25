import type { IFileContent, IFileMetadata, IFileStorage } from '.'
import type { IModifier } from './modifier'
import type ICreatureActionData from './iConditionalHitEffect'
import type { AbilityType, ActionType, RestType } from '../dnd'

interface IAbilityContent extends IFileContent {
}

interface IAbilityMetadata extends IFileMetadata, ICreatureActionData {
    type?: AbilityType
    action?: ActionType
    // Range
    range?: number
    rangeLong?: number
    rangeThrown?: number
    // Charges
    charges?: number[]
    chargesReset?: RestType
    // Modifiers
    modifiers?: IModifier[]
}

interface IAbilityStorage extends IFileStorage {
}

export type {
    IAbilityContent,
    IAbilityMetadata,
    IAbilityStorage
}
