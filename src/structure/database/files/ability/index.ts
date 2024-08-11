import type { IAbilityData, IAbilityStorage } from 'types/database/files/ability'
import DatabaseFile from '..'
import AbilityDataFactory, { type AbilityData } from './factory'
import StoryScript from 'structure/language/storyscript'
import { EmptyDatabaseFactory, type DocumentType } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { IToken } from 'types/language'

class AbilityDocument extends DatabaseFile<DocumentType.Ability, AbilityData> {
    public static get DataFactory(): IDatabaseFactory<IAbilityData, AbilityData> { return AbilityDataFactory }
    public static get StorageFactory(): IDatabaseFactory<IAbilityStorage> { return EmptyDatabaseFactory }

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

    public override getDataFactory(): IDatabaseFactory<IAbilityData, AbilityData> {
        return AbilityDocument.DataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<IAbilityStorage> {
        return AbilityDocument.StorageFactory
    }
}

export default AbilityDocument
