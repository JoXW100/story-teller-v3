import DatabaseFile from '..'
import { CharacterDataFactory, CharacterStorageFactory } from './factory'
import type CharacterData from './data'
import type CharacterStorage from './storage'
import type { DocumentType } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import StoryScript from 'structure/language/storyscript'
import type { IToken } from 'types/language'
import type { IDatabaseFactory } from 'types/database'
import type { ICharacterData, ICharacterStorage } from 'types/database/files/character'

class CharacterDocument extends DatabaseFile<DocumentType.Character, CharacterData, CharacterStorage> {
    public static get DataFactory(): IDatabaseFactory<ICharacterData, CharacterData> { return CharacterDataFactory }
    public static get StorageFactory(): IDatabaseFactory<ICharacterStorage, CharacterStorage> { return CharacterStorageFactory }

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

    public override getDataFactory(): IDatabaseFactory<ICharacterData, CharacterData> {
        return CharacterDataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<ICharacterStorage, CharacterStorage> {
        return CharacterStorageFactory
    }
}

export default CharacterDocument
