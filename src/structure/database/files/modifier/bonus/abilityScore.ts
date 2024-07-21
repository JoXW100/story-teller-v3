import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { Attribute } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusAbilityScoreData } from 'types/database/files/modifier'
import { simplifyNumberRecord } from 'structure/database'

class ModifierBonusAbilityScoreData extends ModifierBonusDataBase implements IModifierBonusAbilityScoreData {
    public readonly subtype = ModifierBonusType.AbilityScore
    readonly value: Partial<Record<Attribute, number>>

    public constructor(data: Simplify<IModifierBonusAbilityScoreData>) {
        super(data)
        this.value = ModifierBonusAbilityScoreData.properties.value.value
        if (isRecord(data.value)) {
            for (const key of keysOf(data.value)) {
                if (isEnum(key, Attribute)) {
                    this.value[key] = asNumber(data.value[key], 0)
                }
            }
        }
    }

    public static properties: DataPropertyMap<IModifierBonusAbilityScoreData, ModifierBonusAbilityScoreData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.AbilityScore,
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
            modifier.abilityScores[attr].subscribe({
                key: key,
                target: self,
                data: this,
                apply: function (value): number {
                    return value + ((this.data as ModifierBonusAbilityScoreData).value[attr] ?? 0)
                }
            })
        }
    }
}

export default ModifierBonusAbilityScoreData
