import DatabaseFile from '..'
import type MapData from './data'
import type MapStorage from './storage'
import { MapDataFactory, MapStorageFactory } from './factory'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { DocumentType } from 'structure/database'
import type { IDatabaseFactory } from 'types/database'
import type { IMapData, IMapStorage } from 'types/database/files/map'
import type { IToken } from 'types/language'

class MapDocument extends DatabaseFile<DocumentType.Map, MapData, MapStorage> {
    public static get DataFactory(): IDatabaseFactory<IMapData, MapData> { return MapDataFactory }
    public static get StorageFactory(): IDatabaseFactory<IMapStorage, MapStorage> { return MapStorageFactory }

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

    public override getDataFactory(): IDatabaseFactory<IMapData, MapData> {
        return MapDocument.DataFactory
    }

    public override getStorageFactory(): IDatabaseFactory<IMapStorage, MapStorage> {
        return MapDocument.StorageFactory
    }
}

export default MapDocument
