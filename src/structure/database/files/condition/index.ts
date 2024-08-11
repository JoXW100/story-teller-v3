import DatabaseFile from '..'
import ConditionDataFactory from './factory'
import type ConditionData from './data'
import { EmptyDatabaseFactory, type DocumentType } from '../..'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { IConditionData, IConditionStorage } from 'types/database/files/condition'
import type { IToken } from 'types/language'

export class ConditionDocument extends DatabaseFile<DocumentType.Condition, ConditionData> {
    public static get DataFactory(): IDatabaseFactory<IConditionData, ConditionData> { return ConditionDataFactory }
    public static get StorageFactory(): IDatabaseFactory<IConditionStorage> { return EmptyDatabaseFactory }

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

    public override getDataFactory(): IDatabaseFactory<IConditionData, ConditionData> {
        return ConditionDocument.DataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<IConditionStorage> {
        return ConditionDocument.StorageFactory
    }
}

export default ConditionDocument
