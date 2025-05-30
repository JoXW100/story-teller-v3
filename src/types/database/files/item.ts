import type { IDatabaseFileData, IDatabaseFileStorage } from '..'
import type { IEffect } from '../effect'
import type { IChargesData } from '../charges'
import type { IModifierData } from './modifier'
import type { DieType } from 'structure/dice'
import type { ArmorType, DamageType, ItemType, MeleeWeaponType, RangedWeaponType, Rarity, ScalingType, ThrownWeaponType, ToolType, WeaponType } from 'structure/dnd'

export interface IItemDataBase extends IDatabaseFileData {
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
    readonly modifiers: IModifierData[]
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

export interface IItemToolData extends IItemDataBase {
    readonly type: ItemType.Tool
    readonly subtype: ToolType
}

export interface IItemWeaponDataBase extends IItemDataBase {
    readonly type: ItemType.Weapon
    readonly subtype: WeaponType
    readonly notes: string
    // Damage
    readonly damageType: DamageType
    readonly damageScaling: Partial<Record<ScalingType, number>>
    readonly damageDie: DieType
    readonly damageDieCount: Partial<Record<ScalingType, number>>
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
    readonly rangeLong: number
}

export type IItemWeaponData = IItemWeaponMeleeData | IItemWeaponRangedData | IItemWeaponThrownData

export interface IItemConsumableData extends IItemDataBase {
    readonly type: ItemType.Consumable
}

export interface IItemOtherData extends IItemDataBase {
    readonly type: ItemType.Other
}

export type IItemData = IItemArmorData | IItemToolData | IItemWeaponData |
IItemConsumableData | IItemWondrousItemData | IItemOtherData

export interface IItemStorage extends IDatabaseFileStorage {

}
