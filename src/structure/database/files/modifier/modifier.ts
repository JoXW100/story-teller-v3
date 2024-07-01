import type ModifierDocument from '.'
import type { AdvantageBinding, ConditionBinding, Language, MovementType, OptionalAttribute, ProficiencyLevelBasic, DamageBinding, Sense, SizeType, ProficiencyLevel, ToolType, Skill, Attribute, ArmorType, WeaponType } from 'structure/dnd'
import type { ObjectId } from 'types'
import type { IConditionProperties } from 'types/database/condition'
import type { ISourceBinding } from 'types/database/files/creature'
import { keysOf } from 'utils'

export interface IModifierEventHandler<T> {
    target: ModifierDocument
    apply: (value: T, choices: Record<ObjectId, unknown>, variables: Record<string, unknown>) => T
}

export class ModifierEvent<T> {
    private readonly properties: IModifierProperties
    public readonly subscribers: Record<ObjectId, IModifierEventHandler<T>> = {}

    public constructor(properties: IModifierProperties) {
        this.properties = properties
    }

    public call(value: T, data: Partial<IConditionProperties>, choices: Record<ObjectId, unknown>): T {
        const variables: Record<string, unknown> = {}
        for (const handler of Object.values(this.subscribers)) {
            if (!this.properties.filter.has(handler.target.id) && handler.target.data.checkCondition(data)) {
                value = handler.apply(value, choices, variables)
            }
        }
        return value
    }

    public subscribe(handler: IModifierEventHandler<T>): void {
        this.subscribers[handler.target.id] = handler
    }
}

export interface IModifierProperties {
    readonly filter: Set<ObjectId>
}

class Modifier {
    public readonly properties: IModifierProperties = {
        filter: new Set<ObjectId>()
    }

    public readonly variables = new ModifierEvent<Record<string, unknown>>(this.properties)
    public readonly ac = new ModifierEvent<number>(this.properties)
    public readonly str = new ModifierEvent<number>(this.properties)
    public readonly dex = new ModifierEvent<number>(this.properties)
    public readonly con = new ModifierEvent<number>(this.properties)
    public readonly int = new ModifierEvent<number>(this.properties)
    public readonly wis = new ModifierEvent<number>(this.properties)
    public readonly cha = new ModifierEvent<number>(this.properties)
    public readonly abilities = new ModifierEvent<Array<string | ObjectId>>(this.properties)
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
    public readonly proficienciesWeapon = new ModifierEvent<Partial<Record<WeaponType, ProficiencyLevelBasic>>>(this.properties)

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

    public getAllModifiers(): Record<ObjectId, ModifierDocument> {
        const modifiers: Record<ObjectId, ModifierDocument> = {}
        for (const event of Object.values(this.getAllEvents())) {
            for (const id of keysOf(event.subscribers)) {
                modifiers[id] = event.subscribers[id].target
            }
        }
        return modifiers
    }

    public subscribe(modifier: ModifierDocument): void {
        modifier.apply(this)
    }
}

export default Modifier
