import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusACData } from 'types/database/files/modifier'

class ModifierBonusACData extends ModifierBonusDataBase implements IModifierBonusACData {
    public readonly subtype = ModifierBonusType.AC
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusACData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusACData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusACData, ModifierBonusACData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.AC,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public apply(data: Modifier, self: ModifierDocument): void {
        data.ac.subscribe({
            target: self,
            apply: function (value): number {
                return value + (self.data as ModifierBonusACData).value
            }
        })
    }
}

export default ModifierBonusACData
