import MapData from './data'
import MapStorage from './storage'
import { isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IMapData, IMapStorage } from 'types/database/files/map'

export const MapDataFactory: IDatabaseFactory<IMapData, MapData> = {
    create: function (data: Simplify<IMapData> = {}): MapData {
        return new MapData(data)
    },
    is: function (data: unknown): data is IMapData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IMapData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IMapData): Simplify<IMapData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (): DataPropertyMap<IMapData, MapData> {
        return MapData.properties
    }
}

export const MapStorageFactory: IDatabaseFactory<IMapStorage, MapStorage> = {
    create: function (data: Simplify<IMapStorage> = {}): MapStorage {
        return new MapStorage(data)
    },
    is: function (data: unknown): data is IMapStorage {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IMapStorage> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IMapStorage): Simplify<IMapStorage> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (): DataPropertyMap<IMapStorage, MapStorage> {
        return MapStorage.properties
    }
}
