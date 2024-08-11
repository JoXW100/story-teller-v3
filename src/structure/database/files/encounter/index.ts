import DatabaseFile from '..'
import { EncounterDataFactory, EncounterStorageFactory } from './factory'
import type EncounterStorage from './storage'
import type EncounterData from './data'
import type { DocumentType } from '../..'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { IEncounterData, IEncounterStorage } from 'types/database/files/encounter'
import type { IToken } from 'types/language'

export class EncounterDocument extends DatabaseFile<DocumentType.Encounter, EncounterData, EncounterStorage> {
    public static get DataFactory(): IDatabaseFactory<IEncounterData, EncounterData> { return EncounterDataFactory }
    public static get StorageFactory(): IDatabaseFactory<IEncounterStorage, EncounterStorage> { return EncounterStorageFactory }

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

    public override getDataFactory(): IDatabaseFactory<IEncounterData, EncounterData> {
        return EncounterDocument.DataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<IEncounterStorage, EncounterStorage> {
        return EncounterDocument.StorageFactory
    }
}

export default EncounterDocument
