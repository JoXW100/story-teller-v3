import DatabaseFile from '..'
import CharacterDataFactory from './factory'
import type CharacterData from './data'
import type { DocumentType } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import StoryScript from 'structure/language/storyscript'
import type { IDatabaseFactory } from 'types/database'
import type { ICharacterData, ICharacterStorage } from 'types/database/files/character'
import type { IToken } from 'types/language'

class CharacterDocument extends DatabaseFile<DocumentType.Character, ICharacterStorage, ICharacterData, CharacterData> {
    public override getTitle(): string {
        return this.data.name
    }

    public override getTokenizedDescription(elements: ElementDefinitions): IToken {
        const [description] = this.data.createContexts(elements)
        return StoryScript.tokenize(elements, this.data.description, description).root
    }

    public override getDataFactory(): IDatabaseFactory<ICharacterData, CharacterData> {
        return CharacterDataFactory
    }
}

export default CharacterDocument
