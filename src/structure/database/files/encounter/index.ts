import DatabaseFile from '..'
import EncounterDataFactory from './factory'
import type EncounterStorage from './storage'
import type EncounterData from './data'
import type { DocumentType } from '../..'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { IEncounterData } from 'types/database/files/encounter'
import type { IToken } from 'types/language'

export class EncounterDocument extends DatabaseFile<DocumentType.Encounter, EncounterStorage, IEncounterData, EncounterData> {
    public static get Factory(): IDatabaseFactory<IEncounterData, EncounterData> { return EncounterDataFactory }

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
        return EncounterDataFactory
    }
}

export default EncounterDocument
