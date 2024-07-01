import { Attribute, ScalingType } from 'structure/dnd'
import EffectConditionBase, { EffectConditionType } from '.'
import { AutoCalcValue, CalcMode, createCalcValue, simplifyCalcValue, type ICalcValue } from '..'
import { isBoolean, isCalcValue, isEnum } from 'utils'
import { getScalingValue } from 'utils/calculations'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISaveEffectCondition } from 'types/database/effectCondition'
import type { ICreatureStats } from 'types/editor'

export class SaveEffectCondition extends EffectConditionBase implements ISaveEffectCondition {
    public readonly type: EffectConditionType.Save
    public readonly attribute: Attribute
    public readonly scaling: ScalingType
    public readonly proficiency: boolean
    public readonly modifier: ICalcValue

    public constructor(data: Simplify<ISaveEffectCondition>) {
        super()
        this.type = data.type ?? SaveEffectCondition.properties.type.value
        this.attribute = data.attribute ?? SaveEffectCondition.properties.attribute.value
        this.scaling = data.scaling ?? SaveEffectCondition.properties.scaling.value
        this.proficiency = data.proficiency ?? SaveEffectCondition.properties.proficiency.value
        this.modifier = createCalcValue(data.modifier, SaveEffectCondition.properties.modifier.value)
    }

    public getModifierValue(stats: ICreatureStats): number {
        const mod = this.modifier.value ?? 0
        const prof = this.proficiency ? stats.proficiency : 0
        switch (this.modifier.mode) {
            case CalcMode.Modify:
                return getScalingValue(this.scaling, stats) + mod + prof + 8
            case CalcMode.Override:
                return mod + prof
            case CalcMode.Auto:
                return getScalingValue(this.scaling, stats) + prof + 8
        }
    }

    public static properties: DataPropertyMap<ISaveEffectCondition, SaveEffectCondition> = {
        ...EffectConditionBase.properties,
        type: {
            value: EffectConditionType.Save,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        attribute: {
            value: Attribute.STR,
            validate: (value) => isEnum(value, Attribute)
        },
        scaling: {
            value: ScalingType.None,
            validate: (value) => isEnum(value, ScalingType)
        },
        proficiency: {
            value: false,
            validate: (value) => isBoolean(value)
        },
        modifier: {
            get value() { return { ...AutoCalcValue } },
            validate: (value) => isCalcValue(value),
            simplify: simplifyCalcValue
        }
    }
}

export default SaveEffectCondition
