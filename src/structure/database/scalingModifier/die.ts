import ScalingModifierBase from '.'
import { ScalingModifierType } from './common'
import { isEnum } from 'utils'
import { DieType } from 'structure/dice'
import type { DataPropertyMap } from 'types/database'
import type { IDieScalingModifier } from 'types/database/scalingModifier'

class DieScalingModifier extends ScalingModifierBase implements IDieScalingModifier {
    public readonly type: ScalingModifierType.Die
    public readonly die: DieType

    public constructor(data: Partial<IDieScalingModifier>) {
        super(data)
        this.type = data.type ?? DieScalingModifier.properties.type.value
        this.die = data.die ?? DieScalingModifier.properties.die.value
    }

    public static properties: DataPropertyMap<IDieScalingModifier, DieScalingModifier> = {
        ...ScalingModifierBase.properties,
        type: {
            value: ScalingModifierType.Die,
            validate: (value) => value === ScalingModifierType.Die
        },
        die: {
            value: DieType.D20,
            validate: (value) => isEnum(value, DieType)
        }
    }
}

export default DieScalingModifier
