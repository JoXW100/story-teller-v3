import ItemDataBase from './data'
import { isBoolean, isEnum, isNumber } from 'utils'
import { ArmorType, ItemType } from 'structure/dnd'
import { getOptionType } from 'structure/optionData'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IItemArmorData } from 'types/database/files/item'

class ItemArmorData extends ItemDataBase implements IItemArmorData {
    public override readonly type = ItemType.Armor
    public readonly subtype: ArmorType
    public readonly ac: number
    public readonly disadvantageStealth: boolean

    public constructor(data: Simplify<IItemArmorData>) {
        super(data)
        this.subtype = data.subtype ?? ItemArmorData.properties.subtype.value
        this.ac = data.ac ?? ItemArmorData.properties.ac.value
        this.disadvantageStealth = data.disadvantageStealth ?? ItemArmorData.properties.disadvantageStealth.value
    }

    public override get categoryText(): string {
        return getOptionType('armor').options[this.subtype]
    }

    public override get equippable(): boolean {
        return true
    }

    public static properties: DataPropertyMap<IItemArmorData, ItemArmorData> = {
        ...ItemDataBase.properties,
        type: {
            value: ItemType.Armor,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        subtype: {
            value: ArmorType.Light,
            validate: (value) => isEnum(value, ArmorType)
        },
        ac: {
            value: 0,
            validate: isNumber
        },
        disadvantageStealth: {
            value: false,
            validate: isBoolean
        }
    }
}

export default ItemArmorData
