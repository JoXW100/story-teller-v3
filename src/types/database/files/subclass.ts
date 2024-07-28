import type { ISubFile } from '..'
import type { IClassLevelData, IClassStorage } from './class'
import type { ClassLevel, OptionalAttribute } from 'structure/dnd'

export interface ISubclassData extends ISubFile {
    readonly name: string
    readonly description: string
    readonly content: string
    readonly levels: Record<ClassLevel, IClassLevelData>
    // Spells
    readonly spellAttribute: OptionalAttribute
    readonly preparationAll: boolean
    readonly preparationSlotsScaling: OptionalAttribute
    readonly learnedAll: boolean
    readonly learnedSlotsScaling: OptionalAttribute
}

export interface ISubclassStorage extends IClassStorage {

}
