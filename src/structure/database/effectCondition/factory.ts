import { EffectConditionType } from '.'
import EffectConditionNone from './none'
import EffectConditionHit from './hit'
import EffectConditionSave from './save'
import EffectConditionCheck from './check'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import { isEnum, isRecord } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IEffectCondition } from 'types/database/effectCondition'

export type EffectCondition = EffectConditionNone | EffectConditionHit | EffectConditionSave | EffectConditionCheck

const EffectConditionFactory: IDatabaseFactory<IEffectCondition, EffectCondition> = {
    create: function (data: Simplify<IEffectCondition> = {}): EffectCondition {
        switch (data.type) {
            case EffectConditionType.Hit:
                return new EffectConditionHit(data)
            case EffectConditionType.Save:
                return new EffectConditionSave(data)
            case EffectConditionType.Check:
                return new EffectConditionCheck(data)
            default:
                return new EffectConditionNone(data as Record<string, unknown>)
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
                return EffectConditionHit.properties
            case EffectConditionType.Save:
                return EffectConditionSave.properties
            case EffectConditionType.Check:
                return EffectConditionCheck.properties
            case EffectConditionType.None:
                return EffectConditionNone.properties
        }
    }
}

export default EffectConditionFactory
