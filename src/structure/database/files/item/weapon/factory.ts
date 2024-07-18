import ItemWeaponMeleeData from './melee'
import ItemWeaponRangedData from './ranged'
import ItemWeaponThrownData from './thrown'
import { ItemType, RangedWeaponType, ThrownWeaponType, WeaponType } from 'structure/dnd'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import { isEnum, isRecord } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IItemWeaponData, IItemWeaponMeleeData, IItemWeaponRangedData, IItemWeaponThrownData } from 'types/database/files/item'

export type ItemWeaponData = ItemWeaponMeleeData | ItemWeaponRangedData | ItemWeaponThrownData

const ItemWeaponDataFactory: IDatabaseFactory<IItemWeaponData, ItemWeaponData> = {
    create: function (data: Simplify<IItemWeaponData> = {}): ItemWeaponData {
        if (isEnum(data.subtype, RangedWeaponType)) {
            return new ItemWeaponRangedData(data as IItemWeaponRangedData)
        } else if (isEnum(data.subtype, ThrownWeaponType)) {
            return new ItemWeaponThrownData(data as IItemWeaponThrownData)
        } else {
            return new ItemWeaponMeleeData(data as IItemWeaponMeleeData)
        }
    },
    is: function (data: unknown): data is IItemWeaponData {
        return ItemWeaponDataFactory.validate(data) && hasObjectProperties(data, ItemWeaponDataFactory.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IItemWeaponData> {
        return isRecord(data) && validateObjectProperties(data, ItemWeaponDataFactory.properties(data))
    },
    simplify: function (data: IItemWeaponData): Simplify<IItemWeaponData> {
        return simplifyObjectProperties(data, ItemWeaponDataFactory.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IItemWeaponData, ItemWeaponData> {
        const type = isRecord(data) && isEnum(data.subtype, WeaponType)
            ? data.subtype
            : ItemType.WondrousItem
        if (isEnum(type, RangedWeaponType)) {
            return ItemWeaponRangedData.properties
        } else if (isEnum(type, ThrownWeaponType)) {
            return ItemWeaponThrownData.properties
        } else {
            return ItemWeaponMeleeData.properties
        }
    }
}

export default ItemWeaponDataFactory
