import { AbilityType } from '../common'
import AbilityDataBase from '../data'
import type { IconType } from 'assets/icons'
import { isRecord, keysOf } from 'utils'
import { getOptionType } from 'structure/optionData'
import type { TargetType } from 'structure/dnd'
import EffectFactory, { simplifyEffectRecord, type Effect } from 'structure/database/effect/factory'
import type { EffectCondition } from 'structure/database/effectCondition/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityAttackDataBase } from 'types/database/files/ability'

abstract class AbilityAttackDataBase extends AbilityDataBase implements IAbilityAttackDataBase {
    public readonly type = AbilityType.Attack
    public abstract readonly target: TargetType
    public abstract readonly condition: EffectCondition
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<IAbilityAttackDataBase>) {
        super(data)
        this.effects = AbilityAttackDataBase.properties.effects.value
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

    public abstract get targetText(): string
    public abstract get targetIcon(): IconType | null

    public static override properties: Omit<DataPropertyMap<IAbilityAttackDataBase, AbilityAttackDataBase>, 'target' | 'condition'> = {
        ...AbilityDataBase.properties,
        type: {
            value: AbilityType.Attack,
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

export default AbilityAttackDataBase
