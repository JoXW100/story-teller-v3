import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { getScalingValue } from 'utils/calculations'
import { ScalingType } from 'structure/dnd'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetArmorClassBaseData } from 'types/database/files/modifier'

class ModifierSetArmorClassBaseData extends ModifierSetDataBase implements IModifierSetArmorClassBaseData {
    public override readonly subtype = ModifierSetType.ArmorClassBase
    public readonly values: Partial<Record<ScalingType, number>>
    public readonly maxValues: Partial<Record<ScalingType, number>>

    public constructor(data: Simplify<IModifierSetArmorClassBaseData>) {
        super(data)
        this.values = data.values ?? ModifierSetArmorClassBaseData.properties.values.value
        this.maxValues = data.maxValues ?? ModifierSetArmorClassBaseData.properties.maxValues.value
    }

    public static properties: DataPropertyMap<IModifierSetArmorClassBaseData, ModifierSetArmorClassBaseData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.ArmorClassBase,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        values: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        },
        maxValues: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.ac.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (_, _1, properties, variables): number {
                const modifier = this.data as ModifierSetArmorClassBaseData
                const bonus = asNumber(variables['ac.bonus'], 0)
                let sum = 10
                for (const attr of keysOf(modifier.values)) {
                    const value = getScalingValue(attr, properties) * modifier.values[attr]!
                    sum += attr in modifier.maxValues ? Math.min(value, modifier.maxValues[attr]!) : value
                }
                return sum + bonus
            }
        })
    }
}

export default ModifierSetArmorClassBaseData
