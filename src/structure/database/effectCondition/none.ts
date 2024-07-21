import EffectConditionBase, { EffectConditionType } from '.'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IEffectConditionNone } from 'types/database/effectCondition'

class EffectConditionNone extends EffectConditionBase implements IEffectConditionNone {
    public readonly type: EffectConditionType.None

    public constructor(data: Simplify<IEffectConditionNone>) {
        super()
        this.type = data.type ?? EffectConditionNone.properties.type.value
    }

    public static properties: DataPropertyMap<IEffectConditionNone, EffectConditionNone> = {
        ...EffectConditionBase.properties,
        type: {
            value: EffectConditionType.None,
            validate: (value) => value === this.properties.type.value
        }
    }
}

export default EffectConditionNone
