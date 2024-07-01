import AreaBase from '.'
import { AreaType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAreaCube } from 'types/database/area'
import { isNumber } from 'utils'

class AreaCube extends AreaBase implements IAreaCube {
    public readonly type: AreaType.Cube
    public readonly side: number

    public constructor(data: Simplify<IAreaCube>) {
        super()
        this.type = data.type ?? AreaCube.properties.type.value
        this.side = data.side ?? AreaCube.properties.side.value
    }

    public override readonly icon = 'cube'
    public override get text(): string {
        return `${this.side} ft`
    }

    public static properties: DataPropertyMap<IAreaCube, AreaCube> = {
        type: {
            value: AreaType.Cube,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        side: {
            value: 0,
            validate: isNumber
        }
    }
}

export default AreaCube
