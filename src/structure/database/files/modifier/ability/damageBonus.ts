import type ModifierDocument from '..'
import ModifierAbilityDataBase, { ModifierAbilityType } from '.'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAbilityDamageBonusData } from 'types/database/files/modifier'

class ModifierAbilityDamageBonusData extends ModifierAbilityDataBase implements IModifierAbilityDamageBonusData {
    public override readonly subtype = ModifierAbilityType.DamageBonus
    public readonly value: number

    public constructor(data: Simplify<IModifierAbilityDamageBonusData>) {
        super(data)
        this.value = asNumber(data.value, ModifierAbilityDamageBonusData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierAbilityDamageBonusData, ModifierAbilityDamageBonusData> = {
        ...ModifierAbilityDataBase.properties,
        subtype: {
            value: ModifierAbilityType.DamageBonus,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.abilityDamageBonus.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return (this.data as ModifierAbilityDamageBonusData).value + value
            }
        })
    }
}

export default ModifierAbilityDamageBonusData
