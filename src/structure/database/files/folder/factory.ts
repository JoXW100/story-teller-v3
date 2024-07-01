import FolderData from './data'
import { isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IFolderData } from 'types/database/files/folder'

const FolderDataFactory: IDatabaseFactory<IFolderData, FolderData> = {
    create: function (data: Simplify<IFolderData> = {}): FolderData {
        return new FolderData(data)
    },
    is: function (data: unknown): data is IFolderData {
        return isRecord(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IFolderData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IFolderData): Simplify<IFolderData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (): DataPropertyMap<IFolderData, FolderData> {
        return FolderData.properties
    }
}

export default FolderDataFactory
