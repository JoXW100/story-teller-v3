import { ScalingType } from 'structure/dnd'
import EffectConditionBase, { EffectConditionType } from '.'
import { AutoCalcValue, CalcMode, createCalcValue, simplifyCalcValue, type ICalcValue } from '..'
import { isBoolean, isCalcValue, isEnum } from 'utils'
import { getScalingValue } from 'utils/calculations'
import type { Simplify } from 'types'
import type { ICreatureStats } from 'types/editor'
import type { DataPropertyMap } from 'types/database'
import type { IHitEffectCondition } from 'types/database/effectCondition'

class HitEffectCondition extends EffectConditionBase implements IHitEffectCondition {
    public readonly type: EffectConditionType.Hit
    public readonly scaling: ScalingType
    public readonly proficiency: boolean
    public readonly modifier: ICalcValue

    public constructor(data: Simplify<IHitEffectCondition>) {
        super()
        this.type = data.type ?? HitEffectCondition.properties.type.value
        this.scaling = data.scaling ?? HitEffectCondition.properties.scaling.value
        this.proficiency = data.proficiency ?? HitEffectCondition.properties.proficiency.value
        this.modifier = createCalcValue(data.modifier, HitEffectCondition.properties.modifier.value)
    }

    public getModifierValue(stats: ICreatureStats): number {
        const mod = this.modifier.value ?? 0
        const prof = this.proficiency ? stats.proficiency : 0
        switch (this.modifier.mode) {
            case CalcMode.Modify:
                return getScalingValue(this.scaling, stats) + mod + prof
            case CalcMode.Override:
                return mod + prof
            case CalcMode.Auto:
                return getScalingValue(this.scaling, stats) + prof
        }
    }

    public static properties: DataPropertyMap<IHitEffectCondition, HitEffectCondition> = {
        ...EffectConditionBase.properties,
        type: {
            value: EffectConditionType.Hit,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        scaling: {
            value: ScalingType.None,
            validate: (value) => isEnum(value, ScalingType)
        },
        proficiency: {
            value: false,
            validate: isBoolean
        },
        modifier: {
            value: AutoCalcValue,
            validate: isCalcValue,
            simplify: simplifyCalcValue
        }
    }
}

export default HitEffectCondition
