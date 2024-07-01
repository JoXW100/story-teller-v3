import EffectConditionBase, { EffectConditionType } from '.'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { INoneEffectCondition } from 'types/database/effectCondition'

class NoneEffectCondition extends EffectConditionBase implements INoneEffectCondition {
    public readonly type: EffectConditionType.None

    public constructor(data: Simplify<INoneEffectCondition>) {
        super()
        this.type = data.type ?? NoneEffectCondition.properties.type.value
    }

    public static properties: DataPropertyMap<INoneEffectCondition, NoneEffectCondition> = {
        ...EffectConditionBase.properties,
        type: {
            value: EffectConditionType.None,
            validate: (value) => value === this.properties.type.value
        }
    }
}

export default NoneEffectCondition
