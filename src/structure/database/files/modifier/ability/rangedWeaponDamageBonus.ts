import type ModifierDocument from '..'
import ModifierAbilityDataBase, { ModifierAbilityType } from '.'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAbilityRangedWeaponDamageBonusData } from 'types/database/files/modifier'

class ModifierAbilityRangedWeaponDamageBonusData extends ModifierAbilityDataBase implements IModifierAbilityRangedWeaponDamageBonusData {
    public override readonly subtype = ModifierAbilityType.RangedWeaponDamageBonus
    public readonly value: number

    public constructor(data: Simplify<IModifierAbilityRangedWeaponDamageBonusData>) {
        super(data)
        this.value = asNumber(data.value, ModifierAbilityRangedWeaponDamageBonusData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierAbilityRangedWeaponDamageBonusData, ModifierAbilityRangedWeaponDamageBonusData> = {
        ...ModifierAbilityDataBase.properties,
        subtype: {
            value: ModifierAbilityType.RangedWeaponDamageBonus,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.abilityRangedWeaponDamageBonus.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return (this.data as ModifierAbilityRangedWeaponDamageBonusData).value + value
            }
        })
    }
}

export default ModifierAbilityRangedWeaponDamageBonusData
