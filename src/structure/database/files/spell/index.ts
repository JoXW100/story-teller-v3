import DatabaseFile from '..'
import SpellDataFactory, { type SpellData } from './factory'
import { type DocumentType, EmptyDatabaseFactory } from 'structure/database'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { ISpellData, ISpellStorage } from 'types/database/files/spell'
import type { IToken } from 'types/language'

export class SpellDocument extends DatabaseFile<DocumentType.Spell, SpellData> {
    public static get DataFactory(): IDatabaseFactory<ISpellData, SpellData> { return SpellDataFactory }
    public static get StorageFactory(): IDatabaseFactory<ISpellStorage> { return EmptyDatabaseFactory }

    public override getTitle(): string {
        return this.data.name
    }

    public override getDescription(): string {
        return this.data.description
    }

    public override getTokenizedDescription(elements: ElementDefinitions): IToken {
        const [description] = this.data.createContexts()
        return StoryScript.tokenize(elements, this.data.description, description).root
    }

    public override getDataFactory(): IDatabaseFactory<ISpellData, SpellData> {
        return SpellDocument.DataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<ISpellStorage> {
        return SpellDocument.StorageFactory
    }
}

export default SpellDocument
