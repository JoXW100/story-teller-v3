import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusWisdomData } from 'types/database/files/modifier'

class ModifierBonusWisdomData extends ModifierBonusDataBase implements IModifierBonusWisdomData {
    public readonly subtype = ModifierBonusType.Wisdom
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusWisdomData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusWisdomData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusWisdomData, ModifierBonusWisdomData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.Wisdom,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.wis.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusWisdomData).value
            }
        })
    }
}

export default ModifierBonusWisdomData
