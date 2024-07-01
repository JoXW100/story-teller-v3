import AreaBase from '.'
import { AreaType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAreaSphere } from 'types/database/area'
import { isNumber } from 'utils'

class AreaSphere extends AreaBase implements IAreaSphere {
    public readonly type: AreaType.Sphere
    public readonly radius: number

    public constructor(data: Simplify<IAreaSphere>) {
        super()
        this.type = data.type ?? AreaSphere.properties.type.value
        this.radius = data.radius ?? AreaSphere.properties.radius.value
    }

    public override readonly icon = 'sphere'
    public override get text(): string {
        return `${this.radius} ft`
    }

    public static properties: DataPropertyMap<IAreaSphere, AreaSphere> = {
        type: {
            value: AreaType.Sphere,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        radius: {
            value: 0,
            validate: isNumber
        }
    }
}

export default AreaSphere
