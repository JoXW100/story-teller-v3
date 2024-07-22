import type { ICalcValue } from 'structure/database'
import type { ISourceData } from 'structure/database/files/modifier/modifier'
import type { DieType } from 'structure/dice'
import type { AdvantageBinding, Alignment, ArmorType, Attribute, ConditionBinding, CreatureType, Language, MovementType, OptionalAttribute, ProficiencyLevel, ProficiencyLevelBasic, DamageBinding, Sense, SizeType, Skill, ToolType, WeaponTypeValue, SpellLevel } from 'structure/dnd'
import type { ObjectId } from 'types'

export interface ISourceBinding {
    readonly source: ISourceData | null
    readonly description: string
}

export interface ICreatureData {
    readonly name: string
    readonly description: string
    readonly portrait: string
    // Info
    readonly size: SizeType
    readonly type: CreatureType
    readonly alignment: Alignment
    readonly challenge: number
    readonly xp: number
    // Stats
    readonly level: number
    readonly hitDie: DieType
    readonly health: ICalcValue
    readonly ac: ICalcValue
    readonly proficiency: ICalcValue
    readonly initiative: ICalcValue
    readonly speed: Partial<Record<MovementType, number>>
    readonly senses: Partial<Record<Sense, number>>
    // Attributes
    readonly str: number
    readonly dex: number
    readonly con: number
    readonly int: number
    readonly cha: number
    readonly wis: number
    // Passives
    readonly passivePerception: ICalcValue
    readonly passiveInvestigation: ICalcValue
    readonly passiveInsight: ICalcValue
    // Proficiencies
    readonly proficienciesSave: Partial<Record<Attribute, ProficiencyLevel>>
    readonly proficienciesSkill: Partial<Record<Skill, ProficiencyLevel>>
    readonly proficienciesTool: Partial<Record<ToolType, ProficiencyLevel>>
    readonly proficienciesLanguage: Partial<Record<Language, ProficiencyLevelBasic>>
    readonly proficienciesArmor: Partial<Record<ArmorType, ProficiencyLevelBasic>>
    readonly proficienciesWeapon: Partial<Record<WeaponTypeValue, ProficiencyLevelBasic>>
    // Advantages
    readonly advantages: Partial<Record<AdvantageBinding, readonly ISourceBinding[]>>
    readonly disadvantages: Partial<Record<AdvantageBinding, readonly ISourceBinding[]>>
    // Resistances
    readonly resistances: Partial<Record<DamageBinding, readonly ISourceBinding[]>>
    readonly vulnerabilities: Partial<Record<DamageBinding, readonly ISourceBinding[]>>
    readonly damageImmunities: Partial<Record<DamageBinding, readonly ISourceBinding[]>>
    readonly conditionImmunities: Partial<Record<ConditionBinding, readonly ISourceBinding[]>>
    // Spells
    readonly spellAttribute: OptionalAttribute
    readonly casterLevel: ICalcValue
    readonly spells: ObjectId[]
    readonly spellSlots: Partial<Record<SpellLevel, number>>
    // Abilities
    readonly abilities: Array<ObjectId | string>
}

export interface ICreatureStorage {
    readonly health: number | null
    readonly healthTemp: number | null
    readonly abilitiesExpendedCharges: Record<string, number>
    readonly spellsExpendedSlots: Partial<Record<SpellLevel, number>>
    readonly choices: Record<string, unknown>
}
