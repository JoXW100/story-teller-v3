import type { LevelModifyType } from 'structure/database/files/class/levelData'
import type { DieType } from 'structure/dice'
import type { ArmorType, Attribute, ClassLevel, OptionalAttribute, ProficiencyLevel, ProficiencyLevelBasic, SpellLevel, ToolType, WeaponType } from 'structure/dnd'
import type { ObjectId } from 'types'

export interface IClassLevelData {
    // Abilities
    readonly abilities: Array<ObjectId | string>
    // Modifiers
    readonly modifiers: ObjectId[]
    // Spells
    readonly type: LevelModifyType
    readonly spellAttribute: OptionalAttribute
    readonly spellSlots: Partial<Record<SpellLevel, number>>
    readonly preparationSlots: number // Max number of spells prepared for each level
    readonly learnedSlots: number // Max number of known spells for each level
}

export interface IClassData {
    readonly name: string
    readonly description: string
    readonly hitDie: DieType
    readonly levels: Record<ClassLevel, IClassLevelData>
    // Proficiencies
    readonly proficienciesSave: Partial<Record<Attribute, ProficiencyLevel>>
    readonly proficienciesTool: Partial<Record<ToolType, ProficiencyLevel>>
    readonly proficienciesArmor: Partial<Record<ArmorType, ProficiencyLevelBasic>>
    readonly proficienciesWeapon: Partial<Record<WeaponType, ProficiencyLevelBasic>>
    // Spells
    readonly spellAttribute: OptionalAttribute
    readonly preparationAll: boolean
    readonly preparationSlotsScaling: OptionalAttribute
    readonly learnedAll: boolean
    readonly learnedSlotsScaling: OptionalAttribute
}

export interface IClassStorage {

}
