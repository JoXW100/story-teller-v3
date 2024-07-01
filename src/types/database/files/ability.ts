import type { AbilityType } from 'structure/database/files/ability/common'
import type { ActionType, RestType, TargetType } from 'structure/dnd'
import type { ObjectId } from 'types'
import type { IEffect } from 'types/database/effect'
import type { IEffectCondition } from 'types/database/effectCondition'

export interface IAbilityDataBase {
    readonly name: string
    readonly description: string
    readonly notes: string
    // readonly icon: string
    readonly action: ActionType
    // Charges
    readonly charges: number
    readonly chargesReset: RestType
    // Modifiers
    readonly modifiers: ObjectId[]
}

export interface IAbilityFeatureData extends IAbilityDataBase {
    readonly type: AbilityType.Feature
}

export interface IAbilityAttackData extends IAbilityDataBase {
    readonly type: AbilityType.Attack
    readonly target: TargetType
    readonly condition: IEffectCondition
    readonly range: number
    readonly effects: Record<string, IEffect>
}

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

export type IAbilityData = IAbilityFeatureData | IAbilityAttackData | IAbilityMeleeAttackData | IAbilityRangedAttackData | IAbilityThrownAttackData

export interface IAbilityStorage {

}
