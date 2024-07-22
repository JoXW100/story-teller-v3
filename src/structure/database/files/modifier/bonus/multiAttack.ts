import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type Modifier from '../modifier'
import { resolveScaling } from 'utils/calculations'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusMultiAttackData } from 'types/database/files/modifier'

class ModifierBonusMultiAttackData extends ModifierBonusDataBase implements IModifierBonusMultiAttackData {
    public readonly subtype = ModifierBonusType.MultiAttack

    public static properties: DataPropertyMap<IModifierBonusMultiAttackData, ModifierBonusMultiAttackData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.MultiAttack,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        modifier.multiAttack.subscribe({
            key: key,
            data: this,
            apply: function (value, _, properties): number {
                const modifier = this.data as ModifierBonusMultiAttackData
                return value + resolveScaling(modifier.scaling, properties)
            }
        })
    }
}

export default ModifierBonusMultiAttackData
