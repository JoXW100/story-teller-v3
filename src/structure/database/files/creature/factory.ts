import CreatureData from './data'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { ICreatureData, ICreatureStorage } from 'types/database/files/creature'
import { isRecord } from 'utils'
import CreatureStorage from './storage'

const CreatureDataFactory: IDatabaseFactory<ICreatureData, CreatureData> = {
    create: function (data: Simplify<ICreatureData> = {}): CreatureData {
        return new CreatureData(data)
    },
    is: function (data: unknown): data is ICreatureData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<ICreatureData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: ICreatureData): Simplify<ICreatureData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<ICreatureData, CreatureData> {
        return CreatureData.properties
    }
}

export const CreatureStorageFactory: IDatabaseFactory<ICreatureStorage, CreatureStorage> = {
    create: function (storage: Simplify<ICreatureStorage> = {}): CreatureStorage {
        return new CreatureStorage(storage)
    },
    is: function (storage: unknown): storage is ICreatureStorage {
        return this.validate(storage) && hasObjectProperties(storage, this.properties(storage))
    },
    validate: function (storage: unknown): storage is Simplify<ICreatureStorage> {
        return isRecord(storage) && validateObjectProperties(storage, this.properties(storage))
    },
    simplify: function (storage: ICreatureStorage): Simplify<ICreatureStorage> {
        return simplifyObjectProperties(storage, this.properties(storage))
    },
    properties: function (data: unknown): DataPropertyMap<ICreatureStorage, CreatureStorage> {
        return CreatureStorage.properties
    }
}

export default CreatureDataFactory
