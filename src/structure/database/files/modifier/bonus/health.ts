import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type Modifier from '../modifier'
import { asNumber } from 'utils'
import { resolveScaling } from 'utils/calculations'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusHealthData } from 'types/database/files/modifier'

class ModifierBonusHealthData extends ModifierBonusDataBase implements IModifierBonusHealthData {
    public readonly subtype = ModifierBonusType.Health

    public static properties: DataPropertyMap<IModifierBonusHealthData, ModifierBonusHealthData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.Health,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        modifier.health.subscribe({
            key: key,
            data: this,
            apply: function (value, _, properties, variables): number {
                const modifier = this.data as ModifierBonusHealthData
                const bonus = variables['health.bonus'] = asNumber(variables['health.bonus'], 0) + resolveScaling(modifier.scaling, properties)
                return value + bonus
            }
        })
    }
}

export default ModifierBonusHealthData
