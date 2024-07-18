//  import type { IScalingModifier } from './scalingModifier'
import type { ICondition } from './condition'
import type { DamageType, ScalingType } from 'structure/dnd'
import type { DieType } from 'structure/dice'
import type { ICalcValue } from 'structure/database'
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
    readonly scaling: ScalingType
    readonly proficiency: boolean
    readonly die: DieType
    readonly dieCount: number
    readonly modifier: ICalcValue
}

export interface IDamageEffect extends IEffectBase {
    readonly type: EffectType.Damage
    readonly category: EffectCategory
    readonly damageType: DamageType
    readonly scaling: ScalingType
    readonly proficiency: boolean
    readonly die: DieType
    readonly dieCount: number
    readonly modifier: ICalcValue
}

export type IEffect = ITextEffect | IDieEffect | IDamageEffect
