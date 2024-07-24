import { isKeyOf, isRecord, keysOf } from 'utils'
import MapTiles from 'assets/tiles'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IMapStorage, IMapTileData } from 'types/database/files/map'

export function createTile(data: Simplify<IMapTileData> = {}): IMapTileData {
    return { type: data.type ?? 'water' } satisfies IMapTileData
}

export function isTile(data: unknown): data is IMapTileData {
    return isRecord(data) && 'type' in data && isKeyOf(data.type, MapTiles)
}

export function simplifyTileRecord(data: Record<number, IMapTileData>): Simplify<Record<number, IMapTileData>> | null {
    const result: Simplify<Record<number, IMapTileData>> = {}
    let flag = false
    for (const index of keysOf(data)) {
        if (data[index].type !== 'water') {
            result[index] = data[index]
            flag = true
        }
    }
    return flag ? result : null
}

class MapStorage implements IMapStorage {
    public readonly tiles: Record<number, IMapTileData>

    public constructor(data: Simplify<IMapStorage>) {
        this.tiles = MapStorage.properties.tiles.value
        if (data.tiles !== undefined) {
            for (const index of keysOf(data.tiles)) {
                this.tiles[index] = createTile(data.tiles[index])
            }
        }
    }

    public static properties: DataPropertyMap<IMapStorage, MapStorage> = {
        tiles: {
            get value() { return {} },
            validate: (value) => isRecord(value, (_, val) => isTile(val)),
            simplify: simplifyTileRecord
        }
    }
}

export default MapStorage
