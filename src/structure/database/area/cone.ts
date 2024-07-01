import AreaBase from '.'
import { AreaType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAreaCone } from 'types/database/area'
import { isNumber } from 'utils'

class AreaCone extends AreaBase implements IAreaCone {
    public readonly type: AreaType.Cone
    public readonly side: number

    public constructor(data: Simplify<IAreaCone>) {
        super()
        this.type = data.type ?? AreaCone.properties.type.value
        this.side = data.side ?? AreaCone.properties.side.value
    }

    public override readonly icon = 'cone'
    public override get text(): string {
        return `${this.side} ft`
    }

    public static properties: DataPropertyMap<IAreaCone, AreaCone> = {
        type: {
            value: AreaType.Cone,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        side: {
            value: 0,
            validate: isNumber
        }
    }
}

export default AreaCone
