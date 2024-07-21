import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { Attribute } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusSaveData } from 'types/database/files/modifier'
import { simplifyNumberRecord } from 'structure/database'

class ModifierBonusSaveData extends ModifierBonusDataBase implements IModifierBonusSaveData {
    public readonly subtype = ModifierBonusType.Save
    readonly value: Partial<Record<Attribute, number>>

    public constructor(data: Simplify<IModifierBonusSaveData>) {
        super(data)
        this.value = ModifierBonusSaveData.properties.value.value
        if (isRecord(data.value)) {
            for (const key of keysOf(data.value)) {
                if (isEnum(key, Attribute)) {
                    this.value[key] = asNumber(data.value[key], 0)
                }
            }
        }
    }

    public static properties: DataPropertyMap<IModifierBonusSaveData, ModifierBonusSaveData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.Save,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, Attribute) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        for (const attr of keysOf(this.value)) {
            modifier.saves[attr].subscribe({
                key: key,
                target: self,
                data: this,
                apply: function (value): number {
                    return value + ((this.data as ModifierBonusSaveData).value[attr] ?? 0)
                }
            })
        }
    }
}

export default ModifierBonusSaveData
