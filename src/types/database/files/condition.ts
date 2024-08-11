import type { IDatabaseFileData, IDatabaseFileStorage } from '..'
import type { IModifierData } from './modifier'

export interface IConditionData extends IDatabaseFileData {
    readonly name: string
    readonly description: string
    // Modifiers
    readonly modifiers: IModifierData[]
}

export interface IConditionStorage extends IDatabaseFileStorage {

}
