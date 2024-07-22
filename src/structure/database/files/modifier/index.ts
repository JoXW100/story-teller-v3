import DatabaseFile from '..'
import ModifierDataFactory, { type ModifierData } from './factory'
import type Modifier from './modifier'
import StoryScript from 'structure/language/storyscript'
import type { DocumentType } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { IModifierData, IModifierStorage } from 'types/database/files/modifier'
import type { IToken } from 'types/language'

class ModifierDocument extends DatabaseFile<DocumentType.Modifier, IModifierStorage, IModifierData, ModifierData> {
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

    public override getDataFactory(): IDatabaseFactory<IModifierData, ModifierData> {
        return ModifierDataFactory
    }

    public apply(modifier: Modifier, key: string): void {
        this.data.apply(modifier, key)
    }
}

export default ModifierDocument
