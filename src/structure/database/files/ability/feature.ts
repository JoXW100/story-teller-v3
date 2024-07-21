import { AbilityType } from './common'
import AbilityDataBase from './data'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityFeatureData } from 'types/database/files/ability'

class AbilityFeatureData extends AbilityDataBase implements IAbilityFeatureData {
    public readonly type = AbilityType.Feature

    public static override properties: DataPropertyMap<IAbilityFeatureData, AbilityFeatureData> = {
        ...AbilityDataBase.properties,
        type: {
            value: AbilityType.Feature,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        }
    }
}

export default AbilityFeatureData
