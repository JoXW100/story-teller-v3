import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusAttacksData } from 'types/database/files/modifier'

class ModifierBonusAttacksData extends ModifierBonusDataBase implements IModifierBonusAttacksData {
    public readonly subtype = ModifierBonusType.Attacks
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusAttacksData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusAttacksData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusAttacksData, ModifierBonusAttacksData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.Attacks,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.attacks.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusAttacksData).value
            }
        })
    }
}

export default ModifierBonusAttacksData
