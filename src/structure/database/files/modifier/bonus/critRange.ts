import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type Modifier from '../modifier'
import { resolveScaling } from 'utils/calculations'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusCritRangeData } from 'types/database/files/modifier'

class ModifierBonusCritRangeData extends ModifierBonusDataBase implements IModifierBonusCritRangeData {
    public readonly subtype = ModifierBonusType.CritRange

    public static properties: DataPropertyMap<IModifierBonusCritRangeData, ModifierBonusCritRangeData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.CritRange,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        modifier.critRange.subscribe({
            key: key,
            data: this,
            apply: function (value, _, properties): number {
                const modifier = this.data as ModifierBonusCritRangeData
                return value + resolveScaling(modifier.scaling, properties)
            }
        })
    }
}

export default ModifierBonusCritRangeData
