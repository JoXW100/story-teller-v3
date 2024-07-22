import DatabaseFile from '..'
import type SubraceData from './data'
import SubraceDataFactory from './factory'
import StoryScript from 'structure/language/storyscript'
import type { DocumentType } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IToken } from 'types/language'
import type { IDatabaseFactory } from 'types/database'
import type { ISubraceData, ISubraceStorage } from 'types/database/files/subrace'

class SubraceDocument extends DatabaseFile<DocumentType.Subrace, ISubraceStorage, ISubraceData, SubraceData> {
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

    public override getDataFactory(): IDatabaseFactory<ISubraceData, SubraceData> {
        return SubraceDataFactory
    }
}

export default SubraceDocument
