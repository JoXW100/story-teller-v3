import ItemDataBase from './data'
import { ItemType } from 'structure/dnd'
import type { DataPropertyMap } from 'types/database'
import type { IItemWondrousItemData } from 'types/database/files/item'

class ItemWondrousItemData extends ItemDataBase implements IItemWondrousItemData {
    public override readonly type = ItemType.WondrousItem
    public override readonly equippable = true;

    public static properties: DataPropertyMap<IItemWondrousItemData, ItemWondrousItemData> = {
        ...ItemDataBase.properties,
        type: {
            value: ItemType.WondrousItem,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        }
    }
}

export default ItemWondrousItemData
