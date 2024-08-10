import type { IModifierData } from './modifier'
import type { CreatureType, Language, MovementType, ProficiencyLevelBasic, Sense, SizeType } from 'structure/dnd'

export interface IRaceData {
    readonly name: string
    readonly description: string
    readonly content: string
    readonly type: CreatureType
    readonly size: SizeType
    readonly speed: Partial<Record<MovementType, number>>
    readonly senses: Partial<Record<Sense, number>>
    readonly languages: Partial<Record<Language, ProficiencyLevelBasic>>
    readonly modifiers: IModifierData[]
    readonly abilities?: string[]
}

export interface IRaceStorage {

}
