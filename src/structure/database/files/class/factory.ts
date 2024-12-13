import ClassData from './data'
import { isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IClassData } from 'types/database/files/class'

const ClassDataFactory: IDatabaseFactory<IClassData, ClassData> = {
    create: function (data: Simplify<IClassData> = {}): ClassData {
        return new ClassData(data)
    },
    is: function (data: unknown): data is IClassData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IClassData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IClassData): Simplify<IClassData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (_data: unknown): DataPropertyMap<IClassData, ClassData> {
        return ClassData.properties
    }
}

export default ClassDataFactory
