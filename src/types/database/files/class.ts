import type { IDatabaseFileData, IDatabaseFileStorage } from '..'
import type { LevelModifyType } from 'structure/database/files/class/levelData'
import type { DieType } from 'structure/dice'
import type { ArmorType, Attribute, ClassLevel, OptionalAttribute, ProficiencyLevel, ProficiencyLevelBasic, SpellLevel, ToolType, WeaponTypeValue } from 'structure/dnd'
import type { IModifierData } from './modifier'

export interface IClassLevelData {
    // Modifiers
    readonly abilities?: string[]
    readonly modifiers: IModifierData[]
    // Spells
    readonly type: LevelModifyType
    readonly spellAttribute: OptionalAttribute
    readonly spellSlots: Partial<Record<SpellLevel, number>>
    readonly preparationSlots: number // Max number of spells prepared for each level
    readonly learnedSlots: number // Max number of known spells for each level
}

export interface IClassData extends IDatabaseFileData {
    readonly name: string
    readonly description: string
    readonly content: string
    readonly hitDie: DieType
    readonly subclassLevel: ClassLevel
    readonly levels: Record<ClassLevel, IClassLevelData>
    // Proficiencies
    readonly proficienciesSave: Partial<Record<Attribute, ProficiencyLevel>>
    readonly proficienciesTool: Partial<Record<ToolType, ProficiencyLevel>>
    readonly proficienciesArmor: Partial<Record<ArmorType, ProficiencyLevelBasic>>
    readonly proficienciesWeapon: Partial<Record<WeaponTypeValue, ProficiencyLevelBasic>>
    // Spells
    readonly spellAttribute: OptionalAttribute
    readonly preparationAll: boolean
    readonly preparationSlotsScaling: OptionalAttribute
    readonly learnedAll: boolean
    readonly learnedSlotsScaling: OptionalAttribute
}

export interface IClassStorage extends IDatabaseFileStorage {

}
