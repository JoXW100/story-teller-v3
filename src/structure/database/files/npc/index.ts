import type { IDatabaseFactory } from 'types/database'
import DatabaseFile from '..'
import type NPCData from './data'
import NPCDataFactory from './factory'
import StoryScript from 'structure/language/storyscript'
import { type DocumentType, EmptyDatabaseFactory } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { INPCData, INPCStorage } from 'types/database/files/npc'
import type { IToken } from 'types/language'

class NPCDocument extends DatabaseFile<DocumentType.NPC, NPCData> {
    public static get DataFactory(): IDatabaseFactory<INPCData, NPCData> { return NPCDataFactory }
    public static get StorageFactory(): IDatabaseFactory<INPCStorage> { return EmptyDatabaseFactory }

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

    public override getDataFactory(): IDatabaseFactory<INPCData, NPCData> {
        return NPCDocument.DataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<INPCStorage> {
        return NPCDocument.StorageFactory
    }
}

export default NPCDocument
