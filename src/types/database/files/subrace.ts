import type { ISubFile } from '..'
import type { IClassStorage } from './class'
import type { IModifierData } from './modifier'

export interface ISubraceData extends ISubFile {
    readonly name: string
    readonly description: string
    readonly content: string

    readonly abilities?: string[]
    // Modifiers
    readonly modifiers: IModifierData[]
}

export interface ISubraceStorage extends IClassStorage {

}
