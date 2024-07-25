import type { IClassLevelData, IClassStorage } from './class'
import type { ClassLevel, OptionalAttribute } from 'structure/dnd'
import type { ObjectId } from 'types'

export interface ISubclassData {
    readonly name: string
    readonly description: string
    readonly parentClass: ObjectId | null
    readonly levels: Record<ClassLevel, IClassLevelData>
    // Spells
    readonly spellAttribute: OptionalAttribute
    readonly preparationAll: boolean
    readonly preparationSlotsScaling: OptionalAttribute
    readonly learnedAll: boolean
    readonly learnedSlotsScaling: OptionalAttribute
    readonly ritualCaster: boolean
}

export interface ISubclassStorage extends IClassStorage {

}
