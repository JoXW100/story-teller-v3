import ModifierAbilityDataBase, { ModifierAbilityType } from '.'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAbilityThrownWeaponAttackBonusData } from 'types/database/files/modifier'

class ModifierAbilityThrownWeaponAttackBonusData extends ModifierAbilityDataBase implements IModifierAbilityThrownWeaponAttackBonusData {
    public override readonly subtype = ModifierAbilityType.ThrownWeaponAttackBonus
    public readonly value: number

    public constructor(data: Simplify<IModifierAbilityThrownWeaponAttackBonusData>) {
        super(data)
        this.value = asNumber(data.value, ModifierAbilityThrownWeaponAttackBonusData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierAbilityThrownWeaponAttackBonusData, ModifierAbilityThrownWeaponAttackBonusData> = {
        ...ModifierAbilityDataBase.properties,
        subtype: {
            value: ModifierAbilityType.ThrownWeaponAttackBonus,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        modifier.abilityThrownWeaponAttackBonus.subscribe({
            key: key,
            data: this,
            apply: function (value): number {
                return (this.data as ModifierAbilityThrownWeaponAttackBonusData).value + value
            }
        })
    }
}

export default ModifierAbilityThrownWeaponAttackBonusData
