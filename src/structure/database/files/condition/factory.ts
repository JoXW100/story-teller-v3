import ConditionData from './data'
import { isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IConditionData } from 'types/database/files/condition'

const ConditionDataFactory: IDatabaseFactory<IConditionData, ConditionData> = {
    create: function (data: Simplify<IConditionData> = {}): ConditionData {
        return new ConditionData(data)
    },
    is: function (data: unknown): data is IConditionData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IConditionData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IConditionData): Simplify<IConditionData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (): DataPropertyMap<IConditionData, ConditionData> {
        return ConditionData.properties
    }
}

export default ConditionDataFactory
