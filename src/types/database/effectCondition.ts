import type { Attribute, ScalingType, Skill } from 'structure/dnd'
import type { EffectConditionType } from 'structure/database/effectCondition'

export interface IEffectConditionBase {
}

export interface IEffectConditionNone {
    type: EffectConditionType.None
}

export interface IEffectConditionHit {
    type: EffectConditionType.Hit
    scaling: Partial<Record<ScalingType, number>>
}

export interface IEffectConditionSave {
    type: EffectConditionType.Save
    attribute: Attribute
    scaling: Partial<Record<ScalingType, number>>
}

export interface IEffectConditionCheck {
    type: EffectConditionType.Check
    skill: Skill
    scaling: Partial<Record<ScalingType, number>>
}

export type IEffectCondition = IEffectConditionNone | IEffectConditionHit |
IEffectConditionSave | IEffectConditionCheck
