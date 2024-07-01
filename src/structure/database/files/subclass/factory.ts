import SubclassData from './data'
import { isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { ISubclassData } from 'types/database/files/subclass'

const SubclassDataFactory: IDatabaseFactory<ISubclassData, SubclassData> = {
    create: function (data: Simplify<ISubclassData> = {}): SubclassData {
        return new SubclassData(data)
    },
    is: function (data: unknown): data is ISubclassData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<ISubclassData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: ISubclassData): Simplify<ISubclassData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<ISubclassData, SubclassData> {
        return SubclassData.properties
    }
}

export default SubclassDataFactory
