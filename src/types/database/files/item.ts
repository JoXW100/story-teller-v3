import type { IEffect } from '../effect'
import type { ICalcValue } from 'structure/database'
import type { DieType } from 'structure/dice'
import type { ArmorType, Attribute, DamageType, ItemType, MeleeWeaponType, RangedWeaponType, Rarity, RestType, ScalingType, ThrownWeaponType, WeaponType } from 'structure/dnd'
import type { ObjectId } from 'types'

export interface IItemDataBase {
    readonly name: string
    readonly description: string
    readonly type: ItemType
    readonly rarity: Rarity
    readonly attunement: boolean
    readonly weight: number
    readonly cost: number
    // Charges
    readonly charges: number
    readonly chargesReset: RestType
    // Modifiers
    readonly modifiers: ObjectId[]
}

export interface IItemWondrousItemData extends IItemDataBase {
    readonly type: ItemType.WondrousItem
}

export interface IItemArmorData extends IItemDataBase {
    readonly type: ItemType.Armor
    readonly subtype: ArmorType
    readonly ac: number
    readonly disadvantageStealth: boolean
    readonly requirements: Partial<Record<Attribute, number>>
}

export interface IItemWeaponDataBase extends IItemDataBase {
    readonly type: ItemType.Weapon
    readonly subtype: WeaponType
    readonly notes: string
    // Damage
    readonly damageType: DamageType
    readonly damageScaling: ScalingType
    readonly damageProficiency: boolean
    readonly damageDie: DieType
    readonly damageDieCount: number
    readonly damageModifier: ICalcValue
    // Hit
    readonly hitScaling: ScalingType
    readonly hitProficiency: boolean
    readonly hitModifier: ICalcValue
    // Other
    readonly effects: Record<string, IEffect>
}

export interface IItemWeaponMeleeData extends IItemWeaponDataBase {
    readonly type: ItemType.Weapon
    readonly subtype: MeleeWeaponType
    readonly reach: number
}

export interface IItemWeaponRangedData extends IItemWeaponDataBase {
    readonly type: ItemType.Weapon
    readonly subtype: RangedWeaponType
    readonly range: number
    readonly rangeLong: number
}

export interface IItemWeaponThrownData extends IItemWeaponDataBase {
    readonly type: ItemType.Weapon
    readonly subtype: ThrownWeaponType
    readonly reach: number
    readonly range: number
}

export type IItemWeaponData = IItemWeaponMeleeData | IItemWeaponRangedData | IItemWeaponThrownData

export interface IItemConsumableData extends IItemDataBase {
    readonly type: ItemType.Consumable
}

export interface IItemOtherData extends IItemDataBase {
    readonly type: ItemType.Other
}

export type IItemData = IItemArmorData | IItemWeaponData | IItemConsumableData |
IItemWondrousItemData | IItemOtherData

export interface IItemStorage {

}
