import type ModifierDocument from '.'
import { keysOf } from 'utils'
import Condition, { ConditionType } from 'structure/database/condition'
import { Skill, Attribute, type AdvantageBinding, type ConditionBinding, type Language, MovementType, type OptionalAttribute, type ProficiencyLevelBasic, type DamageBinding, Sense, type SizeType, type ProficiencyLevel, type ToolType, type ArmorType, type WeaponTypeValue, type SpellPreparationType } from 'structure/dnd'
import type { ObjectId } from 'types'
import type { IEditorChoiceData } from 'types/database/choice'
import type { ISourceBinding } from 'types/database/files/creature'
import type { IProperties } from 'types/editor'
import type { ModifierData } from './factory'

export interface IModifierEventHandler<T, D = ModifierData> {
    key: string
    data: D
    apply: (value: T, choices: Record<string, unknown>, properties: Partial<IProperties>, variables: Record<string, unknown>) => T
}

export enum SourceType {
    Ability = 'abi',
    Class = 'cla',
    Subclass = 'scl',
    Race = 'rce',
    Subrace = 'src',
    Condition = 'cnd',
    Item = 'ite',
    Modifier = 'mod'
}

export interface ISourceData {
    type: SourceType
    key: string | ObjectId
}

export interface IModifierProperties {
    readonly conditions: Record<string, Condition>
    readonly choices: Record<string, IEditorChoiceData>
    readonly sources: Record<string, ISourceData> // key from value
}

export class ModifierEvent<T> {
    private readonly properties: IModifierProperties
    public readonly subscribers: IModifierEventHandler<T>[] = []

    public constructor(properties: IModifierProperties) {
        this.properties = properties
    }

    public call(value: T, properties: Partial<IProperties>, choices: Record<string, unknown>): T {
        const variables: Record<string, unknown> = {}
        for (const handler of Object.values(this.subscribers)) {
            const cond = this.properties.conditions[handler.key]
            if (handler.data.checkCondition(properties) && (cond === undefined || cond.evaluate(properties, choices))) {
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
    public readonly ritualCaster = new ModifierEvent<boolean>(this.properties)
    public readonly health = new ModifierEvent<number>(this.properties)

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

    public readonly senses: Record<Sense, ModifierEvent<number>> = {
        [Sense.BlindSight]: new ModifierEvent<number>(this.properties),
        [Sense.DarkVision]: new ModifierEvent<number>(this.properties),
        [Sense.TremorSense]: new ModifierEvent<number>(this.properties),
        [Sense.TrueSight]: new ModifierEvent<number>(this.properties)
    }

    public readonly speeds: Record<MovementType, ModifierEvent<number>> = {
        [MovementType.Burrow]: new ModifierEvent<number>(this.properties),
        [MovementType.Climb]: new ModifierEvent<number>(this.properties),
        [MovementType.Fly]: new ModifierEvent<number>(this.properties),
        [MovementType.Hover]: new ModifierEvent<number>(this.properties),
        [MovementType.Swim]: new ModifierEvent<number>(this.properties),
        [MovementType.Walk]: new ModifierEvent<number>(this.properties)
    }

    public readonly multiAttack = new ModifierEvent<number>(this.properties)
    public readonly spellAttack = new ModifierEvent<number>(this.properties)
    public readonly spellSave = new ModifierEvent<number>(this.properties)
    public readonly abilities = new ModifierEvent<Record<string, string | ObjectId>>(this.properties)
    public readonly modifiers = new ModifierEvent<Record<string, ObjectId>>(this.properties)
    public readonly spells = new ModifierEvent<Record<ObjectId, OptionalAttribute>>(this.properties)
    public readonly classSpells = new ModifierEvent<Record<ObjectId, Record<ObjectId, SpellPreparationType>>>(this.properties)
    public readonly advantages = new ModifierEvent<Partial<Record<AdvantageBinding, readonly ISourceBinding[]>>>(this.properties)
    public readonly disadvantages = new ModifierEvent<Partial<Record<AdvantageBinding, readonly ISourceBinding[]>>>(this.properties)
    public readonly resistances = new ModifierEvent<Partial<Record<DamageBinding, readonly ISourceBinding[]>>>(this.properties)
    public readonly vulnerabilities = new ModifierEvent<Partial<Record<DamageBinding, readonly ISourceBinding[]>>>(this.properties)
    public readonly damageImmunities = new ModifierEvent<Partial<Record<DamageBinding, readonly ISourceBinding[]>>>(this.properties)
    public readonly conditionImmunities = new ModifierEvent<Partial<Record<ConditionBinding, readonly ISourceBinding[]>>>(this.properties)
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

    public addSource(key: string, type: SourceType, source: string | ObjectId): void {
        if (!(key in this.properties.sources)) {
            this.properties.sources[key] = { type: type, key: source }
        }
    }

    public findSourceOrigin(key: string): ISourceData | null {
        let source: ISourceData | null = null
        while (key in this.properties.sources) {
            source = this.properties.sources[key]
            key = source.key
        }
        return source
    }

    public findSource(key: string, iterator?: (source: ISourceData) => boolean): ISourceData | null {
        let source: ISourceData | null = null
        while (key in this.properties.sources) {
            source = this.properties.sources[key]
            if (iterator === undefined || iterator(source)) {
                return source
            }
            key = source.key
        }
        return null
    }

    public subscribe(modifier: ModifierDocument, key?: string): void {
        modifier.apply(this, key ?? String(modifier.id))
    }
}

export default Modifier
