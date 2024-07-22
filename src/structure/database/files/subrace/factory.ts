import SubraceData from './data'
import { isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { ISubraceData } from 'types/database/files/subrace'

const SubraceDataFactory: IDatabaseFactory<ISubraceData, SubraceData> = {
    create: function (data: Simplify<ISubraceData> = {}): SubraceData {
        return new SubraceData(data)
    },
    is: function (data: unknown): data is ISubraceData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<ISubraceData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: ISubraceData): Simplify<ISubraceData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (): DataPropertyMap<ISubraceData, SubraceData> {
        return SubraceData.properties
    }
}

export default SubraceDataFactory
