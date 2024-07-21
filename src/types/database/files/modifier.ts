import type { MultipleChoiceData, SingleChoiceData } from '../choice'
import type { ModifierType } from 'structure/database/files/modifier/common'
import type { ModifierAbilityType } from 'structure/database/files/modifier/ability'
import type { ModifierAddType } from 'structure/database/files/modifier/add'
import type { ModifierBonusType } from 'structure/database/files/modifier/bonus'
import type { ModifierSetType } from 'structure/database/files/modifier/set'
import type { ModifierVariableType, OperationType } from 'structure/database/files/modifier/variable'
import type { AdvantageBinding, ConditionBinding, Language, OptionalAttribute, ProficiencyLevelBasic, DamageBinding, Sense, SizeType, Attribute, Skill, ToolType, ProficiencyLevel, ArmorType, WeaponTypeValue, MovementType, ScalingType } from 'structure/dnd'
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

export interface IModifierAbilityMeleeWeaponAttackBonusData extends IModifierAbilityDataBase {
    readonly subtype: ModifierAbilityType.MeleeWeaponAttackBonus
    readonly value: number
}

export interface IModifierAbilityRangedWeaponAttackBonusData extends IModifierAbilityDataBase {
    readonly subtype: ModifierAbilityType.RangedWeaponAttackBonus
    readonly value: number
}

export interface IModifierAbilityThrownWeaponAttackBonusData extends IModifierAbilityDataBase {
    readonly subtype: ModifierAbilityType.ThrownWeaponAttackBonus
    readonly value: number
}

export interface IModifierAbilityDamageBonusData extends IModifierAbilityDataBase {
    readonly subtype: ModifierAbilityType.DamageBonus
    readonly value: number
}

export interface IModifierAbilityMeleeWeaponDamageBonusData extends IModifierAbilityDataBase {
    readonly subtype: ModifierAbilityType.MeleeWeaponDamageBonus
    readonly value: number
}

export interface IModifierAbilityRangedWeaponDamageBonusData extends IModifierAbilityDataBase {
    readonly subtype: ModifierAbilityType.RangedWeaponDamageBonus
    readonly value: number
}

export interface IModifierAbilityThrownWeaponDamageBonusData extends IModifierAbilityDataBase {
    readonly subtype: ModifierAbilityType.ThrownWeaponDamageBonus
    readonly value: number
}

export type IModifierAbilityData = IModifierAbilityAttackBonusData |
IModifierAbilityMeleeWeaponAttackBonusData |
IModifierAbilityRangedWeaponAttackBonusData |
IModifierAbilityThrownWeaponAttackBonusData |
IModifierAbilityDamageBonusData |
IModifierAbilityMeleeWeaponDamageBonusData |
IModifierAbilityRangedWeaponDamageBonusData |
IModifierAbilityThrownWeaponDamageBonusData

export interface IModifierAddDataBase extends IModifierDataBase {
    readonly type: ModifierType.Add
    readonly subtype: ModifierAddType
}

export interface IModifierAddAbilityData extends IModifierAddDataBase {
    readonly subtype: ModifierAddType.Ability
    readonly value: MultipleChoiceData<ObjectId | null>
}

export interface IModifierAddLinkedData extends IModifierAddDataBase {
    readonly subtype: ModifierAddType.Linked
    readonly category: string
    readonly numChoices: number
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
IModifierAddDamageImmunityData | IModifierAddConditionImmunityData |
IModifierAddLinkedData

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

export interface IModifierBonusAbilityScoreData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.AbilityScore
    readonly value: Partial<Record<Attribute, number>>
}

export interface IModifierBonusSaveData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.Save
    readonly value: Partial<Record<Attribute, number>>
}

export interface IModifierBonusSkillData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.Skill
    readonly value: Partial<Record<Skill, number>>
}

export interface IModifierBonusSpeedData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.Speed
    readonly value: Partial<Record<MovementType, number>>
}

export interface IModifierBonusSpellAttackData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.SpellAttack
    readonly value: number
}

export interface IModifierBonusSpellSaveData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.SpellSave
    readonly value: number
}

export interface IModifierBonusMultiAttackData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.MultiAttack
    readonly value: number
}

export interface IModifierBonusCritRangeData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.CritRange
    readonly value: number
}

export interface IModifierBonusCritDieCountData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.CritDieCount
    readonly value: number
}

export interface IModifierBonusAttunementSlotsData extends IModifierBonusDataBase {
    readonly subtype: ModifierBonusType.AttunementSlot
    readonly value: number
}

export type IModifierBonusData = IModifierBonusACData |
IModifierBonusAbilityScoreData | IModifierBonusSaveData |
IModifierBonusSkillData | IModifierBonusSpellAttackData |
IModifierBonusSpellSaveData | IModifierBonusMultiAttackData |
IModifierBonusSpeedData | IModifierBonusAttunementSlotsData |
IModifierBonusCritRangeData | IModifierBonusCritDieCountData

export interface IModifierChoiceData extends IModifierDataBase {
    readonly type: ModifierType.Choice
    readonly num: number
    readonly options: Record<string, IModifierData>
}

export interface IModifierSetDataBase extends IModifierDataBase {
    readonly type: ModifierType.Set
    readonly subtype: ModifierSetType
}

export interface IModifierSetSpellAttributeData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.SpellAttribute
    readonly value: SingleChoiceData<OptionalAttribute>
}

export interface IModifierSetArmorClassBaseData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.ArmorClassBase
    readonly values: Partial<Record<ScalingType, number>>
    readonly maxValues: Partial<Record<ScalingType, number>>
}

export interface IModifierSetSizeData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.Size
    readonly value: SingleChoiceData<SizeType>
}

export interface IModifierSetSenseData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.Sense
    readonly sense: SingleChoiceData<Sense>
    readonly value: Partial<Record<ScalingType, number>>
}

export interface IModifierSetSpeedData extends IModifierSetDataBase {
    readonly subtype: ModifierSetType.Speed
    readonly speed: SingleChoiceData<MovementType>
    readonly value: Partial<Record<ScalingType, number>>
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
    readonly proficiency: MultipleChoiceData<WeaponTypeValue>
    readonly value: ProficiencyLevelBasic
}

export type IModifierSetData = IModifierSetSenseData | IModifierSetSpeedData |
IModifierSetSizeData | IModifierSetSpellAttributeData |
IModifierSetSaveProficiencyData | IModifierSetSkillProficiencyData |
IModifierSetToolProficiencyData | IModifierSetLanguageProficiencyData |
IModifierSetArmorProficiencyData | IModifierSetWeaponProficiencyData |
IModifierSetArmorClassBaseData

export interface IModifierVariableDataBase extends IModifierDataBase {
    readonly type: ModifierType.Variable
    readonly subtype: ModifierVariableType
    readonly variable: string
    readonly operation: OperationType
}

export interface IModifierVariableNumberData extends IModifierVariableDataBase {
    readonly subtype: ModifierVariableType.Number
    readonly value: SingleChoiceData<number>
}

export interface IModifierVariableCollectionData extends IModifierVariableDataBase {
    readonly subtype: ModifierVariableType.Collection
    readonly value: MultipleChoiceData<string>
}

export type IModifierVariableData = IModifierVariableCollectionData |
IModifierVariableNumberData

export interface IModifierGroupData extends IModifierDataBase {
    readonly type: ModifierType.Group
    readonly modifiers: Record<string, IModifierData>
}

export type IModifierData = IModifierAddData | IModifierBonusData |
IModifierAbilityData | IModifierChoiceData | IModifierRemoveData |
IModifierSetData | IModifierVariableData | IModifierGroupData

export interface IModifierStorage {

}
