import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type Modifier from '../modifier'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import { Skill } from 'structure/dnd'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusSkillData } from 'types/database/files/modifier'

class ModifierBonusSkillData extends ModifierBonusDataBase implements IModifierBonusSkillData {
    public readonly subtype = ModifierBonusType.Skill
    public readonly skills: Partial<Record<Skill, number>>

    public constructor(data: Simplify<IModifierBonusSkillData>) {
        super(data)
        this.skills = ModifierBonusSkillData.properties.skills.value
        if (data.skills !== undefined) {
            for (const skill of keysOf(data.skills)) {
                this.skills[skill] = data.skills[skill]
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
        skills: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, Skill) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        for (const skill of keysOf(this.skills)) {
            modifier.skills[skill].subscribe({
                key: key,
                data: this,
                apply: function (value, _, properties, variables): number {
                    const modifier = this.data as ModifierBonusSkillData
                    const varKey = `skills.${skill}.bonus`
                    const bonus = variables[varKey] = asNumber(variables[varKey], 0) + resolveScaling(modifier.scaling, properties) * (modifier.skills[skill] ?? 0)
                    return value + bonus
                }
            })
        }
    }
}

export default ModifierBonusSkillData
