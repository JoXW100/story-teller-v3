import DatabaseFile from '..'
import SpellDataFactory, { type SpellData } from './factory'
import type { DocumentType } from 'structure/database'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { ISpellData, ISpellStorage } from 'types/database/files/spell'
import type { IToken } from 'types/language'

export class SpellDocument extends DatabaseFile<DocumentType.Spell, ISpellStorage, ISpellData, SpellData> {
    public override getTitle(): string {
        return this.data.name
    }

    public override getTokenizedDescription(elements: ElementDefinitions): IToken {
        const [description] = this.data.createContexts(elements)
        return StoryScript.tokenize(elements, this.data.description, description).root
    }

    public override getDataFactory(): IDatabaseFactory<ISpellData, SpellData> {
        return SpellDataFactory
    }
}

export default SpellDocument
