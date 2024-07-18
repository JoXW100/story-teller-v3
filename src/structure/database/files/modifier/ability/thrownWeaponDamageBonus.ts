import type ModifierDocument from '..'
import ModifierAbilityDataBase, { ModifierAbilityType } from '.'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAbilityThrownWeaponDamageBonusData } from 'types/database/files/modifier'

class ModifierAbilityThrownWeaponDamageBonusData extends ModifierAbilityDataBase implements IModifierAbilityThrownWeaponDamageBonusData {
    public override readonly subtype = ModifierAbilityType.ThrownWeaponDamageBonus
    public readonly value: number

    public constructor(data: Simplify<IModifierAbilityThrownWeaponDamageBonusData>) {
        super(data)
        this.value = asNumber(data.value, ModifierAbilityThrownWeaponDamageBonusData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierAbilityThrownWeaponDamageBonusData, ModifierAbilityThrownWeaponDamageBonusData> = {
        ...ModifierAbilityDataBase.properties,
        subtype: {
            value: ModifierAbilityType.ThrownWeaponDamageBonus,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.abilityThrownWeaponDamageBonus.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return (this.data as ModifierAbilityThrownWeaponDamageBonusData).value + value
            }
        })
    }
}

export default ModifierAbilityThrownWeaponDamageBonusData
