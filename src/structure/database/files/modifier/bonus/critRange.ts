import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusCritRangeData } from 'types/database/files/modifier'

class ModifierBonusCritRangeData extends ModifierBonusDataBase implements IModifierBonusCritRangeData {
    public readonly subtype = ModifierBonusType.CritRange
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusCritRangeData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusCritRangeData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusCritRangeData, ModifierBonusCritRangeData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.CritRange,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.critRange.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value - (this.data as ModifierBonusCritRangeData).value
            }
        })
    }
}

export default ModifierBonusCritRangeData
