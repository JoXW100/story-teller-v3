import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusCharismaData } from 'types/database/files/modifier'

class ModifierBonusCharismaData extends ModifierBonusDataBase implements IModifierBonusCharismaData {
    public readonly subtype = ModifierBonusType.Charisma
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusCharismaData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusCharismaData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusCharismaData, ModifierBonusCharismaData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.Charisma,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.cha.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusCharismaData).value
            }
        })
    }
}

export default ModifierBonusCharismaData
