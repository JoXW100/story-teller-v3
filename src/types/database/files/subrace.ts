import type { IDatabaseFileData, IDatabaseFileStorage, ISubFile } from '..'
import type { IModifierData } from './modifier'

export interface ISubraceData extends IDatabaseFileData, ISubFile {
    readonly name: string
    readonly description: string
    readonly content: string
    // Modifiers
    readonly modifiers: IModifierData[]
}

export interface ISubraceStorage extends IDatabaseFileStorage {

}
