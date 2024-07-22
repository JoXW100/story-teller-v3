import type { AbilityType } from 'structure/database/files/ability/common'
import type { ActionType, TargetType } from 'structure/dnd'
import type { IChargesData } from '../charges'
import type { IArea } from '../area'
import type { ObjectId } from 'types'
import type { IEffect } from 'types/database/effect'
import type { IEffectCondition, IEffectConditionNone } from 'types/database/effectCondition'

export interface IAbilityDataBase {
    readonly type: AbilityType
    readonly name: string
    readonly description: string
    readonly notes: string
    // readonly icon: string
    readonly action: ActionType
    // Charges
    readonly charges: Record<string, IChargesData>
    // Modifiers
    readonly modifiers: ObjectId[]
}

export interface IAbilityFeatureData extends IAbilityDataBase {
    readonly type: AbilityType.Feature
}

export interface IAbilityCustomData extends IAbilityDataBase {
    readonly type: AbilityType.Custom
    readonly category: string
}

export interface IAbilitySkillData extends IAbilityDataBase {
    readonly type: AbilityType.Skill
    readonly effects: Record<string, IEffect>
}

export interface IAbilityAttackDataBase extends IAbilityDataBase {
    readonly type: AbilityType.Attack
    readonly target: TargetType
    readonly condition: IEffectCondition
    readonly effects: Record<string, IEffect>
}

export interface IAbilityAttackNoneData extends IAbilityAttackDataBase {
    readonly target: TargetType.None
    readonly condition: IEffectConditionNone
}

export interface IAbilityAttackTouchData extends IAbilityAttackDataBase {
    readonly target: TargetType.Touch
}

export interface IAbilityAttackSelfData extends IAbilityAttackDataBase {
    readonly target: TargetType.Self
    readonly area: IArea
}

export interface IAbilityAttackSingleData extends IAbilityAttackDataBase {
    readonly target: TargetType.Single
    readonly range: number
}

export interface IAbilityAttackMultipleData extends IAbilityAttackDataBase {
    readonly target: TargetType.Multiple
    readonly range: number
    readonly count: number
}

export interface IAbilityAttackAreaData extends IAbilityAttackDataBase {
    readonly target: TargetType.Point | TargetType.Area
    readonly range: number
    readonly area: IArea
}

export type IAbilityAttackData = IAbilityAttackNoneData | IAbilityAttackTouchData | IAbilityAttackSelfData |
IAbilityAttackSingleData | IAbilityAttackMultipleData | IAbilityAttackAreaData

export interface IAbilityMeleeAttackData extends IAbilityDataBase {
    readonly type: AbilityType.MeleeAttack | AbilityType.MeleeWeapon
    readonly condition: IEffectCondition
    readonly reach: number
    readonly effects: Record<string, IEffect>
}

export interface IAbilityRangedAttackData extends IAbilityDataBase {
    readonly type: AbilityType.RangedAttack | AbilityType.RangedWeapon
    readonly condition: IEffectCondition
    readonly range: number
    readonly rangeLong: number
    readonly effects: Record<string, IEffect>
}

export interface IAbilityThrownAttackData extends IAbilityDataBase {
    readonly type: AbilityType.ThrownWeapon
    readonly condition: IEffectCondition
    readonly reach: number
    readonly range: number
    readonly rangeLong: number
    readonly effects: Record<string, IEffect>
}

export type IAbilityData = IAbilityFeatureData | IAbilityCustomData |
IAbilityAttackData | IAbilityMeleeAttackData | IAbilityRangedAttackData |
IAbilityThrownAttackData | IAbilitySkillData

export interface IAbilityStorage {

}
