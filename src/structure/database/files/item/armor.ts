import ItemDataBase from './data'
import { isBoolean, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { ArmorType, Attribute, ItemType } from 'structure/dnd'
import { getOptionType } from 'structure/optionData'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IItemArmorData } from 'types/database/files/item'

class ItemArmorData extends ItemDataBase implements IItemArmorData {
    public override readonly type = ItemType.Armor
    public readonly subtype: ArmorType
    public readonly ac: number
    public readonly disadvantageStealth: boolean
    public readonly requirements: Partial<Record<Attribute, number>>

    public constructor(data: Simplify<IItemArmorData>) {
        super(data)
        this.subtype = data.subtype ?? ItemArmorData.properties.subtype.value
        this.ac = data.ac ?? ItemArmorData.properties.ac.value
        this.disadvantageStealth = data.disadvantageStealth ?? ItemArmorData.properties.disadvantageStealth.value
        this.requirements = ItemArmorData.properties.requirements.value
        if (data.requirements !== undefined) {
            for (const attr of keysOf(data.requirements)) {
                const requirement = data.requirements[attr]
                if (requirement !== undefined) {
                    this.requirements[attr] = requirement
                }
            }
        }
    }

    public override get categoryText(): string {
        return getOptionType('armor').options[this.subtype]
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
        },
        requirements: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, Attribute) && isNumber(val)),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        }
    }
}

export default ItemArmorData
