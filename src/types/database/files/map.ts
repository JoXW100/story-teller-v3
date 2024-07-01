import type { MapTileType } from 'assets/tiles'

export interface IMapData {
    readonly name: string
    readonly description: string
    readonly sizeX: number
    readonly sizeY: number
}

export interface IMapTileData {
    readonly type: MapTileType
}

export interface IMapStorage {
    tiles: Record<number, IMapTileData>
}
