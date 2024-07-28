import { Attribute, ScalingType } from 'structure/dnd'
import EffectConditionBase, { EffectConditionType } from '.'
import { simplifyNumberRecord } from '..'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IEffectConditionSave } from 'types/database/effectCondition'
import type { IProperties } from 'types/editor'

export class EffectConditionSave extends EffectConditionBase implements IEffectConditionSave {
    public readonly type: EffectConditionType.Save
    public readonly attribute: Attribute
    public readonly scaling: Partial<Record<ScalingType, number>>

    public constructor(data: Simplify<IEffectConditionSave>) {
        super()
        this.type = data.type ?? EffectConditionSave.properties.type.value
        this.attribute = data.attribute ?? EffectConditionSave.properties.attribute.value
        this.scaling = EffectConditionSave.properties.scaling.value
        if (data.scaling !== undefined) {
            for (const type of keysOf(data.scaling)) {
                if (isEnum(type, ScalingType)) {
                    this.scaling[type] = asNumber(data.scaling[type], 0)
                }
            }
        }
    }

    public getModifierValue(stats: IProperties): number {
        return 8 + resolveScaling(this.scaling, stats)
    }

    public static properties: DataPropertyMap<IEffectConditionSave, EffectConditionSave> = {
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
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }
}

export default EffectConditionSave
