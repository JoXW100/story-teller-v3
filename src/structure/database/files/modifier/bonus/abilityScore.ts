import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type Modifier from '../modifier'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import { Attribute } from 'structure/dnd'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusAbilityScoreData } from 'types/database/files/modifier'

class ModifierBonusAbilityScoreData extends ModifierBonusDataBase implements IModifierBonusAbilityScoreData {
    public readonly subtype = ModifierBonusType.AbilityScore
    public readonly attributes: Partial<Record<Attribute, number>>

    public constructor(data: Simplify<IModifierBonusAbilityScoreData>) {
        super(data)
        this.attributes = ModifierBonusAbilityScoreData.properties.attributes.value
        if (data.attributes !== undefined) {
            for (const attribute of keysOf(data.attributes)) {
                this.attributes[attribute] = data.attributes[attribute]
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
        attributes: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, Attribute) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        for (const attribute of keysOf(this.attributes)) {
            modifier.abilityScores[attribute].subscribe({
                key: key,
                data: this,
                apply: function (value, _, properties, variables): number {
                    const modifier = this.data as ModifierBonusAbilityScoreData
                    const varKey = `attributes.${attribute}.bonus`
                    const bonus = variables[varKey] = asNumber(variables[varKey], 0) + resolveScaling(modifier.scaling, properties) * (modifier.attributes[attribute] ?? 0)
                    return value + bonus
                }
            })
        }
    }
}

export default ModifierBonusAbilityScoreData
