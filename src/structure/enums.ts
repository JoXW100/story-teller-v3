import { AbilityType } from './database/files/ability/common'
import { EffectConditionType } from './database/effectCondition'
import { EffectCategory, EffectType } from './database/effect/common'
import { ConditionType, ConditionValueType } from './database/condition'
import { ModifierType } from 'structure/database/files/modifier/common'
import { ModifierAddType } from './database/files/modifier/add'
import { ModifierBonusType } from './database/files/modifier/bonus'
import { ModifierAbilityType } from './database/files/modifier/ability'
import { ModifierSetType } from './database/files/modifier/set'
import { LevelModifyType } from './database/files/class/levelData'
import { ModifierVariableType, OperationType } from './database/files/modifier/variable'
import { ActionType, AdvantageBinding, Alignment, AreaType, ArmorType, Attribute, CastingTime, CreatureType, DamageType, Duration, ItemType, Language, MagicSchool, MovementType, OptionalAttribute, ProficiencyLevel, ProficiencyLevelBasic, ProficiencyType, Rarity, DamageBinding, RestType, ScalingType, Sense, SizeType, Skill, SpellPreparationType, TargetType, ToolType, WeaponTypeValue, ConditionBinding, ClassLevel, SpellLevel, WeaponType, WeaponTypeCategory } from './dnd'
import { DieType } from './dice'
import { CalcMode } from './database'
import { ViewMode } from 'components/contexts/app'
import type { Enum, ValueOf } from 'types'

export interface IEnumType<T extends Enum = Enum> {
    enum: T
    default: T[keyof T]
}

const EnumTypes = {
    calc: {
        enum: CalcMode,
        default: CalcMode.Auto
    },
    size: {
        enum: SizeType,
        default: SizeType.Medium
    },
    creatureType: {
        enum: CreatureType,
        default: CreatureType.None
    },
    alignment: {
        enum: Alignment,
        default: Alignment.None
    },
    attr: {
        enum: Attribute,
        default: Attribute.STR
    },
    optionalAttr: {
        enum: OptionalAttribute,
        default: OptionalAttribute.None
    },
    die: {
        enum: DieType,
        default: DieType.None
    },
    movement: {
        enum: MovementType,
        default: MovementType.Walk
    },
    skill: {
        enum: Skill,
        default: Skill.Acrobatics
    },
    abilityType: {
        enum: AbilityType,
        default: AbilityType.Feature
    },
    itemType: {
        enum: ItemType,
        default: ItemType.WondrousItem
    },
    effectType: {
        enum: EffectType,
        default: EffectType.Text
    },
    condition: {
        enum: ConditionType,
        default: ConditionType.None
    },
    conditionValue: {
        enum: ConditionValueType,
        default: ConditionValueType.Constant
    },
    effectCondition: {
        enum: EffectConditionType,
        default: EffectConditionType.Hit
    },
    effectCategory: {
        enum: EffectCategory,
        default: EffectCategory.Uncategorized
    },
    scaling: {
        enum: ScalingType,
        default: ScalingType.Constant
    },
    modifierType: {
        enum: ModifierType,
        default: ModifierType.Add
    },
    modifierAbilityType: {
        enum: ModifierAbilityType,
        default: ModifierAbilityType.AttackBonus
    },
    modifierAddType: {
        enum: ModifierAddType,
        default: ModifierAddType.Ability
    },
    modifierBonusType: {
        enum: ModifierBonusType,
        default: ModifierBonusType.AC
    },
    modifierSetType: {
        enum: ModifierSetType,
        default: ModifierSetType.SpellAttribute
    },
    modifierVariableType: {
        enum: ModifierVariableType,
        default: ModifierVariableType.Number
    },
    operationType: {
        enum: OperationType,
        default: OperationType.Add
    },
    damageType: {
        enum: DamageType,
        default: DamageType.None
    },
    action: {
        enum: ActionType,
        default: ActionType.Action
    },
    target: {
        enum: TargetType,
        default: TargetType.None
    },
    magicSchool: {
        enum: MagicSchool,
        default: MagicSchool.Abjuration
    },
    castingTime: {
        enum: CastingTime,
        default: CastingTime.Action
    },
    duration: {
        enum: Duration,
        default: Duration.Instantaneous
    },
    area: {
        enum: AreaType,
        default: AreaType.None
    },
    armor: {
        enum: ArmorType,
        default: ArmorType.Light
    },
    weaponTypeValue: {
        enum: WeaponTypeValue,
        default: WeaponTypeValue.Simple
    },
    weaponType: {
        enum: WeaponType,
        default: WeaponType.Club
    },
    weaponTypeCategory: {
        enum: WeaponTypeCategory,
        default: WeaponTypeCategory.Simple
    },
    language: {
        enum: Language,
        default: Language.Common
    },
    sense: {
        enum: Sense,
        default: Sense.DarkVision
    },
    tool: {
        enum: ToolType,
        default: ToolType.AlchemistsSupplies
    },
    proficiencyType: {
        enum: ProficiencyType,
        default: ProficiencyType.Armor
    },
    proficiencyLevel: {
        enum: ProficiencyLevel,
        default: ProficiencyLevel.Proficient
    },
    proficiencyLevelBasic: {
        enum: ProficiencyLevelBasic,
        default: ProficiencyLevelBasic.Proficient
    },
    restType: {
        enum: RestType,
        default: RestType.None
    },
    rarity: {
        enum: Rarity,
        default: Rarity.Mundane
    },
    spellPreparation: {
        enum: SpellPreparationType,
        default: SpellPreparationType.None
    },
    advantageBinding: {
        enum: AdvantageBinding,
        default: AdvantageBinding.Generic
    },
    damageBinding: {
        enum: DamageBinding,
        default: DamageBinding.Generic
    },
    conditionBinding: {
        enum: ConditionBinding,
        default: ConditionBinding.Generic
    },
    viewMode: {
        enum: ViewMode,
        default: ViewMode.SplitView
    },
    classLevel: {
        enum: ClassLevel,
        default: ClassLevel.Level1
    },
    spellLevel: {
        enum: SpellLevel,
        default: SpellLevel.Cantrip
    },
    levelModifyType: {
        enum: LevelModifyType,
        default: LevelModifyType.Add
    }
} satisfies Record<string, IEnumType>

export type EnumTypeKey = keyof typeof EnumTypes
export type EnumTypeEnum<T extends EnumTypeKey = EnumTypeKey> = (typeof EnumTypes)[T]['enum']
export type EnumTypeValue<T extends EnumTypeKey = EnumTypeKey> = { [K in EnumTypeKey]: ValueOf<EnumTypeEnum<K>> }[T]
export type EnumTypeKeyValue = { [K in EnumTypeKey]: `enum-${K}-${EnumTypeValue<K> & string}` }[EnumTypeKey]

export type ExtractEnumType<T> = T extends EnumTypeKey
    ? typeof EnumTypes[T]
    : IEnumType

export function getEnumType<T extends EnumTypeKey> (key: T): ExtractEnumType<T>
export function getEnumType<T extends string>(key: string): ExtractEnumType<T> | null
export function getEnumType<T extends EnumTypeKey> (key: T): T extends EnumTypeKey ? ExtractEnumType<T> : IEnumType | null {
    return EnumTypes[key] as any ?? null
}
