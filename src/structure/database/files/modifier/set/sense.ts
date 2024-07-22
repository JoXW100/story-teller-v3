import ModifierSetDataBase, { ModifierSetType } from '.'
import type Modifier from '../modifier'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import { ScalingType, Sense } from 'structure/dnd'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetSenseData } from 'types/database/files/modifier'

class ModifierSetSenseData extends ModifierSetDataBase implements IModifierSetSenseData {
    public override readonly subtype = ModifierSetType.Sense
    public readonly senses: Partial<Record<Sense, number>>
    public readonly scaling: Partial<Record<ScalingType, number>>

    public constructor(data: Simplify<IModifierSetSenseData>) {
        super(data)
        this.senses = ModifierSetSenseData.properties.senses.value
        if (data.senses !== undefined) {
            for (const type of keysOf(data.senses)) {
                if (isEnum(type, Sense)) {
                    this.senses[type] = asNumber(data.senses[type], 0)
                }
            }
        }
        this.scaling = ModifierSetSenseData.properties.scaling.value
        if (data.scaling !== undefined) {
            for (const type of keysOf(data.scaling)) {
                if (isEnum(type, ScalingType)) {
                    this.scaling[type] = asNumber(data.scaling[type], 0)
                }
            }
        }
    }

    public static properties: DataPropertyMap<IModifierSetSenseData, ModifierSetSenseData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.Sense,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        senses: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, Sense) && isNumber(val)),
            simplify: simplifyNumberRecord
        },
        scaling: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        for (const sense of keysOf(this.senses)) {
            modifier.senses[sense].subscribe({
                key: key,
                data: this,
                apply: function (_, _1, properties, variables): number {
                    const modifier = this.data as ModifierSetSenseData
                    const value = resolveScaling(modifier.scaling, properties) * (modifier.senses[sense] ?? 0)
                    return value + asNumber(variables[`senses.${sense}.bonus`], 0)
                }
            })
        }
    }
}

export default ModifierSetSenseData
