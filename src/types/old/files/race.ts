import type { IFileContent, IFileMetadata, IFileStorage } from '.'
import type { AdvantageBinding, CreatureType, Language, MovementType, Sense, SizeType } from '../dnd'
import type { IModifier } from './modifier'

interface IRaceContent extends IFileContent {
}

interface IRaceMetadata extends IFileMetadata {
    type?: CreatureType
    size?: SizeType

    resistances?: string
    vulnerabilities?: string
    dmgImmunities?: string
    conImmunities?: string
    advantages?: Partial<Record<AdvantageBinding, string>>
    disadvantages?: Partial<Record<AdvantageBinding, string>>

    speed?: Partial<Record<MovementType, number>>
    senses?: Partial<Record<Sense, number>>
    proficienciesLanguage?: Language[]
    // Modifiers
    modifiers?: IModifier[]
}

interface IItemStorage extends IFileStorage {
}

export type {
    IRaceContent,
    IRaceMetadata,
    IItemStorage
}
