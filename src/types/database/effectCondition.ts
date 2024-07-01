import type { ICalcValue } from 'structure/database'
import type { Attribute, ScalingType } from 'structure/dnd'
import type { EffectConditionType } from 'structure/database/effectCondition'

export interface IEffectConditionBase {
}

export interface INoneEffectCondition {
    type: EffectConditionType.None
}

export interface IHitEffectCondition {
    type: EffectConditionType.Hit
    scaling: ScalingType
    proficiency: boolean
    modifier: ICalcValue
}

export interface ISaveEffectCondition {
    type: EffectConditionType.Save
    attribute: Attribute
    scaling: ScalingType
    proficiency: boolean
    modifier: ICalcValue
}

export type IEffectCondition = INoneEffectCondition | IHitEffectCondition | ISaveEffectCondition
