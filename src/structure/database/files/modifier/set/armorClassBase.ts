import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { Attribute } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetArmorClassBaseData } from 'types/database/files/modifier'
import { simplifyNumberRecord } from '../../creature/data'
import { getAttributeModifier } from 'utils/calculations'

class ModifierSetArmorClassBaseData extends ModifierSetDataBase implements IModifierSetArmorClassBaseData {
    public override readonly subtype = ModifierSetType.ArmorClassBase
    public readonly values: Partial<Record<Attribute, number>>
    public readonly maxValues: Partial<Record<Attribute, number>>
    public readonly bonus: number

    public constructor(data: Simplify<IModifierSetArmorClassBaseData>) {
        super(data)
        this.values = data.values ?? ModifierSetArmorClassBaseData.properties.values.value
        this.maxValues = data.maxValues ?? ModifierSetArmorClassBaseData.properties.maxValues.value
        this.bonus = data.bonus ?? ModifierSetArmorClassBaseData.properties.bonus.value
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
            validate: (value) => isRecord(value, (key, val) => isEnum(key, Attribute) && isNumber(val)),
            simplify: simplifyNumberRecord
        },
        maxValues: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, Attribute) && isNumber(val)),
            simplify: simplifyNumberRecord
        },
        bonus: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.ac.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (_, _1, properties, variables): number {
                const modifier = this.data as ModifierSetArmorClassBaseData
                const bonus = asNumber(variables['ac.bonus'], 0) + modifier.bonus
                let sum = 10
                for (const attr of keysOf(modifier.values)) {
                    const value = getAttributeModifier(properties, attr) * modifier.values[attr]!
                    sum += attr in modifier.maxValues ? Math.min(value, modifier.maxValues[attr]!) : value
                }
                return sum + bonus
            }
        })
    }
}

export default ModifierSetArmorClassBaseData
