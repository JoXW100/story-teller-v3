import EffectBase from '.'
import { EffectCategory, EffectType } from './common'
import { asEnum, asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import { DamageType, ScalingType } from 'structure/dnd'
import { DieType } from 'structure/dice'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IDamageEffect } from 'types/database/effect'
import type { IBonusGroup, IProperties } from 'types/editor'

class DamageEffect extends EffectBase implements IDamageEffect {
    public readonly type = EffectType.Damage
    public readonly category: EffectCategory
    public readonly damageType: DamageType
    public readonly scaling: Partial<Record<ScalingType, number>>
    public readonly die: DieType
    public readonly dieCount: Partial<Record<ScalingType, number>>

    public constructor(data: Simplify<IDamageEffect>) {
        super(data)
        this.category = asEnum(data.category, EffectCategory, DamageEffect.properties.category.value)
        this.damageType = asEnum(data.damageType, DamageType, DamageEffect.properties.damageType.value)
        this.scaling = DamageEffect.properties.scaling.value
        if (data.scaling !== undefined) {
            for (const type of keysOf(data.scaling)) {
                if (isEnum(type, ScalingType)) {
                    this.scaling[type] = asNumber(data.scaling[type], 0)
                }
            }
        }
        this.die = data.die ?? DamageEffect.properties.die.value
        this.dieCount = DamageEffect.properties.dieCount.value
        if (data.dieCount !== undefined) {
            for (const type of keysOf(data.dieCount)) {
                if (isEnum(type, ScalingType)) {
                    this.dieCount[type] = asNumber(data.dieCount[type], 0)
                }
            }
        }
    }

    public getModifierValue(stats: Partial<IProperties>, bonuses: IBonusGroup): number {
        let mod: number = 0
        switch (this.category) {
            case EffectCategory.AttackDamage:
                mod += bonuses.bonus
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

    public getDieCountValue(stats: Partial<IProperties>): number {
        return resolveScaling(this.dieCount, stats)
    }

    public getDiceRollText(stats: Partial<IProperties>, bonuses: IBonusGroup): string {
        const mod = this.getModifierValue(stats, bonuses)
        const count = this.getDieCountValue(stats)
        return this.die === DieType.None || this.die === DieType.DX
            ? `d0${mod >= 0 ? '+' : '-'}${Math.abs(mod)}`
            : `${count}${this.die}${mod >= 0 ? '+' : '-'}${Math.abs(mod)}`
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
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }
}

export default DamageEffect
