import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusStrengthData } from 'types/database/files/modifier'

class ModifierBonusStrengthData extends ModifierBonusDataBase implements IModifierBonusStrengthData {
    public readonly subtype = ModifierBonusType.Strength
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusStrengthData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusStrengthData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusStrengthData, ModifierBonusStrengthData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.Strength,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public apply(data: Modifier, self: ModifierDocument): void {
        data.str.subscribe({
            target: self,
            apply: function (value): number {
                return value + (self.data as ModifierBonusStrengthData).value
            }
        })
    }
}

export default ModifierBonusStrengthData
