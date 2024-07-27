import type { CreatureType, Language, MovementType, ProficiencyLevelBasic, Sense, SizeType } from 'structure/dnd'
import type { ObjectId } from 'types'

export interface IRaceData {
    readonly name: string
    readonly description: string
    readonly content: string
    readonly type: CreatureType
    readonly size: SizeType
    readonly speed: Partial<Record<MovementType, number>>
    readonly senses: Partial<Record<Sense, number>>
    readonly languages: Partial<Record<Language, ProficiencyLevelBasic>>
    readonly abilities: Array<ObjectId | string>
    readonly modifiers: ObjectId[]
}

export interface IRaceStorage {

}
