import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type Modifier from '../modifier'
import { resolveScaling } from 'utils/calculations'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusSpellAttackData } from 'types/database/files/modifier'

class ModifierBonusSpellAttackData extends ModifierBonusDataBase implements IModifierBonusSpellAttackData {
    public readonly subtype = ModifierBonusType.SpellAttack

    public static properties: DataPropertyMap<IModifierBonusSpellAttackData, ModifierBonusSpellAttackData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.SpellAttack,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        modifier.spellAttack.subscribe({
            key: key,
            data: this,
            apply: function (value, _, properties): number {
                const modifier = this.data as ModifierBonusSpellAttackData
                return value + resolveScaling(modifier.scaling, properties)
            }
        })
    }
}

export default ModifierBonusSpellAttackData
