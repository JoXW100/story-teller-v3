import type { IDatabaseFactory } from 'types/database'
import DatabaseFile from '..'
import type NPCData from './data'
import NPCDataFactory from './factory'
import StoryScript from 'structure/language/storyscript'
import type { DocumentType } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { INPCData, INPCStorage } from 'types/database/files/npc'
import type { IToken } from 'types/language'

class NPCDocument extends DatabaseFile<DocumentType.NPC, INPCStorage, INPCData, NPCData> {
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
        return NPCDataFactory
    }
}

export default NPCDocument
