import type { IClassStorage } from './class'
import type { ObjectId } from 'types'

export interface ISubraceData {
    readonly name: string
    readonly description: string
    readonly parentRace: ObjectId | null
    // Abilities
    readonly abilities: Array<ObjectId | string>
    // Modifiers
    readonly modifiers: ObjectId[]
}

export interface ISubraceStorage extends IClassStorage {

}
