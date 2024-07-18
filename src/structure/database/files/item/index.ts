import DatabaseFile from '..'
import ItemDataFactory, { type ItemData } from './factory'
import type { DocumentType } from '../..'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { IDatabaseFactory } from 'types/database'
import type { IItemData, IItemStorage } from 'types/database/files/item'
import type { IToken } from 'types/language'

export class ItemDocument extends DatabaseFile<DocumentType.Item, IItemStorage, IItemData, ItemData> {
    public static get Factory(): IDatabaseFactory<IItemData, ItemData> { return ItemDataFactory }

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

    public override getDataFactory(): IDatabaseFactory<IItemData, ItemData> {
        return ItemDataFactory
    }
}

export default ItemDocument
