import type { AdvantageBinding, ArmorClassBase, ArmorType, Attribute, Language, MovementType, ProficiencyLevel, ProficiencyType, Sense, SizeType, Skill, Tool, WeaponType } from '../dnd'
import type { ObjectId } from '..'
import type { ISubPageItemMetadata } from '.'

export enum ModifierBonusTypeProperty {
    AC = 'ac',
    Attribute = 'attribute',
    NumHitDice = 'numHitDice',
    Health = 'health',
    Proficiency = 'proficiency',
    Initiative = 'initiative',
    Damage = 'damage',
    Movement = 'movement'
}

export enum ModifierAddRemoveTypeProperty {
    Proficiency = 'proficiency',
    Ability = 'ability',
    Spell = 'spell',
    Resistance = 'resistance',
    Vulnerability = 'vulnerability',
    DMGImmunity = 'dmgImmunity',
    CONImmunity = 'conImmunity',
    Advantage = 'advantage',
    Disadvantage = 'disadvantage'
}

export enum ModifierSetTypeProperty {
    ACBase = 'acBase',
    CritRange = 'critRange',
    MaxDexBonus = 'maxDexBonus',
    MultiAttack = 'multiAttack',
    SpellAttribute = 'spellAttribute',
    Sense = 'sense',
    Size = 'size',
}

export enum ModifierType {
    Bonus = 'bonus', // Adds/Removes a flat value
    Set = 'set', // Sets value
    Add = 'add', // Adds item to collection
    Remove = 'remove', // Removes item from collection
    Choice = 'choice' // Chose between different modifiers
}

export enum SelectType {
    Value = 'value',
    Choice = 'choice',
}

export enum ModifierCondition {
    None = 'none',
}

export enum ModifierSetMethod {
    Exact = 'exact',
    Max = 'max',
    Min = 'min'
}

interface IModifier extends ISubPageItemMetadata {
    condition?: ModifierCondition
    type?: ModifierType
    select?: SelectType
    bonusProperty?: ModifierBonusTypeProperty
    addRemoveProperty?: ModifierAddRemoveTypeProperty
    setProperty?: ModifierSetTypeProperty

    label?: string
    allowAny?: boolean
    numChoices?: number

    proficiency?: ProficiencyType
    binding?: AdvantageBinding
    proficiencyLevel?: ProficiencyLevel
    acBase?: ArmorClassBase

    // Values
    value?: number
    text?: string
    texts?: string[]
    file?: ObjectId | null
    files?: ObjectId[]
    attribute?: Attribute
    attributes?: Attribute[]
    movement?: MovementType
    armor?: ArmorType
    armors?: ArmorType[]
    weapon?: WeaponType
    weapons?: WeaponType[]
    tool?: Tool
    tools?: Tool[]
    language?: Language
    languages?: Language[]
    sense?: Sense
    save?: Attribute
    saves?: Attribute[]
    skill?: Skill
    skills?: Skill[]
    size?: SizeType
    choices?: IChoice[]
}

interface IChoice extends ISubPageItemMetadata {
    label?: string | null
    modifiers?: IModifier[]
}

export type {
    IModifier,
    IChoice
}
