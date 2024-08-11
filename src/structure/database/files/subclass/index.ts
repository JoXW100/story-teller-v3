import DatabaseFile from '..'
import type SubclassData from './data'
import SubclassDataFactory from './factory'
import StoryScript from 'structure/language/storyscript'
import { type DocumentType, EmptyDatabaseFactory } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { ObjectId } from 'types'
import type { IDatabaseFactory } from 'types/database'
import type { ISubclassData, ISubclassStorage } from 'types/database/files/subclass'
import type { IToken } from 'types/language'

class SubclassDocument extends DatabaseFile<DocumentType.Subclass, SubclassData> {
    public static get DataFactory(): IDatabaseFactory<ISubclassData, SubclassData> { return SubclassDataFactory }
    public static get StorageFactory(): IDatabaseFactory<ISubclassStorage> { return EmptyDatabaseFactory }

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

    public override getDataFactory(): IDatabaseFactory<ISubclassData, SubclassData> {
        return SubclassDocument.DataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<ISubclassStorage> {
        return SubclassDocument.StorageFactory
    }

    public override getParentFile(): ObjectId | null {
        return this.data.parentFile
    }
}

export default SubclassDocument
