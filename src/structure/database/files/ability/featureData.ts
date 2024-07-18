import { AbilityType } from './common'
import AbilityDataBase from './data'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityFeatureData } from 'types/database/files/ability'

class AbilityFeatureData extends AbilityDataBase implements IAbilityFeatureData {
    public readonly type: AbilityType.Feature | AbilityType.Feat | AbilityType.FightingStyle

    public constructor(data: Simplify<IAbilityFeatureData>) {
        super(data)
        this.type = data.type ?? AbilityFeatureData.properties.type.value
    }

    public static override properties: DataPropertyMap<IAbilityFeatureData, AbilityFeatureData> = {
        ...AbilityDataBase.properties,
        type: {
            value: AbilityType.Feature,
            validate: (value) => value === AbilityType.Feature || value === AbilityType.Feat || value === AbilityType.FightingStyle,
            simplify: (value) => value
        }
    }
}

export default AbilityFeatureData
