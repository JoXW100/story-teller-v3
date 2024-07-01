import DatabaseFile from '..'
import TextDataFactory from './factory'
import type TextData from './data'
import type { DocumentType } from '../..'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { ITextData, ITextStorage } from 'types/database/files/text'
import type { IToken } from 'types/language'

export class TextDocument extends DatabaseFile<DocumentType.Text, ITextStorage, ITextData, TextData> {
    public override getTitle(): string {
        return this.data.title
    }

    public override getTokenizedDescription(elements: ElementDefinitions): IToken {
        const [description] = this.data.createDescriptionContexts(elements)
        return StoryScript.tokenize(elements, this.data.description, description).root
    }

    public override getDataFactory(): IDatabaseFactory<ITextData, TextData> {
        return TextDataFactory
    }
}

export default TextDocument
