import type ModifierDocument from '.'
import type { AdvantageBinding, ConditionBinding, Language, MovementType, OptionalAttribute, ProficiencyLevelBasic, DamageBinding, Sense, SizeType, ProficiencyLevel, ToolType, Skill, Attribute, ArmorType, WeaponType } from 'structure/dnd'
import type { ObjectId } from 'types'
import type { IConditionProperties } from 'types/database/condition'
import type { ISourceBinding } from 'types/database/files/creature'
import { keysOf } from 'utils'

export interface IModifierEventHandler<T> {
    target: ModifierDocument
    apply: (value: T, choices: Record<string, unknown>, flags: Record<string, unknown>) => T
}

export class ModifierEvent<T> {
    public readonly filter = new Set<ObjectId>()
    public readonly subscribers: Record<ObjectId, IModifierEventHandler<T>> = {}

    public call(value: T, data: Partial<IConditionProperties>, choices: Record<string, unknown>): T {
        const flags = {}
        for (const handler of Object.values(this.subscribers)) {
            if (!this.filter.has(handler.target.id) && handler.target.data.checkCondition(data)) {
                value = handler.apply(value, choices, flags)
            }
        }
        return value
    }

    public subscribe(handler: IModifierEventHandler<T>): void {
        this.subscribers[handler.target.id] = handler
    }
}

class Modifier {
    public readonly ac = new ModifierEvent<number>()
    public readonly str = new ModifierEvent<number>()
    public readonly dex = new ModifierEvent<number>()
    public readonly con = new ModifierEvent<number>()
    public readonly int = new ModifierEvent<number>()
    public readonly wis = new ModifierEvent<number>()
    public readonly cha = new ModifierEvent<number>()
    public readonly abilities = new ModifierEvent<Array<string | ObjectId>>()
    public readonly spells = new ModifierEvent<ObjectId[]>()
    public readonly advantages = new ModifierEvent<Partial<Record<AdvantageBinding, readonly ISourceBinding[]>>>()
    public readonly disadvantages = new ModifierEvent<Partial<Record<AdvantageBinding, readonly ISourceBinding[]>>>()
    public readonly resistances = new ModifierEvent<Partial<Record<DamageBinding, readonly ISourceBinding[]>>>()
    public readonly vulnerabilities = new ModifierEvent<Partial<Record<DamageBinding, readonly ISourceBinding[]>>>()
    public readonly damageImmunities = new ModifierEvent<Partial<Record<DamageBinding, readonly ISourceBinding[]>>>()
    public readonly conditionImmunities = new ModifierEvent<Partial<Record<ConditionBinding, readonly ISourceBinding[]>>>()
    public readonly spellAttribute = new ModifierEvent<OptionalAttribute>()
    public readonly senses = new ModifierEvent<Partial<Record<Sense, number>>>()
    public readonly speed = new ModifierEvent<Partial<Record<MovementType, number>>>()
    public readonly size = new ModifierEvent<SizeType>()
    public readonly proficienciesSave = new ModifierEvent<Partial<Record<Attribute, ProficiencyLevel>>>()
    public readonly proficienciesSkill = new ModifierEvent<Partial<Record<Skill, ProficiencyLevel>>>()
    public readonly proficienciesTool = new ModifierEvent<Partial<Record<ToolType, ProficiencyLevel>>>()
    public readonly proficienciesLanguage = new ModifierEvent<Partial<Record<Language, ProficiencyLevelBasic>>>()
    public readonly proficienciesArmor = new ModifierEvent<Partial<Record<ArmorType, ProficiencyLevelBasic>>>()
    public readonly proficienciesWeapon = new ModifierEvent<Partial<Record<WeaponType, ProficiencyLevelBasic>>>()

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
