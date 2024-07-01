import { AbilityType } from './database/files/ability/common'
import { ActionType, AdvantageBinding, Alignment, AreaType, ArmorClassBase, ArmorType, Attribute, CastingTime, CreatureType, DamageType, Duration, ItemType, Language, MagicSchool, MeleeWeaponType, MovementType, OptionalAttribute, ProficiencyLevel, ProficiencyLevelBasic, ProficiencyType, RangedWeaponType, Rarity, DamageBinding, RestType, ScalingType, Sense, SizeType, Skill, SpellPreparationType, TargetType, ThrownWeaponType, ToolType, WeaponType, ConditionBinding, ClassLevel, SpellLevel } from './dnd'
import { DieType } from './dice'
import { CalcMode } from './database'
import { EffectConditionType } from './database/effectCondition'
import { EffectScaling, EffectType } from './database/effect/common'
import { ScalingModifierType } from './database/scalingModifier/common'
import type { Enum } from 'types'
import { ViewMode } from 'components/contexts/app'
import { ConditionType, ConditionValueType } from './database/condition'
import { ModifierType } from './database/files/modifier/common'
import { ModifierAddType } from './database/files/modifier/add'
import { ModifierBonusType } from './database/files/modifier/bonus'
import { ModifierAbilityType } from './database/files/modifier/ability'
import { ModifierSetType } from './database/files/modifier/set'
import { LevelModifyType } from './database/files/class/levelData'
import { ModifierVariableType, OperationType } from './database/files/modifier/variable'

export interface IOptionType<T extends Enum = Enum> {
    enum: T
    default: T[keyof T]
    options: Record<T[keyof T], React.ReactNode>
}

const OptionTypes = {
    calc: {
        enum: CalcMode,
        default: CalcMode.Auto,
        options: {
            [CalcMode.Auto]: 'Auto',
            [CalcMode.Modify]: 'Modify',
            [CalcMode.Override]: 'Override'
        }
    } satisfies IOptionType<typeof CalcMode>,
    size: {
        enum: SizeType,
        default: SizeType.Medium,
        options: {
            [SizeType.Gargantuan]: 'Gargantuan',
            [SizeType.Huge]: 'Huge',
            [SizeType.Large]: 'Large',
            [SizeType.Medium]: 'Medium',
            [SizeType.Small]: 'Small',
            [SizeType.Tiny]: 'Tiny'
        }
    } satisfies IOptionType<typeof SizeType>,
    creatureType: {
        enum: CreatureType,
        default: CreatureType.None,
        options: {
            [CreatureType.None]: 'None',
            [CreatureType.Aberration]: 'Aberration',
            [CreatureType.Beast]: 'Beast',
            [CreatureType.Celestial]: 'Celestial',
            [CreatureType.Construct]: 'Construct',
            [CreatureType.Dragon]: 'Dragon',
            [CreatureType.Elemental]: 'Elemental',
            [CreatureType.Fey]: 'Fey',
            [CreatureType.Fiend]: 'Fiend',
            [CreatureType.Giant]: 'Giant',
            [CreatureType.Humanoid]: 'Humanoid',
            [CreatureType.Monstrosity]: 'Monstrosity',
            [CreatureType.Ooze]: 'Ooze',
            [CreatureType.Plant]: 'Plant',
            [CreatureType.Undead]: 'Undead'
        }
    } satisfies IOptionType<typeof CreatureType>,
    alignment: {
        enum: Alignment,
        default: Alignment.None,
        options: {
            [Alignment.None]: 'None',
            [Alignment.Unaligned]: 'Unaligned',
            [Alignment.Any]: 'Any',
            [Alignment.ChaoticEvil]: 'Chaotic Evil',
            [Alignment.ChaoticGood]: 'Chaotic Good',
            [Alignment.ChaoticNeutral]: 'Chaotic Neutral',
            [Alignment.LawfulEvil]: 'Lawful Evil',
            [Alignment.LawfulGood]: 'Lawful Good',
            [Alignment.LawfulNeutral]: 'Lawful Neutral',
            [Alignment.NeutralEvil]: 'Neutral Evil',
            [Alignment.NeutralGood]: 'Neutral Good',
            [Alignment.TrueNeutral]: 'True Neutral'
        }
    } satisfies IOptionType<typeof Alignment>,
    attr: {
        enum: Attribute,
        default: Attribute.STR,
        options: {
            [Attribute.STR]: 'STR',
            [Attribute.DEX]: 'DEX',
            [Attribute.CON]: 'CON',
            [Attribute.INT]: 'INT',
            [Attribute.WIS]: 'WIS',
            [Attribute.CHA]: 'CHA'
        }
    } satisfies IOptionType<typeof Attribute>,
    optionalAttr: {
        enum: OptionalAttribute,
        default: OptionalAttribute.None,
        options: {
            [OptionalAttribute.None]: 'None',
            [OptionalAttribute.STR]: 'STR',
            [OptionalAttribute.DEX]: 'DEX',
            [OptionalAttribute.CON]: 'CON',
            [OptionalAttribute.INT]: 'INT',
            [OptionalAttribute.WIS]: 'WIS',
            [OptionalAttribute.CHA]: 'CHA'
        }
    } satisfies IOptionType<typeof OptionalAttribute>,
    die: {
        enum: DieType,
        default: DieType.None,
        options: {
            [DieType.None]: 'None',
            [DieType.DX]: 'DX',
            [DieType.D4]: 'D4',
            [DieType.D6]: 'D6',
            [DieType.D8]: 'D8',
            [DieType.D10]: 'D10',
            [DieType.D12]: 'D12',
            [DieType.D20]: 'D20',
            [DieType.D100]: 'D100'
        }
    } satisfies IOptionType<typeof DieType>,
    movement: {
        enum: MovementType,
        default: MovementType.Walk,
        options: {
            [MovementType.Burrow]: 'Burrow',
            [MovementType.Climb]: 'Climb',
            [MovementType.Fly]: 'Fly',
            [MovementType.Hover]: 'Hover',
            [MovementType.Swim]: 'Swim',
            [MovementType.Walk]: 'Walk'
        }
    } satisfies IOptionType<typeof MovementType>,
    skill: {
        enum: Skill,
        default: Skill.Acrobatics,
        options: {
            [Skill.Acrobatics]: 'Acrobatics',
            [Skill.AnimalHandling]: 'Animal Handling',
            [Skill.Arcana]: 'Arcana',
            [Skill.Athletics]: 'Athletics',
            [Skill.Deception]: 'Deception',
            [Skill.History]: 'History',
            [Skill.Insight]: 'Insight',
            [Skill.Intimidation]: 'Intimidation',
            [Skill.Investigation]: 'Investigation',
            [Skill.Medicine]: 'Medicine',
            [Skill.Nature]: 'Nature',
            [Skill.Perception]: 'Perception',
            [Skill.Performance]: 'Performance',
            [Skill.Persuasion]: 'Persuasion',
            [Skill.Religion]: 'Religion',
            [Skill.SleightOfHand]: 'Sleight of Hand',
            [Skill.Stealth]: 'Stealth',
            [Skill.Survival]: 'Survival'
        }
    } satisfies IOptionType<typeof Skill>,
    abilityType: {
        enum: AbilityType,
        default: AbilityType.Feature,
        options: {
            [AbilityType.Feature]: 'Feature',
            [AbilityType.Attack]: 'Attack',
            [AbilityType.MeleeAttack]: 'Melee Attack',
            [AbilityType.MeleeWeapon]: 'Melee Weapon',
            [AbilityType.RangedAttack]: 'Ranged Attack',
            [AbilityType.RangedWeapon]: 'Ranged Weapon',
            [AbilityType.ThrownWeapon]: 'Thrown Weapon'
        }
    } satisfies IOptionType<typeof AbilityType>,
    itemType: {
        enum: ItemType,
        default: ItemType.Armor,
        options: {
            [ItemType.Armor]: 'Armor',
            [ItemType.Trinket]: 'Trinket',
            [ItemType.Consumable]: 'Consumable',
            [ItemType.MeleeWeapon]: 'Melee Weapon',
            [ItemType.RangedWeapon]: 'Ranged Weapon',
            [ItemType.ThrownWeapon]: 'Thrown Weapon'
        }
    } satisfies IOptionType<typeof ItemType>,
    effectType: {
        enum: EffectType,
        default: EffectType.Text,
        options: {
            [EffectType.Text]: 'Text',
            [EffectType.Damage]: 'Damage'
        }
    },
    condition: {
        enum: ConditionType,
        default: ConditionType.None,
        options: {
            [ConditionType.None]: 'None',
            [ConditionType.And]: 'And',
            [ConditionType.Nand]: 'Nand',
            [ConditionType.Or]: 'Or',
            [ConditionType.Nor]: 'Nor',
            [ConditionType.Not]: 'Not',
            [ConditionType.Equals]: 'Equals',
            [ConditionType.NotEquals]: 'Not Equals',
            [ConditionType.GreaterEquals]: 'Greater or Equals',
            [ConditionType.LessEquals]: 'Less or Equals'
        }
    } satisfies IOptionType<typeof ConditionType>,
    conditionValue: {
        enum: ConditionValueType,
        default: ConditionValueType.Constant,
        options: {
            [ConditionValueType.Constant]: 'Constant',
            [ConditionValueType.Boolean]: 'Boolean',
            [ConditionValueType.Property]: 'Property'
        }
    } satisfies IOptionType<typeof ConditionValueType>,
    effectConditionType: {
        enum: EffectConditionType,
        default: EffectConditionType.Hit,
        options: {
            [EffectConditionType.None]: 'None',
            [EffectConditionType.Hit]: 'Hit',
            [EffectConditionType.Save]: 'Save'
        }
    } satisfies IOptionType<typeof EffectConditionType>,
    effectScaling: {
        enum: EffectScaling,
        default: EffectScaling.Level,
        options: {
            [EffectScaling.Level]: 'Level',
            [EffectScaling.CasterLevel]: 'Caster Level',
            [EffectScaling.SpellSlot]: 'Spell Slot'
        }
    } satisfies IOptionType<typeof EffectScaling>,
    scaling: {
        enum: ScalingType,
        default: ScalingType.None,
        options: {
            [ScalingType.None]: 'None',
            [ScalingType.Finesse]: 'Finesse',
            [ScalingType.SpellModifier]: 'Spell Modifier',
            [ScalingType.STR]: 'STR',
            [ScalingType.DEX]: 'DEX',
            [ScalingType.CON]: 'CON',
            [ScalingType.INT]: 'INT',
            [ScalingType.WIS]: 'WIS',
            [ScalingType.CHA]: 'CHA'
        }
    } satisfies IOptionType<typeof ScalingType>,
    scalingModifier: {
        enum: ScalingModifierType,
        default: ScalingModifierType.Modifier,
        options: {
            [ScalingModifierType.Die]: 'Die',
            [ScalingModifierType.DieCount]: 'Die Count',
            [ScalingModifierType.Modifier]: 'Modifier'
        }
    } satisfies IOptionType<typeof ScalingModifierType>,
    modifierType: {
        enum: ModifierType,
        default: ModifierType.Add,
        options: {
            [ModifierType.Ability]: 'Ability',
            [ModifierType.Add]: 'Add',
            [ModifierType.Bonus]: 'Bonus',
            [ModifierType.Choice]: 'Choice',
            [ModifierType.Remove]: 'Remove',
            [ModifierType.Set]: 'Set',
            [ModifierType.Variable]: 'Variable'
        }
    } satisfies IOptionType<typeof ModifierType>,
    modifierAbilityType: {
        enum: ModifierAbilityType,
        default: ModifierAbilityType.AttackBonus,
        options: {
            [ModifierAbilityType.AttackBonus]: 'Attack Bonus'
        }
    } satisfies IOptionType<typeof ModifierAbilityType>,
    modifierAddType: {
        enum: ModifierAddType,
        default: ModifierAddType.Ability,
        options: {
            [ModifierAddType.Ability]: 'Ability',
            [ModifierAddType.Spell]: 'Spell',
            [ModifierAddType.Advantage]: 'Advantage',
            [ModifierAddType.Disadvantage]: 'Disadvantage',
            [ModifierAddType.Resistance]: 'Resistance',
            [ModifierAddType.Vulnerability]: 'Vulnerability',
            [ModifierAddType.DamageImmunity]: 'Damage Immunity',
            [ModifierAddType.ConditionImmunity]: 'Condition Immunity'
        }
    } satisfies IOptionType<typeof ModifierAddType>,
    modifierBonusType: {
        enum: ModifierBonusType,
        default: ModifierBonusType.AC,
        options: {
            [ModifierBonusType.AC]: 'AC',
            [ModifierBonusType.AllAbilityScores]: 'All Ability Scores',
            [ModifierBonusType.Strength]: 'Strength',
            [ModifierBonusType.Dexterity]: 'Dexterity',
            [ModifierBonusType.Constitution]: 'Constitution',
            [ModifierBonusType.Intelligence]: 'Intelligence',
            [ModifierBonusType.Wisdom]: 'Wisdom',
            [ModifierBonusType.Charisma]: 'Charisma'
        }
    } satisfies IOptionType<typeof ModifierBonusType>,
    modifierSetType: {
        enum: ModifierSetType,
        default: ModifierSetType.SpellAttribute,
        options: {
            [ModifierSetType.SpellAttribute]: 'Spell Attribute',
            [ModifierSetType.Sense]: 'Sense',
            [ModifierSetType.Size]: 'Speed',
            [ModifierSetType.SaveProficiency]: 'Save Proficiency',
            [ModifierSetType.SkillProficiency]: 'Skill Proficiency',
            [ModifierSetType.ToolProficiency]: 'Tool Proficiency',
            [ModifierSetType.LanguageProficiency]: 'Language Proficiency',
            [ModifierSetType.ArmorProficiency]: 'Armor Proficiency',
            [ModifierSetType.WeaponProficiency]: 'Weapon Proficiency'
        }
    } satisfies IOptionType<typeof ModifierSetType>,
    modifierVariableType: {
        enum: ModifierVariableType,
        default: ModifierVariableType.Number,
        options: {
            [ModifierVariableType.Number]: 'Number',
            [ModifierVariableType.Collection]: 'Collection'
        }
    } satisfies IOptionType<typeof ModifierVariableType>,
    operationType: {
        enum: OperationType,
        default: OperationType.Add,
        options: {
            [OperationType.Add]: 'Add',
            [OperationType.Replace]: 'Replace'
        }
    } satisfies IOptionType<typeof OperationType>,
    damageType: {
        enum: DamageType,
        default: DamageType.None,
        options: {
            [DamageType.None]: 'None',
            [DamageType.Special]: 'Special',
            [DamageType.Acid]: 'Acid',
            [DamageType.Bludgeoning]: 'Bludgeoning',
            [DamageType.Cold]: 'Cold',
            [DamageType.Fire]: 'Fire',
            [DamageType.Force]: 'Force',
            [DamageType.Lightning]: 'Lightning',
            [DamageType.Necrotic]: 'Necrotic',
            [DamageType.Piercing]: 'Piercing',
            [DamageType.Poison]: 'Poison',
            [DamageType.Psychic]: 'Psychic',
            [DamageType.Radiant]: 'Radiant',
            [DamageType.Slashing]: 'Slashing',
            [DamageType.Thunder]: 'Thunder',
            [DamageType.Health]: 'Health'
        }
    } satisfies IOptionType<typeof DamageType>,
    action: {
        enum: ActionType,
        default: ActionType.Action,
        options: {
            [ActionType.None]: 'None',
            [ActionType.Action]: 'Action',
            [ActionType.BonusAction]: 'Bonus Action',
            [ActionType.Reaction]: 'Reaction',
            [ActionType.Special]: 'Special',
            [ActionType.Legendary]: 'Legendary'
        }
    } satisfies IOptionType<typeof ActionType>,
    target: {
        enum: TargetType,
        default: TargetType.None,
        options: {
            [TargetType.None]: 'None',
            [TargetType.Self]: 'Self',
            [TargetType.Single]: 'Single',
            [TargetType.Multiple]: 'Multiple',
            [TargetType.Touch]: 'Touch',
            [TargetType.Point]: 'Point',
            [TargetType.Area]: 'Area'
        }
    } satisfies IOptionType<typeof TargetType>,
    magicSchool: {
        enum: MagicSchool,
        default: MagicSchool.Abjuration,
        options: {
            [MagicSchool.Abjuration]: 'Abjuration',
            [MagicSchool.Conjuration]: 'Conjuration',
            [MagicSchool.Divination]: 'Divination',
            [MagicSchool.Dunamancy]: 'Dunamancy',
            [MagicSchool.Enchantment]: 'Enchantment',
            [MagicSchool.Evocation]: 'Evocation',
            [MagicSchool.Illusion]: 'Illusion',
            [MagicSchool.Necromancy]: 'Necromancy',
            [MagicSchool.Transmutation]: 'Transmutation'
        }
    } satisfies IOptionType<typeof MagicSchool>,
    castingTime: {
        enum: CastingTime,
        default: CastingTime.Action,
        options: {
            [CastingTime.Action]: 'Action',
            [CastingTime.BonusAction]: 'Bonus Action',
            [CastingTime.Reaction]: 'Reaction',
            [CastingTime.Minute]: 'Minute',
            [CastingTime.Hour]: 'Hour',
            [CastingTime.Custom]: 'Custom'
        }
    } satisfies IOptionType<typeof CastingTime>,
    duration: {
        enum: Duration,
        default: Duration.Instantaneous,
        options: {
            [Duration.Instantaneous]: 'Instantaneous',
            [Duration.Round]: 'Round',
            [Duration.Minute]: 'Minute',
            [Duration.Hour]: 'Hour',
            [Duration.Day]: 'Day',
            [Duration.Custom]: 'Custom'
        }
    } satisfies IOptionType<typeof Duration>,
    area: {
        enum: AreaType,
        default: AreaType.None,
        options: {
            [AreaType.None]: 'None',
            [AreaType.Cone]: 'Cone',
            [AreaType.Cube]: 'Cube',
            [AreaType.Cuboid]: 'Cuboid',
            [AreaType.Cylinder]: 'Cylinder',
            [AreaType.Line]: 'Line',
            [AreaType.Rectangle]: 'Rectangle',
            [AreaType.Sphere]: 'Sphere',
            [AreaType.Square]: 'Square'
        }
    } satisfies IOptionType<typeof AreaType>,
    armor: {
        enum: ArmorType,
        default: ArmorType.Light,
        options: {
            [ArmorType.Light]: 'Light Armor',
            [ArmorType.Medium]: 'Medium Armor',
            [ArmorType.Heavy]: 'Heavy Armor',
            [ArmorType.Shields]: 'Shields'
        }
    } satisfies IOptionType<typeof ArmorType>,
    weaponType: {
        enum: WeaponType,
        default: WeaponType.Simple,
        options: {
            [WeaponType.Simple]: 'Simple Weapons',
            [WeaponType.Martial]: 'Martial Weapons',
            [WeaponType.Club]: 'Clubs',
            [WeaponType.Battleaxe]: 'Battleaxes',
            [WeaponType.Blowgun]: 'Blowguns',
            [WeaponType.Dagger]: 'Daggers',
            [WeaponType.Dart]: 'Darts',
            [WeaponType.Flail]: 'Flails',
            [WeaponType.Greataxe]: 'Greataxes',
            [WeaponType.Greatclub]: 'Greatclubs',
            [WeaponType.Greatsword]: 'Greatsword',
            [WeaponType.Halberd]: 'Halberds',
            [WeaponType.Handaxe]: 'Handaxes',
            [WeaponType.HandCrossbow]: 'Hand Crossbows',
            [WeaponType.HeavyCrossbow]: 'Heavy Crossbows',
            [WeaponType.Javelin]: 'Javelins',
            [WeaponType.Lance]: 'Lances',
            [WeaponType.LightHammer]: 'Light Hammers',
            [WeaponType.LightCrossbow]: 'Light Crossbows',
            [WeaponType.Longbow]: 'Longbows',
            [WeaponType.Longsword]: 'Longswords',
            [WeaponType.Mace]: 'Maces',
            [WeaponType.Maul]: 'Mauls',
            [WeaponType.Net]: 'Nets',
            [WeaponType.Morningstar]: 'Morningstars',
            [WeaponType.Pike]: 'Pikes',
            [WeaponType.Quarterstaff]: 'Quarterstaffs',
            [WeaponType.Rapier]: 'Rapiers',
            [WeaponType.Scimitar]: 'Scimitars',
            [WeaponType.Shortsword]: 'Shortswords',
            [WeaponType.Shortbow]: 'Shortbows',
            [WeaponType.Sling]: 'Slings',
            [WeaponType.Sickle]: 'Sickles',
            [WeaponType.Spear]: 'Spears',
            [WeaponType.Trident]: 'Tridents',
            [WeaponType.WarPick]: 'War Picks',
            [WeaponType.Warhammer]: 'Warhammers',
            [WeaponType.Whip]: 'Whips',
            [WeaponType.Improvised]: undefined
        }
    } satisfies IOptionType<typeof WeaponType>,
    meleeWeapon: {
        enum: MeleeWeaponType,
        default: MeleeWeaponType.Battleaxe,
        options: {
            [MeleeWeaponType.Battleaxe]: 'Battleaxe',
            [MeleeWeaponType.Club]: 'Club',
            [MeleeWeaponType.Dagger]: 'Dagger',
            [MeleeWeaponType.Dart]: 'Dart',
            [MeleeWeaponType.Flail]: 'Flail',
            [MeleeWeaponType.Greataxe]: 'Greataxe',
            [MeleeWeaponType.Greatclub]: 'Greatclub',
            [MeleeWeaponType.Greatsword]: 'Greatsword',
            [MeleeWeaponType.Halberd]: 'Halberd',
            [MeleeWeaponType.Handaxe]: 'Handaxe',
            [MeleeWeaponType.Javelin]: 'Javelin',
            [MeleeWeaponType.Lance]: 'Lance',
            [MeleeWeaponType.LightHammer]: 'Light Hammer',
            [MeleeWeaponType.Longsword]: 'Longsword',
            [MeleeWeaponType.Mace]: 'Mace',
            [MeleeWeaponType.Maul]: 'Maul',
            [MeleeWeaponType.Morningstar]: 'Morningstar',
            [MeleeWeaponType.Pike]: 'Pike',
            [MeleeWeaponType.Quarterstaff]: 'Quarterstaff',
            [MeleeWeaponType.Rapier]: 'Rapier',
            [MeleeWeaponType.Scimitar]: 'Scimitar',
            [MeleeWeaponType.Shortsword]: 'Shortsword',
            [MeleeWeaponType.Sickle]: 'Sickle',
            [MeleeWeaponType.Spear]: 'Spear',
            [MeleeWeaponType.Trident]: 'Trident',
            [MeleeWeaponType.WarPick]: 'War Pick',
            [MeleeWeaponType.Warhammer]: 'Warhammer',
            [MeleeWeaponType.Whip]: 'Whip',
            [MeleeWeaponType.Improvised]: 'Improvised'
        }
    } satisfies IOptionType<typeof MeleeWeaponType>,
    thrownWeapon: {
        enum: ThrownWeaponType,
        default: ThrownWeaponType.Dagger,
        options: {
            [ThrownWeaponType.Dagger]: 'Dagger',
            [ThrownWeaponType.Dart]: 'Dart',
            [ThrownWeaponType.Handaxe]: 'Handaxe',
            [ThrownWeaponType.Javelin]: 'Javelin',
            [ThrownWeaponType.LightHammer]: 'Light Hammer',
            [ThrownWeaponType.Trident]: 'Trident',
            [ThrownWeaponType.Spear]: 'Spear',
            [ThrownWeaponType.Improvised]: 'Improvised'
        }
    } satisfies IOptionType<typeof ThrownWeaponType>,
    rangedWeapon: {
        enum: RangedWeaponType,
        default: RangedWeaponType.Blowgun,
        options: {
            [RangedWeaponType.Blowgun]: 'Blowgun',
            [RangedWeaponType.HandCrossbow]: 'Hand Crossbow',
            [RangedWeaponType.HeavyCrossbow]: 'Heavy Crossbow',
            [RangedWeaponType.LightCrossbow]: 'Light Crossbow',
            [RangedWeaponType.Longbow]: 'Longbow',
            [RangedWeaponType.Net]: 'Net',
            [RangedWeaponType.Shortbow]: 'Shortbow',
            [RangedWeaponType.Sling]: 'Sling',
            [RangedWeaponType.Improvised]: 'Improvised'
        }
    } satisfies IOptionType<typeof RangedWeaponType>,
    language: {
        enum: Language,
        default: Language.Common,
        options: {
            [Language.Abyssal]: 'Abyssal',
            [Language.Celestial]: 'Celestial',
            [Language.Common]: 'Common',
            [Language.Draconic]: 'Draconic',
            [Language.DeepSpeech]: 'Deep Speech',
            [Language.Dwarvish]: 'Dwarvish',
            [Language.Elvish]: 'Elvish',
            [Language.Giant]: 'Giant',
            [Language.Gnomish]: 'Gnomish',
            [Language.Goblin]: 'Goblin',
            [Language.Halfling]: 'Halfling',
            [Language.Infernal]: 'Infernal',
            [Language.Leonin]: 'Leonin',
            [Language.Orc]: 'Orc',
            [Language.Primordial]: 'Primordial',
            [Language.Sylvan]: 'Sylvan',
            [Language.ThievesCant]: "Thieves' Cant",
            [Language.Undercommon]: 'Undercommon'
        }
    } satisfies IOptionType<typeof Language>,
    sense: {
        enum: Sense,
        default: Sense.DarkVision,
        options: {
            [Sense.BlindSight]: 'Blind Sight',
            [Sense.DarkVision]: 'Dark Vision',
            [Sense.TremorSense]: 'Tremor Sense',
            [Sense.TrueSight]: 'True Sight'
        }
    } satisfies IOptionType<typeof Sense>,
    tool: {
        enum: ToolType,
        default: ToolType.AlchemistsSupplies,
        options: {
            [ToolType.AlchemistsSupplies]: "Alchemist's supplies",
            [ToolType.Bagpipes]: 'Bagpipes',
            [ToolType.BrewersSupplies]: "Brewer's supplies",
            [ToolType.CalligraphersSupplies]: "Calligrapher's supplies",
            [ToolType.CarpentersTools]: "Carpenter's tools",
            [ToolType.CartographersTools]: "Cartographer's tools",
            [ToolType.CobblersTools]: "Cobbler's tools",
            [ToolType.CooksUtensils]: "Cook's utensils",
            [ToolType.DiceSet]: 'Dice set',
            [ToolType.DisguiseKit]: 'Disguise kit',
            [ToolType.Drum]: 'Drum',
            [ToolType.Dulcimer]: 'Dulcimer',
            [ToolType.Flute]: 'Flute',
            [ToolType.ForgeryKit]: 'Forgery kit',
            [ToolType.GlassblowersTools]: "Glassblower's tools",
            [ToolType.HerbalismKit]: 'Herbalism kit',
            [ToolType.Horn]: 'Horn',
            [ToolType.JewelersTools]: "Jeweler's tools",
            [ToolType.LeatherworkersTools]: "Leatherworker's tools",
            [ToolType.Lute]: 'Lute',
            [ToolType.Lyre]: 'Lyre',
            [ToolType.MasonsTools]: "Mason's tools",
            [ToolType.NavigatorsTools]: "Navigator's tools",
            [ToolType.PaintersSupplies]: "Painter's supplies",
            [ToolType.PanFlute]: 'Pan flute',
            [ToolType.PlayingCardSet]: 'Playing card set',
            [ToolType.PoisonersKit]: "Poisoner's kit",
            [ToolType.PottersTools]: "Potter's tools",
            [ToolType.Shawm]: 'Shawm',
            [ToolType.SmithsTools]: "Smith's tools",
            [ToolType.ThievesTools]: "Thieves' Tools",
            [ToolType.TinkersTools]: "Tinker's tools",
            [ToolType.VehiclesLand]: 'Vehicles (land)',
            [ToolType.VehiclesWater]: 'Vehicles (water)',
            [ToolType.Viol]: 'Viol',
            [ToolType.WeaversTools]: "Weaver's tools",
            [ToolType.WoodcarversTools]: "Woodcarver's tools"
        }
    } satisfies IOptionType<typeof ToolType>,
    proficiencyType: {
        enum: ProficiencyType,
        default: ProficiencyType.Armor,
        options: {
            [ProficiencyType.Armor]: 'Armor',
            [ProficiencyType.Weapon]: 'Weapon',
            [ProficiencyType.Tool]: 'Tool',
            [ProficiencyType.Language]: 'Language',
            [ProficiencyType.Save]: 'Save',
            [ProficiencyType.Skill]: 'Skill'
        }
    } satisfies IOptionType<typeof ProficiencyType>,
    proficiencyLevel: {
        enum: ProficiencyLevel,
        default: ProficiencyLevel.Proficient,
        options: {
            [ProficiencyLevel.None]: 'None',
            [ProficiencyLevel.HalfProficient]: 'Half Proficient',
            [ProficiencyLevel.Proficient]: 'Proficient',
            [ProficiencyLevel.Expert]: 'Expert'
        }
    } satisfies IOptionType<typeof ProficiencyLevel>,
    proficiencyLevelBasic: {
        enum: ProficiencyLevelBasic,
        default: ProficiencyLevelBasic.Proficient,
        options: {
            [ProficiencyLevelBasic.None]: 'None',
            [ProficiencyLevelBasic.Proficient]: 'Proficient'
        }
    },
    restType: {
        enum: RestType,
        default: RestType.None,
        options: {
            [RestType.None]: 'None',
            [RestType.ShortRest]: 'Short Rest',
            [RestType.LongRest]: 'Long Rest'
        }
    } satisfies IOptionType<typeof RestType>,
    rarity: {
        enum: Rarity,
        default: Rarity.Mundane,
        options: {
            [Rarity.Mundane]: 'Mundane',
            [Rarity.Common]: 'Common',
            [Rarity.Uncommon]: 'Uncommon',
            [Rarity.Rare]: 'Rare',
            [Rarity.VeryRare]: 'Very Rare',
            [Rarity.Legendary]: 'Legendary',
            [Rarity.Artifact]: 'Artifact'
        }
    } satisfies IOptionType<typeof Rarity>,
    acBase: {
        enum: ArmorClassBase,
        default: ArmorClassBase.DEX,
        options: {
            [ArmorClassBase.DEX]: 'Dexterity',
            [ArmorClassBase.DEXAndAttribute]: 'Dexterity + Attribute',
            [ArmorClassBase.DEXAndFixed]: 'Dexterity + Value'
        }
    } satisfies IOptionType<typeof ArmorClassBase>,
    spellPreparation: {
        enum: SpellPreparationType,
        default: SpellPreparationType.None,
        options: {
            [SpellPreparationType.None]: 'None',
            [SpellPreparationType.AlwaysPrepared]: 'Always Prepared',
            [SpellPreparationType.Prepared]: 'Prepared',
            [SpellPreparationType.Learned]: 'Learned',
            [SpellPreparationType.FreeCantrip]: 'Free Cantrip',
            [SpellPreparationType.Cantrip]: 'Cantrip'
        }
    } satisfies IOptionType<typeof SpellPreparationType>,
    advantageBinding: {
        enum: AdvantageBinding,
        default: AdvantageBinding.Generic,
        options: {
            [AdvantageBinding.Generic]: 'Generic',
            [AdvantageBinding.Saves]: 'Saves',
            [AdvantageBinding.StrengthSave]: 'Strength Save',
            [AdvantageBinding.DexteritySave]: 'Dexterity Save',
            [AdvantageBinding.ConstitutionSave]: 'Constitution Save',
            [AdvantageBinding.IntelligenceSave]: 'Intelligence Save',
            [AdvantageBinding.WisdomSave]: 'Wisdom Save',
            [AdvantageBinding.CharismaSave]: 'Charisma Save',
            [AdvantageBinding.SkillChecks]: 'Skill Checks',
            [AdvantageBinding.AcrobaticsCheck]: 'Acrobatics Check',
            [AdvantageBinding.AnimalHandlingCheck]: 'Animal Handling Check',
            [AdvantageBinding.ArcanaCheck]: 'Arcana Check',
            [AdvantageBinding.AthleticsCheck]: 'Athletics Check',
            [AdvantageBinding.DeceptionCheck]: 'Deception Check',
            [AdvantageBinding.HistoryCheck]: 'History Check',
            [AdvantageBinding.InsightCheck]: 'Insight Check',
            [AdvantageBinding.IntimidationCheck]: 'Intimidation Check',
            [AdvantageBinding.InvestigationCheck]: 'Investigation Check',
            [AdvantageBinding.MedicineCheck]: 'Medicine Check',
            [AdvantageBinding.NatureCheck]: 'Nature Check',
            [AdvantageBinding.PerceptionCheck]: 'Perception Check',
            [AdvantageBinding.PerformanceCheck]: 'Performance Check',
            [AdvantageBinding.PersuasionCheck]: 'Persuasion Check',
            [AdvantageBinding.ReligionCheck]: 'Religion Check',
            [AdvantageBinding.SleightOfHandCheck]: 'Sleight of Hand Check',
            [AdvantageBinding.StealthCheck]: 'Stealth Check',
            [AdvantageBinding.SurvivalCheck]: 'Survival Check'
        }
    } satisfies IOptionType<typeof AdvantageBinding>,
    damageBinding: {
        enum: DamageBinding,
        default: DamageBinding.Generic,
        options: {
            [DamageBinding.Generic]: 'Generic',
            [DamageBinding.Acid]: 'Acid Damage',
            [DamageBinding.Bludgeoning]: 'Bludgeoning Damage',
            [DamageBinding.Cold]: 'Cold Damage',
            [DamageBinding.Fire]: 'Fire Damage',
            [DamageBinding.Force]: 'Force Damage',
            [DamageBinding.Lightning]: 'Lightning Damage',
            [DamageBinding.Necrotic]: 'Necrotic Damage',
            [DamageBinding.Piercing]: 'Piercing Damage',
            [DamageBinding.Poison]: 'Poison Damage',
            [DamageBinding.Psychic]: 'Psychic Damage',
            [DamageBinding.Radiant]: 'Radiant Damage',
            [DamageBinding.Slashing]: 'Slashing Damage',
            [DamageBinding.Thunder]: 'Thunder Damage'
        }
    } satisfies IOptionType<typeof DamageBinding>,
    conditionBinding: {
        enum: ConditionBinding,
        default: ConditionBinding.Generic,
        options: {
            [ConditionBinding.Generic]: 'Generic',
            [ConditionBinding.Charmed]: 'Charmed'
        }
    } satisfies IOptionType<typeof ConditionBinding>,
    viewMode: {
        enum: ViewMode,
        default: ViewMode.SplitView,
        options: {
            [ViewMode.SplitView]: 'Split View',
            [ViewMode.Exclusive]: 'Exclusive'
        }
    } satisfies IOptionType<typeof ViewMode>,
    classLevel: {
        enum: ClassLevel,
        default: ClassLevel.Level1,
        options: {
            [ClassLevel.Level1]: 'Level 1',
            [ClassLevel.Level2]: 'Level 2',
            [ClassLevel.Level3]: 'Level 3',
            [ClassLevel.Level4]: 'Level 4',
            [ClassLevel.Level5]: 'Level 5',
            [ClassLevel.Level6]: 'Level 6',
            [ClassLevel.Level7]: 'Level 7',
            [ClassLevel.Level8]: 'Level 8',
            [ClassLevel.Level9]: 'Level 9',
            [ClassLevel.Level10]: 'Level 10',
            [ClassLevel.Level11]: 'Level 11',
            [ClassLevel.Level12]: 'Level 12',
            [ClassLevel.Level13]: 'Level 13',
            [ClassLevel.Level14]: 'Level 14',
            [ClassLevel.Level15]: 'Level 15',
            [ClassLevel.Level16]: 'Level 16',
            [ClassLevel.Level17]: 'Level 17',
            [ClassLevel.Level18]: 'Level 18',
            [ClassLevel.Level19]: 'Level 19',
            [ClassLevel.Level20]: 'Level 20'
        }
    } satisfies IOptionType<typeof ClassLevel>,
    spellLevel: {
        enum: SpellLevel,
        default: SpellLevel.Cantrip,
        options: {
            [SpellLevel.Cantrip]: 'Cantrip',
            [SpellLevel.Level1]: 'Level 1',
            [SpellLevel.Level2]: 'Level 2',
            [SpellLevel.Level3]: 'Level 3',
            [SpellLevel.Level4]: 'Level 4',
            [SpellLevel.Level5]: 'Level 5',
            [SpellLevel.Level6]: 'Level 6',
            [SpellLevel.Level7]: 'Level 7',
            [SpellLevel.Level8]: 'Level 8',
            [SpellLevel.Level9]: 'Level 9'
        }
    } satisfies IOptionType<typeof SpellLevel>,
    levelModifyType: {
        enum: LevelModifyType,
        default: LevelModifyType.Add,
        options: {
            [LevelModifyType.Add]: 'Add',
            [LevelModifyType.Replace]: 'Replace'
        }
    } satisfies IOptionType<typeof LevelModifyType>
} satisfies Record<string, IOptionType>

export type OptionTypeKey = keyof typeof OptionTypes

export type ExtractOptionType<T> = T extends OptionTypeKey
    ? typeof OptionTypes[T]
    : IOptionType

export function getOptionType<T extends OptionTypeKey> (key: T): ExtractOptionType<T>
export function getOptionType<T extends string>(key: string): ExtractOptionType<T> | null
export function getOptionType<T extends OptionTypeKey> (key: T): T extends OptionTypeKey ? ExtractOptionType<T> : IOptionType | null {
    return OptionTypes[key] as any ?? null
}
