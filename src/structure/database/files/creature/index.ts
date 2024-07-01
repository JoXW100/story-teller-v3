import type { IDatabaseFactory } from 'types/database'
import DatabaseFile from '..'
import type CreatureData from './data'
import CreatureDataFactory from './factory'
import StoryScript from 'structure/language/storyscript'
import type { DocumentType } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { ICreatureData, ICreatureStorage } from 'types/database/files/creature'
import type { IToken } from 'types/language'

class CreatureDocument extends DatabaseFile<DocumentType.Creature, ICreatureStorage, ICreatureData, CreatureData> {
    public override getTitle(): string {
        return this.data.name
    }

    public override getTokenizedDescription(elements: ElementDefinitions): IToken {
        const [description] = this.data.createContexts(elements)
        return StoryScript.tokenize(elements, this.data.description, description).root
    }

    public override getDataFactory(): IDatabaseFactory<ICreatureData, CreatureData> {
        return CreatureDataFactory
    }
}

export default CreatureDocument
