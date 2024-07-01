import type { IconType } from 'assets/icons'
import SpellDataBase from './data'
import AbilityMeleeAttackData from '../ability/meleeAttackData'
import { isRecord } from 'utils'
import { TargetType } from 'structure/dnd'
import EffectConditionFactory from 'structure/database/effectCondition/factory'
import EffectFactory, { type Effect, simplifyEffectRecord } from 'structure/database/effect/factory'
import AreaFactory, { type Area } from 'structure/database/area/factory'
import type { EffectCondition } from 'structure/database/effectCondition'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISpellSelfData } from 'types/database/files/spell'

class SpellSelfData extends SpellDataBase implements ISpellSelfData {
    public readonly target: TargetType.Self
    public readonly area: Area
    public readonly condition: EffectCondition
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<ISpellSelfData>) {
        super(data)
        this.target = data.target ?? SpellSelfData.properties.target.value
        this.area = data.area !== undefined
            ? AreaFactory.create(data.area)
            : SpellSelfData.properties.area.value
        this.condition = data.condition !== undefined
            ? EffectConditionFactory.create(data.condition)
            : AbilityMeleeAttackData.properties.condition.value
        this.effects = SpellSelfData.properties.effects.value
        if (isRecord(data.effects)) {
            for (const key of Object.keys(data.effects)) {
                const effect = data.effects[key]
                if (effect !== undefined) {
                    this.effects[key] = EffectFactory.create(effect)
                }
            }
        }
    }

    public override get targetText(): string {
        return `Self (${this.area.text})`
    }

    public override get targetIcon(): IconType | null {
        return this.area.icon
    }

    public static properties: DataPropertyMap<ISpellSelfData, SpellSelfData> = {
        ...SpellDataBase.properties,
        target: {
            value: TargetType.Self,
            validate: (value) => value === this.properties.target.value,
            simplify: (value) => value
        },
        area: {
            get value() { return AreaFactory.create({}) },
            validate: AreaFactory.validate,
            simplify: AreaFactory.simplify
        },
        condition: {
            get value() { return EffectConditionFactory.create({}) },
            validate: EffectConditionFactory.validate,
            simplify: EffectConditionFactory.simplify
        },
        effects: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => key.length > 0 && EffectFactory.validate(value)),
            simplify: simplifyEffectRecord
        }
    }
}

export default SpellSelfData
