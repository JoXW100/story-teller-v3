import { isEnum, isNumber } from 'utils'
import { EffectScaling } from 'structure/database/effect/common'
import type { DataPropertyMap } from 'types/database'
import type { IScalingModifierBase } from 'types/database/scalingModifier'

abstract class ScalingModifierBase implements IScalingModifierBase {
    public readonly scaling: EffectScaling
    public readonly value: number

    public constructor(data: Partial<IScalingModifierBase>) {
        this.scaling = data.scaling ?? ScalingModifierBase.properties.scaling.value
        this.value = data.value ?? ScalingModifierBase.properties.value.value
    }

    public static properties: DataPropertyMap<IScalingModifierBase, ScalingModifierBase> = {
        scaling: {
            value: EffectScaling.Level,
            validate: (value) => isEnum(value, EffectScaling)
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }
}

export default ScalingModifierBase
