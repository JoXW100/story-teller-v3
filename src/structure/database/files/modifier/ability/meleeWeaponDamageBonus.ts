import type ModifierDocument from '..'
import ModifierAbilityDataBase, { ModifierAbilityType } from '.'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAbilityMeleeWeaponDamageBonusData } from 'types/database/files/modifier'

class ModifierAbilityMeleeWeaponDamageBonusData extends ModifierAbilityDataBase implements IModifierAbilityMeleeWeaponDamageBonusData {
    public override readonly subtype = ModifierAbilityType.MeleeWeaponDamageBonus
    public readonly value: number

    public constructor(data: Simplify<IModifierAbilityMeleeWeaponDamageBonusData>) {
        super(data)
        this.value = asNumber(data.value, ModifierAbilityMeleeWeaponDamageBonusData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierAbilityMeleeWeaponDamageBonusData, ModifierAbilityMeleeWeaponDamageBonusData> = {
        ...ModifierAbilityDataBase.properties,
        subtype: {
            value: ModifierAbilityType.MeleeWeaponDamageBonus,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.abilityMeleeWeaponDamageBonus.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return (this.data as ModifierAbilityMeleeWeaponDamageBonusData).value + value
            }
        })
    }
}

export default ModifierAbilityMeleeWeaponDamageBonusData
