import { AbilityType } from './common'
import AbilityDataBase from './data'
import { isNumber, isRecord } from 'utils'
import EffectFactory, { simplifyEffectRecord, type Effect } from 'structure/database/effect/factory'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import { getOptionType } from 'structure/optionData'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityThrownAttackData } from 'types/database/files/ability'

class AbilityThrownAttackData extends AbilityDataBase implements IAbilityThrownAttackData {
    public readonly type: AbilityType.ThrownWeapon
    public readonly condition: EffectCondition
    public readonly reach: number
    public readonly range: number
    public readonly rangeLong: number
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<IAbilityThrownAttackData>) {
        super(data)
        this.type = data.type ?? AbilityThrownAttackData.properties.type.value
        this.condition = data.condition !== undefined
            ? EffectConditionFactory.create(data.condition)
            : AbilityThrownAttackData.properties.condition.value
        this.reach = data.reach ?? AbilityThrownAttackData.properties.reach.value
        this.range = data.range ?? AbilityThrownAttackData.properties.range.value
        this.rangeLong = data.rangeLong ?? AbilityThrownAttackData.properties.rangeLong.value
        this.effects = AbilityThrownAttackData.properties.effects.value
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

    public static override properties: DataPropertyMap<IAbilityThrownAttackData, AbilityThrownAttackData> = {
        ...AbilityDataBase.properties,
        type: {
            value: AbilityType.ThrownWeapon,
            validate: (value) => value === AbilityType.ThrownWeapon,
            simplify: (value) => value
        },
        condition: {
            get value() { return EffectConditionFactory.create({}) },
            validate: EffectConditionFactory.validate,
            simplify: EffectConditionFactory.simplify
        },
        reach: {
            value: 0,
            validate: isNumber
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

export default AbilityThrownAttackData
