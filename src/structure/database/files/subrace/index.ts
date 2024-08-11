import DatabaseFile from '..'
import type SubraceData from './data'
import SubraceDataFactory from './factory'
import StoryScript from 'structure/language/storyscript'
import { type DocumentType, EmptyDatabaseFactory } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { ObjectId } from 'types'
import type { IToken } from 'types/language'
import type { IDatabaseFactory } from 'types/database'
import type { ISubraceData, ISubraceStorage } from 'types/database/files/subrace'

class SubraceDocument extends DatabaseFile<DocumentType.Subrace, SubraceData> {
    public static get DataFactory(): IDatabaseFactory<ISubraceData, SubraceData> { return SubraceDataFactory }
    public static get StorageFactory(): IDatabaseFactory<ISubraceStorage> { return EmptyDatabaseFactory }

    public override getTitle(): string {
        return this.data.name
    }

    public override getDescription(): string {
        return this.data.description
    }

    public override getTokenizedDescription(elements: ElementDefinitions): IToken {
        const [description] = this.data.createContexts(elements)
        return StoryScript.tokenize(elements, this.data.description, description).root
    }

    public override getDataFactory(): IDatabaseFactory<ISubraceData, SubraceData> {
        return SubraceDocument.DataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<ISubraceStorage> {
        return SubraceDocument.StorageFactory
    }

    public override getParentFile(): ObjectId | null {
        return this.data.parentFile
    }
}

export default SubraceDocument
