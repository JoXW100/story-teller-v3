import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusSpellSaveData } from 'types/database/files/modifier'

class ModifierBonusSpellSaveData extends ModifierBonusDataBase implements IModifierBonusSpellSaveData {
    public readonly subtype = ModifierBonusType.SpellSave
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusSpellSaveData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusSpellSaveData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusSpellSaveData, ModifierBonusSpellSaveData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.SpellSave,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.spellSave.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusSpellSaveData).value
            }
        })
    }
}

export default ModifierBonusSpellSaveData
