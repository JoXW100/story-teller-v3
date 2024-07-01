import AreaBase from '.'
import { AreaType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAreaRectangle } from 'types/database/area'
import { isNumber } from 'utils'

class AreaRectangle extends AreaBase implements IAreaRectangle {
    public readonly type: AreaType.Rectangle
    public readonly width: number
    public readonly length: number

    public constructor(data: Simplify<IAreaRectangle>) {
        super()
        this.type = data.type ?? AreaRectangle.properties.type.value
        this.width = data.width ?? AreaRectangle.properties.width.value
        this.length = data.length ?? AreaRectangle.properties.length.value
    }

    public override readonly icon = 'cube'
    public override get text(): string {
        return `${this.width}x${length} ft`
    }

    public static properties: DataPropertyMap<IAreaRectangle, AreaRectangle> = {
        type: {
            value: AreaType.Rectangle,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        width: {
            value: 0,
            validate: isNumber
        },
        length: {
            value: 0,
            validate: isNumber
        }
    }
}

export default AreaRectangle
