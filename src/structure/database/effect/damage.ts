import EffectBase from '.'
import { EffectCategory, EffectType } from './common'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import { DamageType, ScalingType } from 'structure/dnd'
import { DieType } from 'structure/dice'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IDamageEffect } from 'types/database/effect'
import type { IBonusGroup } from 'types/editor'
import type { IConditionProperties } from 'types/database/condition'

class DamageEffect extends EffectBase implements IDamageEffect {
    public readonly type: EffectType.Damage
    public readonly category: EffectCategory
    public readonly damageType: DamageType
    public readonly scaling: Partial<Record<ScalingType, number>>
    public readonly die: DieType
    public readonly dieCount: number

    public constructor(data: Simplify<IDamageEffect>) {
        super(data)
        this.type = data.type ?? DamageEffect.properties.type.value
        this.category = data.category ?? DamageEffect.properties.category.value
        this.damageType = data.damageType ?? DamageEffect.properties.damageType.value
        this.scaling = DamageEffect.properties.scaling.value
        if (data.scaling !== undefined) {
            for (const type of keysOf(data.scaling)) {
                if (isEnum(type, ScalingType)) {
                    this.scaling[type] = asNumber(data.scaling[type], 0)
                }
            }
        }
        this.die = data.die ?? DamageEffect.properties.die.value
        this.dieCount = data.dieCount ?? DamageEffect.properties.dieCount.value
    }

    public getModifierValue(stats: Partial<IConditionProperties>, bonuses: IBonusGroup): number {
        let mod: number = 0
        switch (this.category) {
            case EffectCategory.AttackDamage:
                mod += bonuses.bonus
                break
            case EffectCategory.AreaDamage:
                mod += bonuses.bonus
                mod += bonuses.areaBonus
                break
            case EffectCategory.SingleDamage:
                mod += bonuses.bonus
                mod += bonuses.singleBonus
                break
            case EffectCategory.MeleeDamage:
                mod += bonuses.bonus
                mod += bonuses.meleeBonus
                break
            case EffectCategory.RangedDamage:
                mod += bonuses.bonus
                mod += bonuses.rangedBonus
                break
            case EffectCategory.ThrownDamage:
                mod += bonuses.bonus
                mod += bonuses.thrownBonus
                break
        }
        return resolveScaling(this.scaling, stats, true) + mod
    }

    public getDiceRollText(stats: Partial<IConditionProperties>, bonuses: IBonusGroup): string {
        const mod = this.getModifierValue(stats, bonuses)
        return this.die === DieType.None || this.die === DieType.DX
            ? `d0${mod >= 0 ? '+' : '-'}${Math.abs(mod)}`
            : `${this.dieCount}${this.die}${mod >= 0 ? '+' : '-'}${Math.abs(mod)}`
    }

    public static properties: DataPropertyMap<IDamageEffect, DamageEffect> = {
        ...EffectBase.properties,
        type: {
            value: EffectType.Damage,
            validate: (value) => value === EffectType.Damage,
            simplify: (value) => value
        },
        category: {
            value: EffectCategory.Uncategorized,
            validate: (value) => isEnum(value, EffectCategory)
        },
        damageType: {
            value: DamageType.Special,
            validate: (value) => isEnum(value, DamageType)
        },
        scaling: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        },
        die: {
            value: DieType.D20,
            validate: (value) => isEnum(value, DieType)
        },
        dieCount: {
            value: 1,
            validate: isNumber
        }
    }
}

export default DamageEffect
