import AreaBase from '.'
import { AreaType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAreaCylinder } from 'types/database/area'
import { isNumber } from 'utils'

class AreaCylinder extends AreaBase implements IAreaCylinder {
    public readonly type: AreaType.Cylinder
    public readonly radius: number
    public readonly height: number

    public constructor(data: Simplify<IAreaCylinder>) {
        super()
        this.type = data.type ?? AreaCylinder.properties.type.value
        this.radius = data.radius ?? AreaCylinder.properties.radius.value
        this.height = data.height ?? AreaCylinder.properties.height.value
    }

    public override readonly icon = 'cylinder'
    public override get text(): string {
        return `${this.radius}x${this.height} ft`
    }

    public static properties: DataPropertyMap<IAreaCylinder, AreaCylinder> = {
        type: {
            value: AreaType.Cylinder,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        radius: {
            value: 0,
            validate: isNumber
        },
        height: {
            value: 0,
            validate: isNumber
        }
    }
}

export default AreaCylinder
