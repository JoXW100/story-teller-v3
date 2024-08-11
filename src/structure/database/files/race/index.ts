import DatabaseFile from '..'
import RaceDataFactory from './factory'
import type RaceData from './data'
import { type DocumentType, EmptyDatabaseFactory } from '../..'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { IRaceData, IRaceStorage } from 'types/database/files/race'
import type { IToken } from 'types/language'

export class RaceDocument extends DatabaseFile<DocumentType.Race, RaceData> {
    public static get DataFactory(): IDatabaseFactory<IRaceData, RaceData> { return RaceDataFactory }
    public static get StorageFactory(): IDatabaseFactory<IRaceStorage> { return EmptyDatabaseFactory }

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

    public override getDataFactory(): IDatabaseFactory<IRaceData, RaceData> {
        return RaceDocument.DataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<IRaceStorage> {
        return RaceDocument.StorageFactory
    }
}

export default RaceDocument
