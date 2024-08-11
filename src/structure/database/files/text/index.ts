import DatabaseFile from '..'
import TextDataFactory from './factory'
import type TextData from './data'
import { type DocumentType, EmptyDatabaseFactory } from '../..'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { ITextData, ITextStorage } from 'types/database/files/text'
import type { IToken } from 'types/language'

export class TextDocument extends DatabaseFile<DocumentType.Text, TextData> {
    public static get DataFactory(): IDatabaseFactory<ITextData, TextData> { return TextDataFactory }
    public static get StorageFactory(): IDatabaseFactory<ITextStorage> { return EmptyDatabaseFactory }

    public override getTitle(): string {
        return this.data.title
    }

    public override getDescription(): string {
        return this.data.description
    }

    public override getTokenizedDescription(elements: ElementDefinitions): IToken {
        const [description] = this.data.createContexts(elements)
        return StoryScript.tokenize(elements, this.data.description, description).root
    }

    public override getDataFactory(): IDatabaseFactory<ITextData, TextData> {
        return TextDocument.DataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<ITextStorage> {
        return TextDocument.StorageFactory
    }
}

export default TextDocument
