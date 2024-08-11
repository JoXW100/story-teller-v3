import type { IDatabaseFileData, IDatabaseFileStorage, ISubFile } from '..'
import type { IClassLevelData } from './class'
import type { ClassLevel, OptionalAttribute } from 'structure/dnd'

export interface ISubclassData extends IDatabaseFileData, ISubFile {
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

export interface ISubclassStorage extends IDatabaseFileStorage {

}
