import AreaBase from '.'
import { AreaType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAreaLine } from 'types/database/area'
import { isNumber } from 'utils'

class AreaLine extends AreaBase implements IAreaLine {
    public readonly type: AreaType.Line
    public readonly length: number

    public constructor(data: Simplify<IAreaLine>) {
        super()
        this.type = data.type ?? AreaLine.properties.type.value
        this.length = data.length ?? AreaLine.properties.length.value
    }

    public override readonly icon = 'line'
    public override get text(): string {
        return `${this.length} ft`
    }

    public static properties: DataPropertyMap<IAreaLine, AreaLine> = {
        type: {
            value: AreaType.Line,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        length: {
            value: 0,
            validate: isNumber
        }
    }
}

export default AreaLine
