import DamageEffect from './damage'
import TextEffect from './text'
import { EffectType } from './common'
import { isEnum, isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { IEffect } from 'types/database/effect'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import DieEffect from './die'

export type Effect = TextEffect | DamageEffect | DieEffect

export function simplifyEffectRecord(value: Record<string, IEffect>): Record<string, unknown> | null {
    if (Object.keys(value).length === 0) {
        return null
    }

    const result: Record<string, unknown> = {}
    for (const key of Object.keys(value)) {
        result[key] = EffectFactory.simplify(value[key])
    }

    return result
}

export function isInstanceOfEffect(value: unknown): value is Effect {
    return value instanceof TextEffect || value instanceof DamageEffect || value instanceof DieEffect
}

const EffectFactory: IDatabaseFactory<IEffect, Effect> = {
    create: function (data: Simplify<IEffect> = {}): Effect {
        switch (data.type) {
            case EffectType.Damage:
                return new DamageEffect(data)
            case EffectType.Die:
                return new DieEffect(data)
            default:
                return new TextEffect(data as Record<string, unknown>)
        }
    },
    is: function (data: unknown): data is IEffect {
        return EffectFactory.validate(data) && hasObjectProperties(data, EffectFactory.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IEffect> {
        return isRecord(data) && validateObjectProperties(data, EffectFactory.properties(data))
    },
    simplify: function (data: IEffect): Simplify<IEffect> {
        return simplifyObjectProperties(data, EffectFactory.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IEffect, Effect> {
        const type = isRecord(data) && isEnum(data.type, EffectType)
            ? data.type
            : EffectType.Text
        switch (type) {
            case EffectType.Damage:
                return DamageEffect.properties
            case EffectType.Die:
                return DieEffect.properties
            case EffectType.Text:
                return TextEffect.properties
        }
    }
}

export default EffectFactory
