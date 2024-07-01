import CharacterData from './data'
import CharacterStorage from './storage'
import { isRecord } from 'utils'
import { hasObjectProperties, validateObjectProperties, simplifyObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { ICharacterData, ICharacterStorage } from 'types/database/files/character'

const CharacterDataFactory: IDatabaseFactory<ICharacterData, CharacterData> = {
    create: function (data: Simplify<ICharacterData> = {}): CharacterData {
        return new CharacterData(data)
    },
    is: function (data: unknown): data is ICharacterData {
        return isRecord(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<ICharacterData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: ICharacterData): Simplify<ICharacterData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<ICharacterData, CharacterData> {
        return CharacterData.properties
    }
}

export const CharacterStorageFactory: IDatabaseFactory<ICharacterStorage, CharacterStorage> = {
    create: function (storage: Simplify<ICharacterStorage> = {}): CharacterStorage {
        return new CharacterStorage(storage)
    },
    is: function (storage: unknown): storage is ICharacterStorage {
        return this.validate(storage) && hasObjectProperties(storage, this.properties(storage))
    },
    validate: function (storage: unknown): storage is Simplify<ICharacterStorage> {
        return isRecord(storage) && validateObjectProperties(storage, this.properties(storage))
    },
    simplify: function (storage: ICharacterStorage): Simplify<ICharacterStorage> {
        return simplifyObjectProperties(storage, this.properties(storage))
    },
    properties: function (data: unknown): DataPropertyMap<ICharacterStorage, CharacterStorage> {
        return CharacterStorage.properties
    }
}

export default CharacterDataFactory
