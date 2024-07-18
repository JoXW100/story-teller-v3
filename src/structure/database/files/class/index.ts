import DatabaseFile from '..'
import type ClassData from './data'
import ClassDataFactory from './factory'
import StoryScript from 'structure/language/storyscript'
import type { DocumentType } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { IClassData, IClassStorage } from 'types/database/files/class'
import type { IToken } from 'types/language'

class ClassDocument extends DatabaseFile<DocumentType.Class, IClassStorage, IClassData, ClassData> {
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

    public override getDataFactory(): IDatabaseFactory<IClassData, ClassData> {
        return ClassDataFactory
    }
}

export default ClassDocument
