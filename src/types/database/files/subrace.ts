import type { ISubFile } from '..'
import type { IClassStorage } from './class'
import type { ObjectId } from 'types'

export interface ISubraceData extends ISubFile {
    readonly name: string
    readonly description: string
    readonly content: string
    // Abilities
    readonly abilities: Array<ObjectId | string>
    // Modifiers
    readonly modifiers: ObjectId[]
}

export interface ISubraceStorage extends IClassStorage {

}
