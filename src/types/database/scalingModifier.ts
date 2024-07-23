import type { DieType } from 'structure/dice'
import type { CalcValue } from 'structure/database'
import type { EffectScaling } from 'structure/database/effect/common'
import type { ScalingModifierType } from 'structure/database/scalingModifier/common'

export interface IScalingModifierBase {
    scaling: EffectScaling
    value: number
}

export interface IDieScalingModifier extends IScalingModifierBase {
    type: ScalingModifierType.Die
    die: DieType
}

export interface IDieCountScalingModifier extends IScalingModifierBase {
    type: ScalingModifierType.DieCount
    dieCount: number
}

export interface IModifierScalingModifier extends IScalingModifierBase {
    type: ScalingModifierType.Modifier
    modifier: CalcValue
}

export type IScalingModifier = IDieScalingModifier | IDieCountScalingModifier | IModifierScalingModifier
