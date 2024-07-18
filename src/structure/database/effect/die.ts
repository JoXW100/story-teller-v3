import EffectBase from '.'
import { EffectType } from './common'
import { isBoolean, isCalcValue, isEnum, isNumber } from 'utils'
import { getScalingValue } from 'utils/calculations'
import { ScalingType } from 'structure/dnd'
import { DieType } from 'structure/dice'
import { AutoCalcValue, CalcMode, createCalcValue, simplifyCalcValue, type ICalcValue } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IDieEffect } from 'types/database/effect'
import type { ICreatureStats } from 'types/editor'

class DieEffect extends EffectBase implements IDieEffect {
    public readonly type: EffectType.Die
    public readonly scaling: ScalingType
    public readonly proficiency: boolean
    public readonly die: DieType
    public readonly dieCount: number
    public readonly modifier: ICalcValue

    public constructor(data: Simplify<IDieEffect>) {
        super(data)
        this.type = data.type ?? DieEffect.properties.type.value
        this.scaling = data.scaling ?? DieEffect.properties.scaling.value
        this.proficiency = data.proficiency ?? DieEffect.properties.proficiency.value
        this.die = data.die ?? DieEffect.properties.die.value
        this.dieCount = data.dieCount ?? DieEffect.properties.dieCount.value
        this.modifier = createCalcValue(data.modifier, DieEffect.properties.modifier.value)
    }

    public getModifierValue(stats: ICreatureStats): number {
        const mod = this.modifier.value ?? 0
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

    public getDiceRollText(stats: ICreatureStats): string {
        const mod = this.getModifierValue(stats)
        return this.die === DieType.None || this.die === DieType.DX
            ? `d0${mod >= 0 ? '+' : '-'}${Math.abs(mod)}`
            : `${this.dieCount}${this.die}${mod >= 0 ? '+' : '-'}${Math.abs(mod)}`
    }

    public static properties: DataPropertyMap<IDieEffect, DieEffect> = {
        ...EffectBase.properties,
        type: {
            value: EffectType.Die,
            validate: (value) => value === EffectType.Die,
            simplify: (value) => value
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

export default DieEffect
