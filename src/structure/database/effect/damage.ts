import EffectBase from '.'
import { EffectCategory, EffectType } from './common'
import { isBoolean, isCalcValue, isEnum, isNumber } from 'utils'
import { getScalingValue } from 'utils/calculations'
import { DamageType, ScalingType } from 'structure/dnd'
import { DieType } from 'structure/dice'
import { AutoCalcValue, CalcMode, createCalcValue, simplifyCalcValue, type ICalcValue } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IDamageEffect } from 'types/database/effect'
import type { IBonusGroup, ICreatureStats } from 'types/editor'

class DamageEffect extends EffectBase implements IDamageEffect {
    public readonly type: EffectType.Damage
    public readonly category: EffectCategory
    public readonly damageType: DamageType
    public readonly scaling: ScalingType
    public readonly proficiency: boolean
    public readonly die: DieType
    public readonly dieCount: number
    public readonly modifier: ICalcValue

    public constructor(data: Simplify<IDamageEffect>) {
        super(data)
        this.type = data.type ?? DamageEffect.properties.type.value
        this.category = data.category ?? DamageEffect.properties.category.value
        this.damageType = data.damageType ?? DamageEffect.properties.damageType.value
        this.scaling = data.scaling ?? DamageEffect.properties.scaling.value
        this.proficiency = data.proficiency ?? DamageEffect.properties.proficiency.value
        this.die = data.die ?? DamageEffect.properties.die.value
        this.dieCount = data.dieCount ?? DamageEffect.properties.dieCount.value
        this.modifier = createCalcValue(data.modifier, DamageEffect.properties.modifier.value)
    }

    public getModifierValue(stats: ICreatureStats, bonuses: IBonusGroup): number {
        let mod = this.modifier.value ?? 0
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
        const prof = this.proficiency ? stats.proficiency : 0
        switch (this.modifier.mode) {
            case CalcMode.Modify:
                return getScalingValue(this.scaling, stats) + mod + prof
            case CalcMode.Override:
                return mod + prof
            case CalcMode.Auto:
                return getScalingValue(this.scaling, stats) + prof
        }
    }

    public getDiceRollText(stats: ICreatureStats, bonuses: IBonusGroup): string {
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
            value: ScalingType.None,
            validate: (value) => isEnum(value, ScalingType)
        },
        proficiency: {
            value: false,
            validate: isBoolean
        },
        die: {
            value: DieType.D20,
            validate: (value) => isEnum(value, DieType)
        },
        dieCount: {
            value: 1,
            validate: isNumber
        },
        modifier: {
            get value() { return { ...AutoCalcValue } },
            validate: isCalcValue,
            simplify: simplifyCalcValue
        }
    }
}

export default DamageEffect
