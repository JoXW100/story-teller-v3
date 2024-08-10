import { isNumber, isString } from 'utils'
import EmptyToken from 'structure/language/tokens/empty'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { DataPropertyMap } from 'types/database'
import type { Simplify } from 'types'
import type { IMapData } from 'types/database/files/map'
import type { TokenContext } from 'types/language'

class MapData implements IMapData {
    public readonly name: string
    public readonly description: string
    public readonly sizeX: number
    public readonly sizeY: number

    public constructor(data: Simplify<IMapData>) {
        this.name = data.name ?? MapData.properties.name.value
        this.description = data.description ?? MapData.properties.description.value
        this.sizeX = data.sizeX ?? MapData.properties.sizeX.value
        this.sizeY = data.sizeY ?? MapData.properties.sizeY.value
    }

    public static properties: DataPropertyMap<IMapData, MapData> = {
        name: {
            value: '',
            validate: isString
        },
        description: {
            value: '',
            validate: isString
        },
        sizeX: {
            value: 0,
            validate: isNumber,
            simplify: (value) => value === this.properties.sizeX.value ? null : Math.floor(value)
        },
        sizeY: {
            value: 0,
            validate: isNumber,
            simplify: (value) => value === this.properties.sizeY.value ? null : Math.floor(value)
        }
    }

    public createContexts(elements: ElementDefinitions): [TokenContext] {
        const descriptionContext = {
            title: new EmptyToken(this.name),
            name: new EmptyToken(this.name)
        }
        return [descriptionContext]
    }
}

export default MapData
