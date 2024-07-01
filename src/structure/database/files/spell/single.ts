import SpellDataBase from './data'
import AbilityMeleeAttackData from '../ability/meleeAttackData'
import { isNumber, isRecord } from 'utils'
import { TargetType } from 'structure/dnd'
import EffectConditionFactory from 'structure/database/effectCondition/factory'
import EffectFactory, { type Effect, simplifyEffectRecord } from 'structure/database/effect/factory'
import type { EffectCondition } from 'structure/database/effectCondition'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISpellSingleData } from 'types/database/files/spell'

class SpellSingleData extends SpellDataBase implements ISpellSingleData {
    public readonly target: TargetType.Single
    public readonly range: number
    public readonly condition: EffectCondition
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<ISpellSingleData>) {
        super(data)
        this.target = data.target ?? SpellSingleData.properties.target.value
        this.range = data.range ?? SpellSingleData.properties.range.value
        this.condition = data.condition !== undefined
            ? EffectConditionFactory.create(data.condition)
            : AbilityMeleeAttackData.properties.condition.value
        this.effects = SpellSingleData.properties.effects.value
        if (data.effects !== undefined) {
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
        return `${this.range} ft`
    }

    public static properties: DataPropertyMap<ISpellSingleData, SpellSingleData> = {
        ...SpellDataBase.properties,
        target: {
            value: TargetType.Single,
            validate: (value) => value === this.properties.target.value,
            simplify: (value) => value
        },
        range: {
            value: 0,
            validate: isNumber
        },
        condition: {
            get value() { return EffectConditionFactory.create() },
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

export default SpellSingleData
