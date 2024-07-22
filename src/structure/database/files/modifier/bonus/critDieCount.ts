import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type Modifier from '../modifier'
import { resolveScaling } from 'utils/calculations'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusCritDieCountData } from 'types/database/files/modifier'

class ModifierBonusCritDieCountData extends ModifierBonusDataBase implements IModifierBonusCritDieCountData {
    public readonly subtype = ModifierBonusType.CritDieCount

    public static properties: DataPropertyMap<IModifierBonusCritDieCountData, ModifierBonusCritDieCountData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.CritDieCount,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        modifier.critDieCount.subscribe({
            key: key,
            data: this,
            apply: function (value, _, properties): number {
                const modifier = this.data as ModifierBonusCritDieCountData
                return value + resolveScaling(modifier.scaling, properties)
            }
        })
    }
}

export default ModifierBonusCritDieCountData
