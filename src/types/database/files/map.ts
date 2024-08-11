import type { IDatabaseFileData, IDatabaseFileStorage } from '..'
import type { MapTileType } from 'assets/tiles'

export interface IMapData extends IDatabaseFileData {
    readonly name: string
    readonly description: string
    readonly sizeX: number
    readonly sizeY: number
}

export interface IMapTileData extends IDatabaseFileStorage {
    readonly type: MapTileType
}

export interface IMapStorage {
    tiles: Record<number, IMapTileData>
}
