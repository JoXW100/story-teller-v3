import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { Skill } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusSkillData } from 'types/database/files/modifier'
import { simplifyNumberRecord } from 'structure/database'

class ModifierBonusSkillData extends ModifierBonusDataBase implements IModifierBonusSkillData {
    public readonly subtype = ModifierBonusType.Skill
    readonly value: Partial<Record<Skill, number>>

    public constructor(data: Simplify<IModifierBonusSkillData>) {
        super(data)
        this.value = ModifierBonusSkillData.properties.value.value
        if (isRecord(data.value)) {
            for (const key of keysOf(data.value)) {
                if (isEnum(key, Skill)) {
                    this.value[key] = asNumber(data.value[key], 0)
                }
            }
        }
    }

    public static properties: DataPropertyMap<IModifierBonusSkillData, ModifierBonusSkillData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.Skill,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, Skill) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        for (const skill of keysOf(this.value)) {
            modifier.skills[skill].subscribe({
                key: key,
                target: self,
                data: this,
                apply: function (value): number {
                    return value + ((this.data as ModifierBonusSkillData).value[skill] ?? 0)
                }
            })
        }
    }
}

export default ModifierBonusSkillData
