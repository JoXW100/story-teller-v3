import type ModifierDocument from '.'
import { keysOf } from 'utils'
import Condition, { ConditionType } from 'structure/database/condition'
import { Skill, Attribute } from 'structure/dnd'
import type { AdvantageBinding, ConditionBinding, Language, MovementType, OptionalAttribute, ProficiencyLevelBasic, DamageBinding, Sense, SizeType, ProficiencyLevel, ToolType, ArmorType, WeaponTypeValue } from 'structure/dnd'
import type { ObjectId } from 'types'
import type { IEditorChoiceData } from 'types/database/choice'
import type { IConditionProperties } from 'types/database/condition'
import type { ISourceBinding } from 'types/database/files/creature'
import type { ModifierData } from './factory'

export interface IModifierEventHandler<T, D = ModifierData> {
    key: string
    target: ModifierDocument
    data: D
    apply: (value: T, choices: Record<string, unknown>, properties: Partial<IConditionProperties>, variables: Record<string, unknown>) => T
}

export enum ModifierSourceType {
    Ability = 'abi',
    Class = 'cla',
    SubClass = 'scl',
    Race = 'rce',
    Item = 'ite',
    Modifier = 'mod'
}

export interface IModifierSourceData {
    type: ModifierSourceType
    key: string
}

export interface IModifierProperties {
    readonly conditions: Record<string, Condition>
    readonly choices: Record<string, IEditorChoiceData>
    readonly sources: Record<string, IModifierSourceData> // key from value
}

export class ModifierEvent<T> {
    private readonly properties: IModifierProperties
    public readonly subscribers: Array<IModifierEventHandler<T>> = []

    public constructor(properties: IModifierProperties) {
        this.properties = properties
    }

    public call(value: T, properties: Partial<IConditionProperties>, choices: Record<string, unknown>): T {
        const variables: Record<string, unknown> = {}
        for (const handler of Object.values(this.subscribers)) {
            const cond = this.properties.conditions[handler.key]
            if (handler.target.data.checkCondition(properties) && (cond === undefined || cond.evaluate(properties, choices))) {
                value = handler.apply(value, choices, properties, variables)
            }
        }
        return value
    }

    public subscribe(handler: IModifierEventHandler<T>): void {
        this.subscribers.push(handler)
    }
}

class Modifier {
    public readonly properties: IModifierProperties = {
        conditions: {},
        choices: {},
        sources: {}
    }

    public readonly variables = new ModifierEvent<Record<string, string>>(this.properties)
    public readonly abilityAttackBonus = new ModifierEvent<number>(this.properties)
    public readonly abilityRangedWeaponAttackBonus = new ModifierEvent<number>(this.properties)
    public readonly abilityMeleeWeaponAttackBonus = new ModifierEvent<number>(this.properties)
    public readonly abilityThrownWeaponAttackBonus = new ModifierEvent<number>(this.properties)
    public readonly abilityDamageBonus = new ModifierEvent<number>(this.properties)
    public readonly abilityRangedWeaponDamageBonus = new ModifierEvent<number>(this.properties)
    public readonly abilityMeleeWeaponDamageBonus = new ModifierEvent<number>(this.properties)
    public readonly abilityThrownWeaponDamageBonus = new ModifierEvent<number>(this.properties)
    public readonly abilityChargesBonus = new ModifierEvent<number>(this.properties)
    public readonly ac = new ModifierEvent<number>(this.properties)
    public readonly abilityScores: Record<Attribute, ModifierEvent<number>> = {
        [Attribute.STR]: new ModifierEvent<number>(this.properties),
        [Attribute.DEX]: new ModifierEvent<number>(this.properties),
        [Attribute.CON]: new ModifierEvent<number>(this.properties),
        [Attribute.INT]: new ModifierEvent<number>(this.properties),
        [Attribute.WIS]: new ModifierEvent<number>(this.properties),
        [Attribute.CHA]: new ModifierEvent<number>(this.properties)
    }

    public readonly saves: Record<Attribute, ModifierEvent<number>> = {
        [Attribute.STR]: new ModifierEvent<number>(this.properties),
        [Attribute.DEX]: new ModifierEvent<number>(this.properties),
        [Attribute.CON]: new ModifierEvent<number>(this.properties),
        [Attribute.INT]: new ModifierEvent<number>(this.properties),
        [Attribute.WIS]: new ModifierEvent<number>(this.properties),
        [Attribute.CHA]: new ModifierEvent<number>(this.properties)
    }

    public readonly skills: Record<Skill, ModifierEvent<number>> = {
        [Skill.Acrobatics]: new ModifierEvent<number>(this.properties),
        [Skill.AnimalHandling]: new ModifierEvent<number>(this.properties),
        [Skill.Arcana]: new ModifierEvent<number>(this.properties),
        [Skill.Athletics]: new ModifierEvent<number>(this.properties),
        [Skill.Deception]: new ModifierEvent<number>(this.properties),
        [Skill.History]: new ModifierEvent<number>(this.properties),
        [Skill.Insight]: new ModifierEvent<number>(this.properties),
        [Skill.Intimidation]: new ModifierEvent<number>(this.properties),
        [Skill.Investigation]: new ModifierEvent<number>(this.properties),
        [Skill.Medicine]: new ModifierEvent<number>(this.properties),
        [Skill.Nature]: new ModifierEvent<number>(this.properties),
        [Skill.Perception]: new ModifierEvent<number>(this.properties),
        [Skill.Performance]: new ModifierEvent<number>(this.properties),
        [Skill.Persuasion]: new ModifierEvent<number>(this.properties),
        [Skill.Religion]: new ModifierEvent<number>(this.properties),
        [Skill.SleightOfHand]: new ModifierEvent<number>(this.properties),
        [Skill.Stealth]: new ModifierEvent<number>(this.properties),
        [Skill.Survival]: new ModifierEvent<number>(this.properties)
    }

    public readonly multiAttack = new ModifierEvent<number>(this.properties)
    public readonly spellAttack = new ModifierEvent<number>(this.properties)
    public readonly spellSave = new ModifierEvent<number>(this.properties)
    public readonly abilities = new ModifierEvent<Array<string | ObjectId>>(this.properties)
    public readonly modifiers = new ModifierEvent<Record<string, ObjectId>>(this.properties)
    public readonly spells = new ModifierEvent<ObjectId[]>(this.properties)
    public readonly advantages = new ModifierEvent<Partial<Record<AdvantageBinding, readonly ISourceBinding[]>>>(this.properties)
    public readonly disadvantages = new ModifierEvent<Partial<Record<AdvantageBinding, readonly ISourceBinding[]>>>(this.properties)
    public readonly resistances = new ModifierEvent<Partial<Record<DamageBinding, readonly ISourceBinding[]>>>(this.properties)
    public readonly vulnerabilities = new ModifierEvent<Partial<Record<DamageBinding, readonly ISourceBinding[]>>>(this.properties)
    public readonly damageImmunities = new ModifierEvent<Partial<Record<DamageBinding, readonly ISourceBinding[]>>>(this.properties)
    public readonly conditionImmunities = new ModifierEvent<Partial<Record<ConditionBinding, readonly ISourceBinding[]>>>(this.properties)
    public readonly spellAttribute = new ModifierEvent<OptionalAttribute>(this.properties)
    public readonly senses = new ModifierEvent<Partial<Record<Sense, number>>>(this.properties)
    public readonly speed = new ModifierEvent<Partial<Record<MovementType, number>>>(this.properties)
    public readonly size = new ModifierEvent<SizeType>(this.properties)
    public readonly proficienciesSave = new ModifierEvent<Partial<Record<Attribute, ProficiencyLevel>>>(this.properties)
    public readonly proficienciesSkill = new ModifierEvent<Partial<Record<Skill, ProficiencyLevel>>>(this.properties)
    public readonly proficienciesTool = new ModifierEvent<Partial<Record<ToolType, ProficiencyLevel>>>(this.properties)
    public readonly proficienciesLanguage = new ModifierEvent<Partial<Record<Language, ProficiencyLevelBasic>>>(this.properties)
    public readonly proficienciesArmor = new ModifierEvent<Partial<Record<ArmorType, ProficiencyLevelBasic>>>(this.properties)
    public readonly proficienciesWeapon = new ModifierEvent<Partial<Record<WeaponTypeValue, ProficiencyLevelBasic>>>(this.properties)
    public readonly critRange = new ModifierEvent<number>(this.properties)
    public readonly critDieCount = new ModifierEvent<number>(this.properties)
    public readonly attunementSlots = new ModifierEvent<number>(this.properties)

    public getAllEvents(): Record<keyof Modifier, ModifierEvent<unknown>> {
        const events: Record<keyof Modifier, ModifierEvent<unknown>> = {} as any
        for (const field of keysOf(this)) {
            const value = this[field]
            if (value instanceof ModifierEvent) {
                events[field] = value as ModifierEvent<unknown>
            }
        }
        return events
    }

    public addCondition(condition: Condition, key: string): void {
        if (key in this.properties.conditions) {
            this.properties.conditions[key] = new Condition({ type: ConditionType.And, value: [condition, this.properties.conditions[key]] })
        } else {
            this.properties.conditions[key] = condition
        }
    }

    public addChoice(choice: IEditorChoiceData, key: string): void {
        this.properties.choices[key] = choice
    }

    public addSource(key: string, type: ModifierSourceType, source: string): void {
        if (!(key in this.properties.sources)) {
            this.properties.sources[key] = { type: type, key: source }
        }
    }

    public subscribe(modifier: ModifierDocument, key?: string): void {
        modifier.apply(this, key ?? String(modifier.id))
    }
}

export default Modifier
