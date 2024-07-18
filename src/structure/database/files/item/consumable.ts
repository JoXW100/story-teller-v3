import ItemDataBase from './data'
import { ItemType } from 'structure/dnd'
import type { DataPropertyMap } from 'types/database'
import type { IItemConsumableData } from 'types/database/files/item'

class ItemConsumableData extends ItemDataBase implements IItemConsumableData {
    public override readonly type = ItemType.Consumable

    public static properties: DataPropertyMap<IItemConsumableData, ItemConsumableData> = {
        ...ItemDataBase.properties,
        type: {
            value: ItemType.Consumable,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        }
    }
}

export default ItemConsumableData
