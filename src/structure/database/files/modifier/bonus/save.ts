import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type Modifier from '../modifier'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import { Attribute } from 'structure/dnd'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusSaveData } from 'types/database/files/modifier'

class ModifierBonusSaveData extends ModifierBonusDataBase implements IModifierBonusSaveData {
    public readonly subtype = ModifierBonusType.Save
    public readonly saves: Partial<Record<Attribute, number>>

    public constructor(data: Simplify<IModifierBonusSaveData>) {
        super(data)
        this.saves = ModifierBonusSaveData.properties.saves.value
        if (data.saves !== undefined) {
            for (const save of keysOf(data.saves)) {
                this.saves[save] = data.saves[save]
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
        saves: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, Attribute) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        for (const save of keysOf(this.saves)) {
            modifier.saves[save].subscribe({
                key: key,
                data: this,
                apply: function (value, _, properties, variables): number {
                    const modifier = this.data as ModifierBonusSaveData
                    const varKey = `saves.${save}.bonus`
                    const bonus = variables[varKey] = asNumber(variables[varKey], 0) + resolveScaling(modifier.scaling, properties) * (modifier.saves[save] ?? 0)
                    return value + bonus
                }
            })
        }
    }
}

export default ModifierBonusSaveData
