import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type Modifier from '../modifier'
import { resolveScaling } from 'utils/calculations'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusSpellSaveData } from 'types/database/files/modifier'

class ModifierBonusSpellSaveData extends ModifierBonusDataBase implements IModifierBonusSpellSaveData {
    public readonly subtype = ModifierBonusType.SpellSave

    public static properties: DataPropertyMap<IModifierBonusSpellSaveData, ModifierBonusSpellSaveData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.SpellSave,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        modifier.spellSave.subscribe({
            key: key,
            data: this,
            apply: function (value, _, properties): number {
                const modifier = this.data as ModifierBonusSpellSaveData
                return value + resolveScaling(modifier.scaling, properties)
            }
        })
    }
}

export default ModifierBonusSpellSaveData
