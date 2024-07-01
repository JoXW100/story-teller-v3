import ModifierAbilityDataBase, { ModifierAbilityType } from '.'
import type ModifierDocument from '..'
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

    public apply(data: Modifier, self: ModifierDocument): void {
        throw new Error('Method not implemented.')
    }
}

export default ModifierAbilityAttackBonusData
