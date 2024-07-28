import { ScalingType } from 'structure/dnd'
import EffectConditionBase, { EffectConditionType } from '.'
import { simplifyNumberRecord } from '..'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IEffectConditionHit } from 'types/database/effectCondition'
import type { IProperties } from 'types/editor'

class EffectConditionHit extends EffectConditionBase implements IEffectConditionHit {
    public readonly type: EffectConditionType.Hit
    public readonly scaling: Partial<Record<ScalingType, number>>

    public constructor(data: Simplify<IEffectConditionHit>) {
        super()
        this.type = data.type ?? EffectConditionHit.properties.type.value
        this.scaling = EffectConditionHit.properties.scaling.value
        if (data.scaling !== undefined) {
            for (const type of keysOf(data.scaling)) {
                if (isEnum(type, ScalingType)) {
                    this.scaling[type] = asNumber(data.scaling[type], 0)
                }
            }
        }
    }

    public getModifierValue(stats: IProperties): number {
        return resolveScaling(this.scaling, stats)
    }

    public static properties: DataPropertyMap<IEffectConditionHit, EffectConditionHit> = {
        ...EffectConditionBase.properties,
        type: {
            value: EffectConditionType.Hit,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        scaling: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }
}

export default EffectConditionHit
