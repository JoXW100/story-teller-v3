import EffectConditionNone from 'structure/database/effectCondition/none'
import SpellDataBase from './data'
import { isRecord } from 'utils'
import { TargetType } from 'structure/dnd'
import EffectFactory, { type Effect, simplifyEffectRecord } from 'structure/database/effect/factory'
import ConditionFactory from 'structure/database/condition/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISpellNoneData } from 'types/database/files/spell'

class SpellNoneData extends SpellDataBase implements ISpellNoneData {
    public readonly target: TargetType.None
    public readonly condition: EffectConditionNone
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<ISpellNoneData>) {
        super(data)
        this.target = data.target ?? SpellNoneData.properties.target.value
        this.condition = data.condition !== undefined
            ? new EffectConditionNone(data.condition)
            : SpellNoneData.properties.condition.value
        this.effects = SpellNoneData.properties.effects.value
        if (data.effects !== undefined) {
            for (const key of Object.keys(data.effects)) {
                const effect = data.effects[key]
                if (effect !== undefined) {
                    this.effects[key] = EffectFactory.create(effect)
                }
            }
        }
    }

    public override readonly targetText = '-'
    public override readonly targetIcon = null

    public static override properties: DataPropertyMap<ISpellNoneData, SpellNoneData> = {
        ...SpellDataBase.properties,
        target: {
            value: TargetType.None,
            validate: (value) => value === this.properties.target.value,
            simplify: (value) => value
        },
        condition: {
            get value() { return new EffectConditionNone({}) },
            validate: ConditionFactory.validate,
            simplify: () => null
        },
        effects: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => key.length > 0 && EffectFactory.validate(value)),
            simplify: simplifyEffectRecord
        }
    }
}

export default SpellNoneData
