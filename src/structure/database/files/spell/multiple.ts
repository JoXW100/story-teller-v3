import SpellDataBase from './data'
import AbilityMeleeAttackData from '../ability/meleeAttack'
import { isNumber, isRecord } from 'utils'
import { TargetType } from 'structure/dnd'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import EffectFactory, { type Effect, simplifyEffectRecord } from 'structure/database/effect/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISpellMultipleData } from 'types/database/files/spell'

class SpellMultipleData extends SpellDataBase implements ISpellMultipleData {
    public readonly target: TargetType.Multiple
    public readonly range: number
    public readonly count: number
    public readonly condition: EffectCondition
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<ISpellMultipleData>) {
        super(data)
        this.target = data.target ?? SpellMultipleData.properties.target.value
        this.range = data.range ?? SpellMultipleData.properties.range.value
        this.count = data.count ?? SpellMultipleData.properties.count.value
        this.condition = data.condition !== undefined
            ? EffectConditionFactory.create(data.condition)
            : AbilityMeleeAttackData.properties.condition.value
        this.effects = SpellMultipleData.properties.effects.value
        if (isRecord(data.effects)) {
            for (const key of Object.keys(data.effects)) {
                const effect = data.effects[key]
                if (effect !== undefined) {
                    this.effects[key] = EffectFactory.create(effect)
                }
            }
        }
    }

    public override readonly targetIcon = null
    public override get targetText(): string {
        return `${this.count}x ${this.range} ft`
    }

    public static properties: DataPropertyMap<ISpellMultipleData, SpellMultipleData> = {
        ...SpellDataBase.properties,
        target: {
            value: TargetType.Multiple,
            validate: (value) => value === this.properties.target.value,
            simplify: (value) => value
        },
        range: {
            value: 0,
            validate: isNumber
        },
        count: {
            value: 0,
            validate: isNumber
        },
        condition: {
            get value() { return EffectConditionFactory.create({}) },
            validate: EffectConditionFactory.validate,
            simplify: EffectConditionFactory.simplify
        },
        effects: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => key.length > 0 && EffectFactory.validate(value)),
            simplify: simplifyEffectRecord
        }
    }
}

export default SpellMultipleData
