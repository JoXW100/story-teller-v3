import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type Modifier from '../modifier'
import { asNumber } from 'utils'
import { resolveScaling } from 'utils/calculations'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusACData } from 'types/database/files/modifier'

class ModifierBonusACData extends ModifierBonusDataBase implements IModifierBonusACData {
    public readonly subtype = ModifierBonusType.AC

    public static properties: DataPropertyMap<IModifierBonusACData, ModifierBonusACData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.AC,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        modifier.ac.subscribe({
            key: key,
            data: this,
            apply: function (value, _, properties, variables): number {
                const modifier = this.data as ModifierBonusACData
                const bonus = variables['ac.bonus'] = asNumber(variables['ac.bonus'], 0) + resolveScaling(modifier.scaling, properties)
                return value + bonus
            }
        })
    }
}

export default ModifierBonusACData
