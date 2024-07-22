import ModifierAbilityDataBase, { ModifierAbilityType } from '.'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAbilityMeleeWeaponAttackBonusData } from 'types/database/files/modifier'

class ModifierAbilityMeleeWeaponAttackBonusData extends ModifierAbilityDataBase implements IModifierAbilityMeleeWeaponAttackBonusData {
    public override readonly subtype = ModifierAbilityType.MeleeWeaponAttackBonus
    public readonly value: number

    public constructor(data: Simplify<IModifierAbilityMeleeWeaponAttackBonusData>) {
        super(data)
        this.value = asNumber(data.value, ModifierAbilityMeleeWeaponAttackBonusData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierAbilityMeleeWeaponAttackBonusData, ModifierAbilityMeleeWeaponAttackBonusData> = {
        ...ModifierAbilityDataBase.properties,
        subtype: {
            value: ModifierAbilityType.MeleeWeaponAttackBonus,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        modifier.abilityMeleeWeaponAttackBonus.subscribe({
            key: key,
            data: this,
            apply: function (value): number {
                return (this.data as ModifierAbilityMeleeWeaponAttackBonusData).value + value
            }
        })
    }
}

export default ModifierAbilityMeleeWeaponAttackBonusData
