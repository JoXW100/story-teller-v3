import EffectConditionBase, { EffectConditionType } from '.'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IEffectConditionNone } from 'types/database/effectCondition'
import Logger from 'utils/logger'

class EffectConditionNone extends EffectConditionBase implements IEffectConditionNone {
    public readonly type = EffectConditionType.None

    public constructor(data: Simplify<IEffectConditionNone>) {
        super()
        if (data.type !== undefined && data.type !== EffectConditionType.None) {
            Logger.warn('EffectCondition', 'Invalid condition type', data)
        }
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
