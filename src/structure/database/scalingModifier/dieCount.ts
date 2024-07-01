import ScalingModifierBase from '.'
import { ScalingModifierType } from './common'
import { isNumber } from 'utils'
import type { DataPropertyMap } from 'types/database'
import type { IDieCountScalingModifier } from 'types/database/scalingModifier'

class DieCountScalingModifier extends ScalingModifierBase implements IDieCountScalingModifier {
    public readonly type: ScalingModifierType.DieCount
    public readonly dieCount: number

    public constructor(data: Partial<IDieCountScalingModifier>) {
        super(data)
        this.type = data.type ?? DieCountScalingModifier.properties.type.value
        this.dieCount = data.dieCount ?? DieCountScalingModifier.properties.dieCount.value
    }

    public static properties: DataPropertyMap<IDieCountScalingModifier, DieCountScalingModifier> = {
        ...ScalingModifierBase.properties,
        type: {
            value: ScalingModifierType.DieCount,
            validate: (value) => value === ScalingModifierType.DieCount
        },
        dieCount: {
            value: 0,
            validate: (value) => isNumber(value) && value > 0
        }
    }
}

export default DieCountScalingModifier
