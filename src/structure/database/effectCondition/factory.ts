import { type EffectCondition, EffectConditionType } from '.'
import NoneEffectCondition from './none'
import HitEffectCondition from './hit'
import SaveEffectCondition from './save'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import { isEnum, isRecord } from 'utils'
import type { Simplify } from 'types'
import type { IEffectCondition } from 'types/database/effectCondition'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'

const EffectConditionFactory: IDatabaseFactory<IEffectCondition, EffectCondition> = {
    create: function (data: Simplify<IEffectCondition> = {}): EffectCondition {
        switch (data.type) {
            case EffectConditionType.Hit:
                return new HitEffectCondition(data)
            case EffectConditionType.Save:
                return new SaveEffectCondition(data)
            default:
                return new NoneEffectCondition(data as Record<string, unknown>)
        }
    },
    is: function (data: unknown): data is IEffectCondition {
        return this.validate(data) && hasObjectProperties(data, EffectConditionFactory.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IEffectCondition> {
        return isRecord(data) && validateObjectProperties(data, EffectConditionFactory.properties(data))
    },
    simplify: function (data: IEffectCondition): Simplify<IEffectCondition> {
        return simplifyObjectProperties(data, EffectConditionFactory.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IEffectCondition, EffectCondition> {
        const type = isRecord(data) && isEnum(data.type, EffectConditionType)
            ? data.type
            : EffectConditionType.None
        switch (type) {
            case EffectConditionType.Hit:
                return HitEffectCondition.properties
            case EffectConditionType.Save:
                return SaveEffectCondition.properties
            case EffectConditionType.None:
                return NoneEffectCondition.properties
        }
    }
}

export default EffectConditionFactory
