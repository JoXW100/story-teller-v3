import SpellDataBase from './data'
import AbilityMeleeAttackData from '../ability/meleeAttackData'
import { isRecord } from 'utils'
import { TargetType } from 'structure/dnd'
import EffectConditionFactory from 'structure/database/effectCondition/factory'
import EffectFactory, { type Effect, simplifyEffectRecord } from 'structure/database/effect/factory'
import type { EffectCondition } from 'structure/database/effectCondition'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISpellTouchData } from 'types/database/files/spell'

class SpellTouchData extends SpellDataBase implements ISpellTouchData {
    public readonly target: TargetType.Touch
    public readonly condition: EffectCondition
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<ISpellTouchData>) {
        super(data)
        this.target = data.target ?? SpellTouchData.properties.target.value
        this.condition = data.condition !== undefined
            ? EffectConditionFactory.create(data.condition)
            : AbilityMeleeAttackData.properties.condition.value
        this.effects = SpellTouchData.properties.effects.value
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
    public override readonly targetText = 'Touch'

    public static properties: DataPropertyMap<ISpellTouchData, SpellTouchData> = {
        ...SpellDataBase.properties,
        target: {
            value: TargetType.Touch,
            validate: (value) => value === this.properties.target.value,
            simplify: (value) => value
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

export default SpellTouchData
