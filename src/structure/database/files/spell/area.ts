import type { IconType } from 'assets/icons'
import SpellDataBase from './data'
import AbilityMeleeAttackData from '../ability/meleeAttack'
import { isNumber, isRecord } from 'utils'
import { TargetType } from 'structure/dnd'
import AreaFactory, { type Area } from 'structure/database/area/factory'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import EffectFactory, { type Effect, simplifyEffectRecord } from 'structure/database/effect/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISpellAreaData } from 'types/database/files/spell'

class SpellAreaData extends SpellDataBase implements ISpellAreaData {
    public readonly target: TargetType.Point | TargetType.Area
    public readonly range: number
    public readonly area: Area
    public readonly condition: EffectCondition
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<ISpellAreaData>) {
        super(data)
        this.target = data.target ?? SpellAreaData.properties.target.value
        this.range = data.range ?? SpellAreaData.properties.range.value
        this.area = data.area !== undefined
            ? AreaFactory.create(data.area)
            : SpellAreaData.properties.area.value
        this.condition = data.condition !== undefined
            ? EffectConditionFactory.create(data.condition)
            : AbilityMeleeAttackData.properties.condition.value
        this.effects = SpellAreaData.properties.effects.value
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
        const area = this.area.text
        return area.length > 0
            ? `${this.range} ft (${area})`
            : `${this.range} ft`
    }

    public override get targetIcon(): IconType | null {
        return this.area.icon
    }

    public static properties: DataPropertyMap<ISpellAreaData, SpellAreaData> = {
        ...SpellDataBase.properties,
        target: {
            value: TargetType.Area,
            validate: (value) => value === TargetType.Area || value === TargetType.Point,
            simplify: (value) => value
        },
        range: {
            value: 0,
            validate: isNumber
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

export default SpellAreaData
