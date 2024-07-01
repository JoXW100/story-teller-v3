import AreaBase from '.'
import { AreaType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAreaCuboid } from 'types/database/area'
import { isNumber } from 'utils'

class AreaCuboid extends AreaBase implements IAreaCuboid {
    public readonly type: AreaType.Cuboid
    public readonly width: number
    public readonly height: number
    public readonly length: number

    public constructor(data: Simplify<IAreaCuboid>) {
        super()
        this.type = data.type ?? AreaCuboid.properties.type.value
        this.width = data.width ?? AreaCuboid.properties.width.value
        this.height = data.height ?? AreaCuboid.properties.height.value
        this.length = data.length ?? AreaCuboid.properties.length.value
    }

    public override readonly icon = 'cube'
    public override get text(): string {
        return `${this.width}x${this.height}x${this.length} ft`
    }

    public static properties: DataPropertyMap<IAreaCuboid, AreaCuboid> = {
        type: {
            value: AreaType.Cuboid,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        width: {
            value: 0,
            validate: isNumber
        },
        height: {
            value: 0,
            validate: isNumber
        },
        length: {
            value: 0,
            validate: isNumber
        }
    }
}

export default AreaCuboid
