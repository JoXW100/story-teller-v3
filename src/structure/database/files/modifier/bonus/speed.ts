import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type Modifier from '../modifier'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { MovementType } from 'structure/dnd'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusSpeedData } from 'types/database/files/modifier'
import { resolveScaling } from 'utils/calculations'

class ModifierBonusSpeedData extends ModifierBonusDataBase implements IModifierBonusSpeedData {
    public readonly subtype = ModifierBonusType.Speed
    public readonly types: Partial<Record<MovementType, number>>

    public constructor(data: Simplify<IModifierBonusSpeedData>) {
        super(data)
        this.types = ModifierBonusSpeedData.properties.types.value
        if (data.types !== undefined) {
            for (const type of keysOf(data.types)) {
                this.types[type] = data.types[type]
            }
        }
    }

    public static properties: DataPropertyMap<IModifierBonusSpeedData, ModifierBonusSpeedData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.Speed,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        types: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, MovementType) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        for (const type of keysOf(this.types)) {
            modifier.speeds[type].subscribe({
                key: key,
                data: this,
                apply: function (value, _, properties, variables): number {
                    const modifier = this.data as ModifierBonusSpeedData
                    const varKey = `speeds.${type}.bonus`
                    const bonus = variables[varKey] = asNumber(variables[varKey], 0) + resolveScaling(modifier.scaling, properties) * (modifier.types[type] ?? 0)
                    return value + bonus
                }
            })
        }
    }
}

export default ModifierBonusSpeedData
