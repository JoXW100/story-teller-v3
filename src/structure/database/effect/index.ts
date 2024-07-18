import type Condition from '../condition'
import ConditionFactory, { simplifyCondition } from '../condition/factory'
import { isString } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IEffectBase } from 'types/database/effect'

abstract class EffectBase implements IEffectBase {
    public readonly label: string
    public readonly condition: Condition

    public constructor(data: Simplify<IEffectBase>) {
        this.label = data.label ?? EffectBase.properties.label.value
        this.condition = data.condition === undefined
            ? EffectBase.properties.condition.value
            : ConditionFactory.create(data.condition)
    }

    public static properties: DataPropertyMap<IEffectBase, EffectBase> = {
        label: {
            value: '',
            validate: isString
        },
        condition: {
            get value() { return ConditionFactory.create() },
            validate: ConditionFactory.validate,
            simplify: simplifyCondition
        }
    }
}

export default EffectBase
