import type { ModifierType } from 'structure/database/files/modifier/common'
import type { ModifierAbilityType } from 'structure/database/files/modifier/ability'
import type { ModifierAddType } from 'structure/database/files/modifier/add'
import type { ModifierBonusType } from 'structure/database/files/modifier/bonus'
import type { ModifierSetType } from 'structure/database/files/modifier/set'
import type { AdvantageBinding, ConditionBinding, Language, OptionalAttribute, ProficiencyLevelBasic, DamageBinding, Sense, SizeType, Attribute, Skill, ToolType, ProficiencyLevel, ArmorType, WeaponType } from 'structure/dnd'
import type { OptionTypeKey } from 'structure/optionData'
import type { DocumentType } from 'structure/database'
import type { ICondition } from 'types/database/condition'
import type { ObjectId } from 'types'

export interface IModifierDataBase {
    readonly type: ModifierType
    readonly name: string
    readonly description: string
    readonly condition: ICondition
}

export interface IModifierAbilityDataBase extends IModifierDataBase {
    readonly type: ModifierType.Ability
    readonly subtype: ModifierAbilityType
}

export interface IModifierAbilityAttackBonusData extends IModifierAbilityDataBase {
    readonly subtype: ModifierAbilityType.AttackBonus
    readonly value: number
}

export type IModifierAbilityData = IModifierAbilityAttackBonusData

export interface IModifierAddDataBase extends IModifierDataBase {
    readonly type: ModifierType.Add
    readonly subtype: ModifierAddType
}

export interface IModifierAddAbilityData extends IModifierAddDataBase {
    readonly subtype: ModifierAddType.Ability
    readonly value: MultipleChoiceData<ObjectId | null>
}

export interface IModifierAddSpellData extends IModifierAddDataBase {
    readonly subtype: ModifierAddType.Spell
    readonly value: MultipleChoiceData<ObjectId | null>
}

export interface IModifierAddAdvantageData extends IModifierAddDataBase {
    readonly subtype: ModifierAddType.Advantage
    readonly binding: SingleChoiceData<AdvantageBinding>
    readonly notes: string
}

export interface IModifierAddDisadvantageData extends IModifierAddDataBase {
    readonly subtype: ModifierAddType.Disadvantage
    readonly binding: SingleChoiceData<AdvantageBinding>
    readonly notes: string
}

export interface IModifierAddResistanceData extends IModifierAddDataBase {
    readonly subtype: ModifierAddType.Resistance
    readonly binding: SingleChoiceData<DamageBinding>
    readonly notes: string
}

export interface IModifierAddVulnerabilityData extends IModifierAddDataBase {
    readonly subtype: ModifierAddType.Vulnerability
    readonly binding: SingleChoiceData<DamageBinding>
    readonly notes: string
}

export interface IModifierAddDamageImmunityData extends IModifierAddDataBase {
    readonly subtype: ModifierAddType.DamageImmunity
    readonly binding: SingleChoiceData<DamageBinding>
    readonly notes: string
}

export interface IModifierAddConditionImmunityData extends IModifierAddDataBase {
    readonly subtype: ModifierAddType.ConditionImmunity
    readonly binding: SingleChoiceData<ConditionBinding>
    readonly notes: string
}

export type IModifierAddData = IModifierAddAbilityData | IModifierAddSpellData |
IModifierAddAdvantageData | IModifierAddDisadvantageData |
IModifierAddResistanceData | IModifierAddVulnerabilityData |
IModifierAddDamageImmunityData | IModifierAddConditionImmunityData

export interface IModifierRemoveData extends IModifierDataBase {
    readonly type: ModifierType.Remove
    readonly value: ObjectId | null
}

export interface IModifierBonusDataBase extends IModifierDataBase {
    readonly type: ModifierType.Bonus
    readonly subtype: ModifierBonusType
}

export interface IModifierBonusACData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.AC
    readonly value: number
}

export interface IModifierBonusStrengthData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.Strength
    readonly value: number
}

export interface IModifierBonusDexterityData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.Dexterity
    readonly value: number
}

export interface IModifierBonusConstitutionData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.Constitution
    readonly value: number
}

export interface IModifierBonusIntelligenceData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.Intelligence
    readonly value: number
}

export interface IModifierBonusWisdomData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.Wisdom
    readonly value: number
}

export interface IModifierBonusCharismaData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.Charisma
    readonly value: number
}

export interface IModifierBonusAllAttributesData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.AllAbilityScores
    readonly value: number
}

export type IModifierBonusData = IModifierBonusACData |
IModifierBonusStrengthData | IModifierBonusDexterityData |
IModifierBonusConstitutionData | IModifierBonusIntelligenceData |
IModifierBonusWisdomData | IModifierBonusCharismaData |
IModifierBonusAllAttributesData

export interface IInnerModifierData {
    readonly condition: ICondition
    readonly modifiers: ObjectId[]
}

export interface IModifierChoiceData extends IModifierDataBase {
    readonly type: ModifierType.Choice
    readonly num: number
    readonly options: Record<string, IInnerModifierData>
}

export interface IModifierSetDataBase extends IModifierDataBase {
    readonly type: ModifierType.Set
    readonly subtype: ModifierSetType
}

export interface IModifierSetSizeData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.Size
    readonly value: SingleChoiceData<SizeType>
}

export interface IModifierSetSenseData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.Sense
    readonly sense: SingleChoiceData<Sense>
    readonly value: number
}

export interface IModifierSetSpellAttributeData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.SpellAttribute
    readonly value: SingleChoiceData<OptionalAttribute>
}

export interface IModifierSetSaveProficiencyData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.SaveProficiency
    readonly proficiency: MultipleChoiceData<Attribute>
    readonly value: ProficiencyLevel
}

export interface IModifierSetSkillProficiencyData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.SkillProficiency
    readonly proficiency: MultipleChoiceData<Skill>
    readonly value: ProficiencyLevel
}

export interface IModifierSetToolProficiencyData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.ToolProficiency
    readonly proficiency: MultipleChoiceData<ToolType>
    readonly value: ProficiencyLevel
}

export interface IModifierSetLanguageProficiencyData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.LanguageProficiency
    readonly proficiency: MultipleChoiceData<Language>
    readonly value: ProficiencyLevelBasic
}

export interface IModifierSetArmorProficiencyData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.ArmorProficiency
    readonly proficiency: MultipleChoiceData<ArmorType>
    readonly value: ProficiencyLevelBasic
}

export interface IModifierSetWeaponProficiencyData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.WeaponProficiency
    readonly proficiency: MultipleChoiceData<WeaponType>
    readonly value: ProficiencyLevelBasic
}

export type IModifierSetData = IModifierSetSenseData | IModifierSetSizeData |
IModifierSetSpellAttributeData | IModifierSetSaveProficiencyData |
IModifierSetSkillProficiencyData | IModifierSetToolProficiencyData |
IModifierSetLanguageProficiencyData | IModifierSetArmorProficiencyData |
IModifierSetWeaponProficiencyData

export type IModifierData = IModifierAddData | IModifierBonusData |
IModifierAbilityData | IModifierChoiceData | IModifierRemoveData |
IModifierSetData

export interface IModifierStorage {

}

export interface ISingleChoiceData<V = unknown> {
    readonly isChoice: true
    readonly value: V[]
}

export interface IMultipleChoiceData<V = unknown> extends ISingleChoiceData<V> {
    readonly numChoices: number
}

export interface INonChoiceData<V = unknown> {
    readonly isChoice: false
    readonly value: V
}

export type SingleChoiceData<T = unknown> = ISingleChoiceData<T> | INonChoiceData<T>
export type MultipleChoiceData<T = unknown> = IMultipleChoiceData<T> | INonChoiceData<T>

export interface IEditorChoiceData {
    readonly type: 'enum' | 'id' | 'value'
    readonly value: unknown[]
    readonly numChoices?: number
    readonly enum?: OptionTypeKey
    readonly allowedTypes?: readonly DocumentType[]
}
