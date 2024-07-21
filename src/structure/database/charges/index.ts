import { simplifyNumberRecord } from '..'
import type Condition from '../condition'
import ConditionFactory, { simplifyCondition } from '../condition/factory'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import { RestType, ScalingType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { IChargesData } from 'types/database/charges'
import type { DataPropertyMap } from 'types/database'
import type { IConditionProperties } from 'types/database/condition'

class ChargesData implements IChargesData {
    public readonly condition: Condition
    public readonly chargesReset: RestType
    public readonly charges: Partial<Record<ScalingType, number>>

    public constructor(data: Simplify<IChargesData>) {
        this.condition = ConditionFactory.create(data.condition)
        this.chargesReset = data.chargesReset ?? ChargesData.properties.chargesReset.value
        this.charges = ChargesData.properties.charges.value
        if (data.charges !== undefined) {
            for (const type of keysOf(data.charges)) {
                if (isEnum(type, ScalingType)) {
                    this.charges[type] = asNumber(data.charges[type], 0)
                }
            }
        }
    }

    public getCharges(stats: Partial<IConditionProperties> = {}): number {
        return resolveScaling(this.charges, stats)
    }

    public static properties: DataPropertyMap<IChargesData, ChargesData> = {
        condition: {
            get value() { return ConditionFactory.create() },
            validate: ConditionFactory.validate,
            simplify: simplifyCondition
        },
        chargesReset: {
            value: RestType.None,
            validate: (value) => isEnum(value, RestType)
        },
        charges: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }
}

export default ChargesData
