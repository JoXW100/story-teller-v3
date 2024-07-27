import type { IEffect } from '../effect'
import type { DieType } from 'structure/dice'
import type { ArmorType, DamageType, ItemType, MeleeWeaponType, RangedWeaponType, Rarity, ScalingType, ThrownWeaponType, WeaponType } from 'structure/dnd'
import type { ObjectId } from 'types'
import type { IChargesData } from '../charges'

export interface IItemDataBase {
    readonly name: string
    readonly description: string
    readonly content: string
    readonly type: ItemType
    readonly rarity: Rarity
    readonly attunement: boolean
    readonly weight: number
    readonly cost: number
    // Charges
    readonly charges: Record<string, IChargesData>
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
}

export interface IItemWeaponDataBase extends IItemDataBase {
    readonly type: ItemType.Weapon
    readonly subtype: WeaponType
    readonly notes: string
    // Damage
    readonly damageType: DamageType
    readonly damageScaling: Partial<Record<ScalingType, number>>
    readonly damageDie: DieType
    readonly damageDieCount: number
    // Hit
    readonly hitScaling: Partial<Record<ScalingType, number>>
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
