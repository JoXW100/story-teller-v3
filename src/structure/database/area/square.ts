import AreaBase from '.'
import { AreaType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAreaSquare } from 'types/database/area'
import { isNumber } from 'utils'

class AreaSquare extends AreaBase implements IAreaSquare {
    public readonly type: AreaType.Square
    public readonly side: number

    public constructor(data: Simplify<IAreaSquare>) {
        super()
        this.type = data.type ?? AreaSquare.properties.type.value
        this.side = data.side ?? AreaSquare.properties.side.value
    }

    public override readonly icon = 'square'
    public override get text(): string {
        return `${this.side} ft`
    }

    public static properties: DataPropertyMap<IAreaSquare, AreaSquare> = {
        type: {
            value: AreaType.Square,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        side: {
            value: 0,
            validate: isNumber
        }
    }
}

export default AreaSquare
