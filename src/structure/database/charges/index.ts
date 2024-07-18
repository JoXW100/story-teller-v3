import type Condition from '../condition'
import ConditionFactory, { simplifyCondition } from '../condition/factory'
import { isEnum, isNumber } from 'utils'
import { RestType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { IChargesData } from 'types/database/charges'
import type { DataPropertyMap } from 'types/database'

class ChargesData implements IChargesData {
    public readonly condition: Condition
    public readonly charges: number
    public readonly chargesReset: RestType

    public constructor(data: Simplify<IChargesData>) {
        this.condition = ConditionFactory.create(data.condition)
        this.charges = data.charges ?? ChargesData.properties.charges.value
        this.chargesReset = data.chargesReset ?? ChargesData.properties.chargesReset.value
    }

    public static properties: DataPropertyMap<IChargesData, ChargesData> = {
        condition: {
            get value() { return ConditionFactory.create() },
            validate: ConditionFactory.validate,
            simplify: simplifyCondition
        },
        charges: {
            value: 0,
            validate: isNumber
        },
        chargesReset: {
            value: RestType.None,
            validate: (value) => isEnum(value, RestType)
        }
    }
}

export default ChargesData
