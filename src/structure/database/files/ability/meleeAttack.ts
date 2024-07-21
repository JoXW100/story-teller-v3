import { AbilityType } from './common'
import AbilityDataBase from './data'
import { isNumber, isRecord } from 'utils'
import EffectFactory, { simplifyEffectRecord, type Effect } from 'structure/database/effect/factory'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import { getOptionType } from 'structure/optionData'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityMeleeAttackData } from 'types/database/files/ability'

class AbilityMeleeAttackData extends AbilityDataBase implements IAbilityMeleeAttackData {
    public readonly type: AbilityType.MeleeAttack | AbilityType.MeleeWeapon
    public readonly condition: EffectCondition
    public readonly reach: number
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<IAbilityMeleeAttackData>) {
        super(data)
        this.type = data.type ?? AbilityMeleeAttackData.properties.type.value
        this.condition = data.condition !== undefined
            ? EffectConditionFactory.create(data.condition)
            : AbilityMeleeAttackData.properties.condition.value
        this.reach = data.reach ?? AbilityMeleeAttackData.properties.reach.value
        this.effects = AbilityMeleeAttackData.properties.effects.value
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

    public static override properties: DataPropertyMap<IAbilityMeleeAttackData, AbilityMeleeAttackData> = {
        ...AbilityDataBase.properties,
        type: {
            value: AbilityType.MeleeAttack,
            validate: (value) => value === AbilityType.MeleeAttack || value === AbilityType.MeleeWeapon,
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
        effects: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => key.length > 0 && EffectFactory.validate(value)),
            simplify: simplifyEffectRecord
        }
    }
}

export default AbilityMeleeAttackData
