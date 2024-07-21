import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusMultiAttackData } from 'types/database/files/modifier'

class ModifierBonusMultiAttackData extends ModifierBonusDataBase implements IModifierBonusMultiAttackData {
    public readonly subtype = ModifierBonusType.MultiAttack
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusMultiAttackData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusMultiAttackData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusMultiAttackData, ModifierBonusMultiAttackData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.MultiAttack,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.multiAttack.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusMultiAttackData).value
            }
        })
    }
}

export default ModifierBonusMultiAttackData
