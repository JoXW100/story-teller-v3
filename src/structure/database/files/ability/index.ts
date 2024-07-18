import type { IAbilityData, IAbilityStorage } from 'types/database/files/ability'
import DatabaseFile from '..'
import AbilityDataFactory, { type AbilityData } from './factory'
import StoryScript from 'structure/language/storyscript'
import type { DocumentType } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { IToken } from 'types/language'

class AbilityDocument extends DatabaseFile<DocumentType.Ability, IAbilityStorage, IAbilityData, AbilityData> {
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

    public override getDataFactory(): IDatabaseFactory<IAbilityData, AbilityData> {
        return AbilityDataFactory
    }
}

export default AbilityDocument
