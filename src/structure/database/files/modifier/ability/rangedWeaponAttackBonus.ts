import type ModifierDocument from '..'
import ModifierAbilityDataBase, { ModifierAbilityType } from '.'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAbilityRangedWeaponAttackBonusData } from 'types/database/files/modifier'

class ModifierAbilityRangedWeaponAttackBonusData extends ModifierAbilityDataBase implements IModifierAbilityRangedWeaponAttackBonusData {
    public override readonly subtype = ModifierAbilityType.RangedWeaponAttackBonus
    public readonly value: number

    public constructor(data: Simplify<IModifierAbilityRangedWeaponAttackBonusData>) {
        super(data)
        this.value = asNumber(data.value, ModifierAbilityRangedWeaponAttackBonusData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierAbilityRangedWeaponAttackBonusData, ModifierAbilityRangedWeaponAttackBonusData> = {
        ...ModifierAbilityDataBase.properties,
        subtype: {
            value: ModifierAbilityType.RangedWeaponAttackBonus,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.abilityRangedWeaponAttackBonus.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return (this.data as ModifierAbilityRangedWeaponAttackBonusData).value + value
            }
        })
    }
}

export default ModifierAbilityRangedWeaponAttackBonusData
