import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusConstitutionData } from 'types/database/files/modifier'

class ModifierBonusConstitutionData extends ModifierBonusDataBase implements IModifierBonusConstitutionData {
    public readonly subtype = ModifierBonusType.Constitution
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusConstitutionData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusConstitutionData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusConstitutionData, ModifierBonusConstitutionData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.Constitution,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.con.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusConstitutionData).value
            }
        })
    }
}

export default ModifierBonusConstitutionData
