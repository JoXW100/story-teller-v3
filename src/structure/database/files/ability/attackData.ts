import { AbilityType } from './common'
import AbilityDataBase from './data'
import { isEnum, isNumber, isRecord, keysOf } from 'utils'
import { TargetType } from 'structure/dnd'
import EffectFactory, { simplifyEffectRecord, type Effect } from 'structure/database/effect/factory'
import type { EffectCondition } from 'structure/database/effectCondition'
import EffectConditionFactory from 'structure/database/effectCondition/factory'
import { getOptionType } from 'structure/optionData'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityAttackData } from 'types/database/files/ability'

class AbilityAttackData extends AbilityDataBase implements IAbilityAttackData {
    public readonly type: AbilityType.Attack
    public readonly condition: EffectCondition
    public readonly target: TargetType
    public readonly range: number
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<IAbilityAttackData>) {
        super(data)
        this.type = data.type ?? AbilityAttackData.properties.type.value
        this.condition = data.condition !== undefined
            ? EffectConditionFactory.create(data.condition)
            : AbilityAttackData.properties.condition.value
        this.target = data.target ?? AbilityAttackData.properties.target.value
        this.range = data.range ?? AbilityAttackData.properties.range.value
        this.effects = AbilityAttackData.properties.effects.value
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

    public static override properties: DataPropertyMap<IAbilityAttackData, AbilityAttackData> = {
        ...AbilityDataBase.properties,
        type: {
            value: AbilityType.Attack,
            validate: (value) => value === AbilityType.MeleeAttack || value === AbilityType.MeleeWeapon,
            simplify: (value) => value
        },
        condition: {
            get value() { return EffectConditionFactory.create({}) },
            validate: EffectConditionFactory.validate,
            simplify: EffectConditionFactory.simplify
        },
        target: {
            value: TargetType.None,
            validate: (value) => isEnum(value, TargetType)
        },
        range: {
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

export default AbilityAttackData
