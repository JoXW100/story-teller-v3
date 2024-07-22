import type Modifier from '../modifier'
import ModifierSetDataBase, { ModifierSetType } from '.'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import { MovementType, ScalingType } from 'structure/dnd'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetSpeedData } from 'types/database/files/modifier'

class ModifierSetSpeedData extends ModifierSetDataBase implements IModifierSetSpeedData {
    public override readonly subtype = ModifierSetType.Speed
    public readonly types: Partial<Record<MovementType, number>>
    public readonly scaling: Partial<Record<ScalingType, number>>

    public constructor(data: Simplify<IModifierSetSpeedData>) {
        super(data)
        this.types = ModifierSetSpeedData.properties.types.value
        if (data.types !== undefined) {
            for (const type of keysOf(data.types)) {
                if (isEnum(type, MovementType)) {
                    this.types[type] = asNumber(data.types[type], 0)
                }
            }
        }
        this.scaling = ModifierSetSpeedData.properties.scaling.value
        if (data.scaling !== undefined) {
            for (const type of keysOf(data.scaling)) {
                if (isEnum(type, ScalingType)) {
                    this.scaling[type] = asNumber(data.scaling[type], 0)
                }
            }
        }
    }

    public static properties: DataPropertyMap<IModifierSetSpeedData, ModifierSetSpeedData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.Speed,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        types: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, MovementType) && isNumber(val)),
            simplify: simplifyNumberRecord
        },
        scaling: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        for (const type of keysOf(this.types)) {
            modifier.speeds[type].subscribe({
                key: key,
                data: this,
                apply: function (_, _1, properties, variables): number {
                    const modifier = this.data as ModifierSetSpeedData
                    const value = resolveScaling(modifier.scaling, properties) * (modifier.types[type] ?? 0)
                    return value + asNumber(variables[`speeds.${type}.bonus`], 0)
                }
            })
        }
    }
}

export default ModifierSetSpeedData
