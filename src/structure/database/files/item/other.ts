import ItemDataBase from './data'
import { ItemType } from 'structure/dnd'
import type { DataPropertyMap } from 'types/database'
import type { IItemOtherData } from 'types/database/files/item'

class ItemOtherData extends ItemDataBase implements IItemOtherData {
    public override readonly type = ItemType.Other

    public static properties: DataPropertyMap<IItemOtherData, ItemOtherData> = {
        ...ItemDataBase.properties,
        type: {
            value: ItemType.Other,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        }
    }
}

export default ItemOtherData
