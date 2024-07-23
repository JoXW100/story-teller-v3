import ScalingModifierBase from '.'
import { ScalingModifierType } from './common'
import { isCalcValue } from 'utils'
import { createCalcValue, simplifyCalcValue, type CalcValue } from 'structure/database'
import type { DataPropertyMap } from 'types/database'
import type { IModifierScalingModifier } from 'types/database/scalingModifier'

class ModifierScalingModifier extends ScalingModifierBase implements IModifierScalingModifier {
    public readonly type: ScalingModifierType.Modifier
    public readonly modifier: CalcValue

    public constructor(data: Partial<IModifierScalingModifier>) {
        super(data)
        this.type = data.type ?? ModifierScalingModifier.properties.type.value
        this.modifier = data.modifier ?? ModifierScalingModifier.properties.modifier.value
    }

    public static properties: DataPropertyMap<IModifierScalingModifier, ModifierScalingModifier> = {
        ...ScalingModifierBase.properties,
        type: {
            value: ScalingModifierType.Modifier,
            validate: (value) => value === ScalingModifierType.Modifier
        },
        modifier: {
            get value() { return createCalcValue() },
            validate: isCalcValue,
            simplify: simplifyCalcValue
        }
    }
}

export default ModifierScalingModifier
