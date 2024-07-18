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

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.ac.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value, _, _p, variables): number {
                const bonus = variables['ac.bonus'] = asNumber(variables['ac.bonus'], 0) + (this.data as ModifierBonusACData).value
                return value + bonus
            }
        })
    }
}

export default ModifierBonusACData
