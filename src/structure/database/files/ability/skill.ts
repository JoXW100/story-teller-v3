import { AbilityType } from './common'
import AbilityDataBase from './data'
import { isRecord, keysOf } from 'utils'
import EffectFactory, { simplifyEffectRecord, type Effect } from 'structure/database/effect/factory'
import { getOptionType } from 'structure/optionData'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilitySkillData } from 'types/database/files/ability'

class AbilitySkillData extends AbilityDataBase implements IAbilitySkillData {
    public readonly type = AbilityType.Skill
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<IAbilitySkillData>) {
        super(data)
        this.effects = AbilitySkillData.properties.effects.value
        if (isRecord(data.effects)) {
            for (const key of keysOf(data.effects)) {
                const effect = data.effects[key]
                if (effect !== undefined) {
                    this.effects[key] = EffectFactory.create(effect)
                }
            }
        }
    }

    public get typeName(): string {
        return getOptionType('abilityType').options[this.type]
    }

    public static override properties: DataPropertyMap<IAbilitySkillData, AbilitySkillData> = {
        ...AbilityDataBase.properties,
        type: {
            value: AbilityType.Skill,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        effects: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => key.length > 0 && EffectFactory.validate(value)),
            simplify: simplifyEffectRecord
        }
    }
}

export default AbilitySkillData
