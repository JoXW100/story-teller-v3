import { ScalingModifierType } from './common'
import DieScalingModifier from './die'
import DieCountScalingModifier from './dieCount'
import ModifierScalingModifier from './modifier'
import { isEnum, isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { IScalingModifier } from 'types/database/scalingModifier'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'

export type ScalingModifier = DieScalingModifier | DieCountScalingModifier | ModifierScalingModifier

export function simplifyScalingModifierRecord(value: Record<string, IScalingModifier>): Record<string, unknown> | null {
    if (Object.keys(value).length === 0) {
        return null
    }

    const result: Record<string, unknown> = {}
    for (const key of Object.keys(value)) {
        result[key] = ScalingModifierFactory.simplify(value[key])
    }

    return result
}

export function isInstanceOfScalingModifier(value: unknown): value is ScalingModifier {
    return value instanceof DieScalingModifier ||
        value instanceof DieCountScalingModifier ||
        value instanceof ModifierScalingModifier
}

const ScalingModifierFactory: IDatabaseFactory<IScalingModifier, ScalingModifier> = {
    create: function (data: Simplify<IScalingModifier>): ScalingModifier {
        switch (data.type) {
            case ScalingModifierType.Die:
                return new DieScalingModifier(data)
            case ScalingModifierType.DieCount:
                return new DieCountScalingModifier(data)
            default:
                return new ModifierScalingModifier(data as Record<string, unknown>)
        }
    },
    is: function (data: unknown): data is IScalingModifier {
        return ScalingModifierFactory.validate(data) && hasObjectProperties(data, ScalingModifierFactory.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IScalingModifier> {
        return isRecord(data) && validateObjectProperties(data, ScalingModifierFactory.properties(data))
    },
    simplify: function (data: IScalingModifier): Simplify<IScalingModifier> {
        return simplifyObjectProperties(data, ScalingModifierFactory.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IScalingModifier, ScalingModifier> {
        const type = isRecord(data) && isEnum(data.type, ScalingModifierType)
            ? data.type
            : ScalingModifierType.Modifier
        switch (type) {
            case ScalingModifierType.Die:
                return DieScalingModifier.properties
            case ScalingModifierType.DieCount:
                return DieCountScalingModifier.properties
            case ScalingModifierType.Modifier:
                return ModifierScalingModifier.properties
        }
    }
}

export default ScalingModifierFactory
