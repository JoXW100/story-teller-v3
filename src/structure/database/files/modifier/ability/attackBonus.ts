import type ModifierDocument from '..'
import ModifierAbilityDataBase, { ModifierAbilityType } from '.'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAbilityAttackBonusData } from 'types/database/files/modifier'

class ModifierAbilityAttackBonusData extends ModifierAbilityDataBase implements IModifierAbilityAttackBonusData {
    public override readonly subtype = ModifierAbilityType.AttackBonus
    public readonly value: number

    public constructor(data: Simplify<IModifierAbilityAttackBonusData>) {
        super(data)
        this.value = asNumber(data.value, ModifierAbilityAttackBonusData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierAbilityAttackBonusData, ModifierAbilityAttackBonusData> = {
        ...ModifierAbilityDataBase.properties,
        subtype: {
            value: ModifierAbilityType.AttackBonus,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.abilityAttackBonus.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return (this.data as ModifierAbilityAttackBonusData).value + value
            }
        })
    }
}

export default ModifierAbilityAttackBonusData
