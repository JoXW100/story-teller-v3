import { AbilityType } from './common'
import AbilityDataBase from './data'
import { isNumber, isRecord } from 'utils'
import type { EffectCondition } from 'structure/database/effectCondition'
import EffectFactory, { simplifyEffectRecord, type Effect } from 'structure/database/effect/factory'
import EffectConditionFactory from 'structure/database/effectCondition/factory'
import { getOptionType } from 'structure/optionData'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityRangedAttackData } from 'types/database/files/ability'

class AbilityRangedAttackData extends AbilityDataBase implements IAbilityRangedAttackData {
    public readonly type: AbilityType.RangedAttack | AbilityType.RangedWeapon
    public readonly condition: EffectCondition
    public readonly range: number
    public readonly rangeLong: number
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<IAbilityRangedAttackData>) {
        super(data)
        this.type = data.type ?? AbilityRangedAttackData.properties.type.value
        this.condition = data.condition !== undefined
            ? EffectConditionFactory.create(data.condition)
            : AbilityRangedAttackData.properties.condition.value
        this.range = data.range ?? AbilityRangedAttackData.properties.range.value
        this.rangeLong = data.rangeLong ?? AbilityRangedAttackData.properties.rangeLong.value
        this.effects = AbilityRangedAttackData.properties.effects.value
        if (isRecord(data.effects)) {
            for (const key of Object.keys(data.effects)) {
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

    public static override properties: DataPropertyMap<IAbilityRangedAttackData, AbilityRangedAttackData> = {
        ...AbilityDataBase.properties,
        type: {
            value: AbilityType.RangedAttack,
            validate: (value) => value === AbilityType.RangedAttack || value === AbilityType.RangedWeapon,
            simplify: (value) => value
        },
        condition: {
            get value() { return EffectConditionFactory.create({}) },
            validate: EffectConditionFactory.validate,
            simplify: EffectConditionFactory.simplify
        },
        range: {
            value: 0,
            validate: isNumber
        },
        rangeLong: {
            value: 0,
            validate: isNumber
        },
        effects: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => key.length > 0 && EffectFactory.validate(value)),
            simplify: simplifyEffectRecord
        }
    }
}

export default AbilityRangedAttackData
