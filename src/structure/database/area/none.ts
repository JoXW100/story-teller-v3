import AreaBase from '.'
import { AreaType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAreaNone } from 'types/database/area'

class AreaNone extends AreaBase implements IAreaNone {
    public readonly type: AreaType.None

    public constructor(data: Simplify<IAreaNone>) {
        super()
        this.type = data.type ?? AreaNone.properties.type.value
    }

    public override readonly icon = null
    public override readonly text = ''

    public static properties: DataPropertyMap<IAreaNone, AreaNone> = {
        type: {
            value: AreaType.None,
            validate: (value) => value === this.properties.type.value
        }
    }
}

export default AreaNone
