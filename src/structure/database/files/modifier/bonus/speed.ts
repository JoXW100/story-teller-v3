import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { isEnum, isNumber, isRecord, keysOf } from 'utils'
import { MovementType } from 'structure/dnd'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusSpeedData } from 'types/database/files/modifier'

class ModifierBonusSpeedData extends ModifierBonusDataBase implements IModifierBonusSpeedData {
    public readonly subtype = ModifierBonusType.Speed
    public readonly value: Partial<Record<MovementType, number>>

    public constructor(data: Simplify<IModifierBonusSpeedData>) {
        super(data)
        if (ModifierBonusSpeedData.properties.value.validate(data.value)) {
            this.value = data.value!
        } else {
            this.value = ModifierBonusSpeedData.properties.value.value
        }
    }

    public static properties: DataPropertyMap<IModifierBonusSpeedData, ModifierBonusSpeedData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.Speed,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, MovementType) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.speed.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value, _, _p, variables): Partial<Record<MovementType, number>> {
                const modifier = this.data as ModifierBonusSpeedData
                const result = { ...value }
                for (const type of keysOf(modifier.value)) {
                    const value = modifier.value[type]!
                    const bonus = Number(variables[`speed.${type}.bonus`] ?? 0) + value
                    if (type in result) {
                        result[type] = result[type]! + bonus
                    }
                    variables[`speed.${type}.bonus`] = bonus
                }
                return result
            }
        })
    }
}

export default ModifierBonusSpeedData
