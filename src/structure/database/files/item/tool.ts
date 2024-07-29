import ItemDataBase from './data'
import { isEnum } from 'utils'
import type { TranslationHandler } from 'utils/hooks/localization'
import { ToolType, ItemType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IItemToolData } from 'types/database/files/item'

class ItemToolData extends ItemDataBase implements IItemToolData {
    public override readonly type = ItemType.Tool
    public readonly subtype: ToolType

    public constructor(data: Simplify<IItemToolData>) {
        super(data)
        this.subtype = data.subtype ?? ItemToolData.properties.subtype.value
    }

    public override getCategoryText(translator: TranslationHandler): string {
        return translator(`enum-tool-${this.subtype}`)
    }

    public static properties: DataPropertyMap<IItemToolData, ItemToolData> = {
        ...ItemDataBase.properties,
        type: {
            value: ItemType.Tool,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        subtype: {
            value: ToolType.AlchemistsSupplies,
            validate: (value) => isEnum(value, ToolType)
        }
    }
}

export default ItemToolData
