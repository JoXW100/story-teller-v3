import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type Modifier from '../modifier'
import { resolveScaling } from 'utils/calculations'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusAttunementSlotsData } from 'types/database/files/modifier'

class ModifierBonusAttunementSlotsData extends ModifierBonusDataBase implements IModifierBonusAttunementSlotsData {
    public readonly subtype = ModifierBonusType.AttunementSlot

    public static properties: DataPropertyMap<IModifierBonusAttunementSlotsData, ModifierBonusAttunementSlotsData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.AttunementSlot,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        modifier.attunementSlots.subscribe({
            key: key,
            data: this,
            apply: function (value, _, properties): number {
                const modifier = this.data as ModifierBonusAttunementSlotsData
                return value + resolveScaling(modifier.scaling, properties)
            }
        })
    }
}

export default ModifierBonusAttunementSlotsData
