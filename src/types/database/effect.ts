//  import type { IScalingModifier } from './scalingModifier'
import type { ICondition } from './condition'
import type { DamageType, ScalingType } from 'structure/dnd'
import type { DieType } from 'structure/dice'
import type { EffectCategory, EffectType } from 'structure/database/effect/common'

export interface IEffectBase {
    readonly label: string
    readonly condition: ICondition
}

export interface ITextEffect extends IEffectBase {
    readonly type: EffectType.Text
    readonly text: string
}

export interface IDieEffect extends IEffectBase {
    readonly type: EffectType.Die
    readonly scaling: Partial<Record<ScalingType, number>> // Flat Modifier
    readonly die: DieType
    readonly dieCount: Partial<Record<ScalingType, number>> // Die Count Modifier
}

export interface IDamageEffect extends IEffectBase {
    readonly type: EffectType.Damage
    readonly category: EffectCategory
    readonly damageType: DamageType
    readonly scaling: Partial<Record<ScalingType, number>> // Flat Modifier
    readonly die: DieType
    readonly dieCount: Partial<Record<ScalingType, number>> // Die Count Modifier
}

export type IEffect = ITextEffect | IDieEffect | IDamageEffect
