import { AbilityType } from './common'
import AbilityDataBase from './data'
import { isString } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityCustomData } from 'types/database/files/ability'

class AbilityCustomData extends AbilityDataBase implements IAbilityCustomData {
    public readonly type = AbilityType.Custom
    public readonly category: string

    public constructor(data: Simplify<IAbilityCustomData>) {
        super(data)
        this.category = data.category ?? AbilityCustomData.properties.category.value
    }

    public static override properties: DataPropertyMap<IAbilityCustomData, AbilityCustomData> = {
        ...AbilityDataBase.properties,
        type: {
            value: AbilityType.Custom,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        category: {
            value: '',
            validate: isString
        }
    }
}

export default AbilityCustomData
