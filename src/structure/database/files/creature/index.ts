import type { IDatabaseFactory } from 'types/database'
import DatabaseFile from '..'
import type CreatureData from './data'
import type CreatureStorage from './storage'
import { CreatureDataFactory, CreatureStorageFactory } from './factory'
import StoryScript from 'structure/language/storyscript'
import type { DocumentType } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { ICreatureData, ICreatureStorage } from 'types/database/files/creature'
import type { IToken } from 'types/language'

class CreatureDocument extends DatabaseFile<DocumentType.Creature, CreatureData, CreatureStorage> {
    public static get DataFactory(): IDatabaseFactory<ICreatureData, CreatureData> { return CreatureDataFactory }
    public static get StorageFactory(): IDatabaseFactory<ICreatureStorage, CreatureStorage> { return CreatureStorageFactory }

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

    public override getDataFactory(): IDatabaseFactory<ICreatureData, CreatureData> {
        return CreatureDocument.DataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<ICreatureStorage, CreatureStorage> {
        return CreatureDocument.StorageFactory
    }
}

export default CreatureDocument
