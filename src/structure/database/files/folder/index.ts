import type { IToken } from 'types/language'
import DatabaseFile from '..'
import type FolderData from './data'
import FolderDataFactory from './factory'
import EmptyToken from 'structure/language/tokens/empty'
import type { FileType } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { IFolderData, IFolderStorage } from 'types/database/files/folder'

class FolderFile extends DatabaseFile<FileType.Folder, IFolderStorage, IFolderData, FolderData> {
    public override getTitle(): string {
        return this.name
    }

    public override getDescription(): string {
        return ''
    }

    public override getTokenizedDescription(elements: ElementDefinitions): IToken {
        return new EmptyToken(this.getDescription())
    }

    public override getDataFactory(): IDatabaseFactory<IFolderData, FolderData> {
        return FolderDataFactory
    }
}

export default FolderFile
