import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusDexterityData } from 'types/database/files/modifier'

class ModifierBonusDexterityData extends ModifierBonusDataBase implements IModifierBonusDexterityData {
    public readonly subtype = ModifierBonusType.Dexterity
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusDexterityData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusDexterityData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusDexterityData, ModifierBonusDexterityData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.Dexterity,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.dex.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusDexterityData).value
            }
        })
    }
}

export default ModifierBonusDexterityData
