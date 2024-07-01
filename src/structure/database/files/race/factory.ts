import RaceData from './data'
import { isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IRaceData } from 'types/database/files/race'

const RaceDataFactory: IDatabaseFactory<IRaceData, RaceData> = {
    create: function (data: Simplify<IRaceData> = {}): RaceData {
        return new RaceData(data)
    },
    is: function (data: unknown): data is IRaceData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IRaceData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IRaceData): Simplify<IRaceData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (): DataPropertyMap<IRaceData, RaceData> {
        return RaceData.properties
    }
}

export default RaceDataFactory
