import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusCritDieCountData } from 'types/database/files/modifier'

class ModifierBonusCritDieCountData extends ModifierBonusDataBase implements IModifierBonusCritDieCountData {
    public readonly subtype = ModifierBonusType.CritDieCount
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusCritDieCountData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusCritDieCountData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusCritDieCountData, ModifierBonusCritDieCountData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.CritDieCount,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.critDieCount.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusCritDieCountData).value
            }
        })
    }
}

export default ModifierBonusCritDieCountData
