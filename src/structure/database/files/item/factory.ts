import ItemWondrousItemData from './wondrous'
import ItemArmorData from './armor'
import ItemWeaponDataFactory, { type ItemWeaponData } from './weapon/factory'
import ItemConsumableData from './consumable'
import ItemOtherData from './other'
import { ItemType } from 'structure/dnd'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import { isEnum, isRecord } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IItemWondrousItemData, IItemData } from 'types/database/files/item'
import ItemToolData from './tool'

export type ItemData = ItemWondrousItemData | ItemArmorData | ItemToolData |
ItemWeaponData | ItemConsumableData | ItemOtherData

const ItemDataFactory: IDatabaseFactory<IItemData, ItemData> = {
    create: function (data: Simplify<IItemData> = {}): ItemData {
        switch (data.type) {
            case ItemType.Armor:
                return new ItemArmorData(data)
            case ItemType.Tool:
                return new ItemToolData(data)
            case ItemType.Weapon:
                return ItemWeaponDataFactory.create(data)
            default:
                return new ItemWondrousItemData(data as IItemWondrousItemData)
        }
    },
    is: function (data: unknown): data is IItemData {
        return ItemDataFactory.validate(data) && hasObjectProperties(data, ItemDataFactory.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IItemData> {
        return isRecord(data) && validateObjectProperties(data, ItemDataFactory.properties(data))
    },
    simplify: function (data: IItemData): Simplify<IItemData> {
        return simplifyObjectProperties(data, ItemDataFactory.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IItemData, ItemData> {
        const type = isRecord(data) && isEnum(data.type, ItemType)
            ? data.type
            : ItemType.WondrousItem
        switch (type) {
            case ItemType.WondrousItem:
                return ItemWondrousItemData.properties
            case ItemType.Armor:
                return ItemArmorData.properties
            case ItemType.Tool:
                return ItemToolData.properties
            case ItemType.Weapon:
                return ItemWeaponDataFactory.properties(data)
            case ItemType.Consumable:
                return ItemConsumableData.properties
            case ItemType.Other:
                return ItemOtherData.properties
        }
    }
}

export default ItemDataFactory
