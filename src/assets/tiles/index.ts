import Water from './water.svg'
import Forest from './forest.svg'

const MapTiles = {
    'water': Water,
    'forest': Forest
} satisfies Record<string, React.FC>

export type MapTileType = keyof typeof MapTiles

export default MapTiles
