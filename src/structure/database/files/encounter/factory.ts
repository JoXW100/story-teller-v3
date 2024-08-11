import EncounterData from './data'
import EncounterCard from './card'
import EncounterStorage from './storage'
import { isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IEncounterCard, IEncounterData, IEncounterStorage } from 'types/database/files/encounter'

export const EncounterDataFactory: IDatabaseFactory<IEncounterData, EncounterData> = {
    create: function (data: Simplify<IEncounterData> = {}): EncounterData {
        return new EncounterData(data)
    },
    is: function (data: unknown): data is IEncounterData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IEncounterData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IEncounterData): Simplify<IEncounterData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (): DataPropertyMap<IEncounterData, EncounterData> {
        return EncounterData.properties
    }
}

export const EncounterCardFactory: IDatabaseFactory<IEncounterCard, EncounterCard> = {
    create: function (data: Simplify<IEncounterCard> = {}): EncounterCard {
        return new EncounterCard(data)
    },
    is: function (data: unknown): data is IEncounterCard {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IEncounterCard> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IEncounterCard): Simplify<IEncounterCard> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (): DataPropertyMap<IEncounterCard, EncounterCard> {
        return EncounterCard.properties
    }
}

export const EncounterStorageFactory: IDatabaseFactory<IEncounterStorage, EncounterStorage> = {
    create: function (data: Simplify<IEncounterStorage> = {}): EncounterStorage {
        return new EncounterStorage(data)
    },
    is: function (data: unknown): data is IEncounterStorage {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IEncounterStorage> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IEncounterStorage): Simplify<IEncounterStorage> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (): DataPropertyMap<IEncounterStorage, EncounterStorage> {
        return EncounterStorage.properties
    }
}
