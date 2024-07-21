import { ScalingType, Skill } from 'structure/dnd'
import EffectConditionBase, { EffectConditionType } from '.'
import { simplifyNumberRecord } from '..'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IEffectConditionCheck } from 'types/database/effectCondition'
import type { IConditionProperties } from 'types/database/condition'

export class EffectConditionCheck extends EffectConditionBase implements IEffectConditionCheck {
    public readonly type: EffectConditionType.Check
    public readonly skill: Skill
    public readonly scaling: Partial<Record<ScalingType, number>>

    public constructor(data: Simplify<IEffectConditionCheck>) {
        super()
        this.type = data.type ?? EffectConditionCheck.properties.type.value
        this.skill = data.skill ?? EffectConditionCheck.properties.skill.value
        this.scaling = EffectConditionCheck.properties.scaling.value
        if (data.scaling !== undefined) {
            for (const type of keysOf(data.scaling)) {
                if (isEnum(type, ScalingType)) {
                    this.scaling[type] = asNumber(data.scaling[type], 0)
                }
            }
        }
    }

    public getModifierValue(stats: Partial<IConditionProperties>): number {
        return 8 + resolveScaling(this.scaling, stats)
    }

    public static properties: DataPropertyMap<IEffectConditionCheck, EffectConditionCheck> = {
        ...EffectConditionBase.properties,
        type: {
            value: EffectConditionType.Check,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        skill: {
            value: Skill.Acrobatics,
            validate: (value) => isEnum(value, Skill)
        },
        scaling: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }
}

export default EffectConditionCheck
