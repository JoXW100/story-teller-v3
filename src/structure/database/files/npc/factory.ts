import NPCData from './data'
import { isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { INPCData } from 'types/database/files/npc'

const NPCDataFactory: IDatabaseFactory<INPCData, NPCData> = {
    create: function (data: Simplify<INPCData> = {}): NPCData {
        return new NPCData(data)
    },
    is: function (data: unknown): data is INPCData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<INPCData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: INPCData): Simplify<INPCData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (): DataPropertyMap<INPCData, NPCData> {
        return NPCData.properties
    }
}

export default NPCDataFactory
