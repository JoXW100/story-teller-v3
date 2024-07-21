import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusAttunementSlotsData } from 'types/database/files/modifier'

class ModifierBonusAttunementSlotsData extends ModifierBonusDataBase implements IModifierBonusAttunementSlotsData {
    public readonly subtype = ModifierBonusType.AttunementSlot
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusAttunementSlotsData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusAttunementSlotsData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusAttunementSlotsData, ModifierBonusAttunementSlotsData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.AttunementSlot,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.attunementSlots.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusAttunementSlotsData).value
            }
        })
    }
}

export default ModifierBonusAttunementSlotsData
