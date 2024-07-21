import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusSpellAttackData } from 'types/database/files/modifier'

class ModifierBonusSpellAttackData extends ModifierBonusDataBase implements IModifierBonusSpellAttackData {
    public readonly subtype = ModifierBonusType.SpellAttack
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusSpellAttackData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusSpellAttackData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusSpellAttackData, ModifierBonusSpellAttackData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.SpellAttack,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.spellAttack.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusSpellAttackData).value
            }
        })
    }
}

export default ModifierBonusSpellAttackData
