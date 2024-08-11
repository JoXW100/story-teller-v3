import type { IToken } from 'types/language'
import DatabaseFile from '..'
import type FolderData from './data'
import FolderDataFactory from './factory'
import EmptyToken from 'structure/language/tokens/empty'
import { type FileType, EmptyDatabaseFactory } from 'structure/database'
import type { IDatabaseFactory } from 'types/database'
import type { IFolderData, IFolderStorage } from 'types/database/files/folder'

class FolderFile extends DatabaseFile<FileType.Folder, FolderData> {
    public static get DataFactory(): IDatabaseFactory<IFolderData, FolderData> { return FolderDataFactory }
    public static get StorageFactory(): IDatabaseFactory<IFolderStorage> { return EmptyDatabaseFactory }

    public override getTitle(): string {
        return this.name
    }

    public override getDescription(): string {
        return ''
    }

    public override getTokenizedDescription(): IToken {
        return new EmptyToken(this.getDescription())
    }

    public override getDataFactory(): IDatabaseFactory<IFolderData, FolderData> {
        return FolderFile.DataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<IFolderStorage> {
        return FolderFile.StorageFactory
    }
}

export default FolderFile
