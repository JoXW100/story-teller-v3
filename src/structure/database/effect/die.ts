import EffectBase from '.'
import { EffectType } from './common'
import { asEnum, asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import { ScalingType } from 'structure/dnd'
import { DieType } from 'structure/dice'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IDieEffect } from 'types/database/effect'
import type { IProperties } from 'types/editor'

class DieEffect extends EffectBase implements IDieEffect {
    public readonly type = EffectType.Die
    public readonly scaling: Partial<Record<ScalingType, number>>
    public readonly die: DieType
    public readonly dieCount: Partial<Record<ScalingType, number>>

    public constructor(data: Simplify<IDieEffect>) {
        super(data)
        this.scaling = DieEffect.properties.scaling.value
        if (data.scaling !== undefined) {
            for (const type of keysOf(data.scaling)) {
                if (isEnum(type, ScalingType)) {
                    this.scaling[type] = asNumber(data.scaling[type], 0)
                }
            }
        }
        this.die = asEnum(data.die, DieType, DieEffect.properties.die.value)
        this.dieCount = DieEffect.properties.dieCount.value
        if (data.dieCount !== undefined) {
            for (const type of keysOf(data.dieCount)) {
                if (isEnum(type, ScalingType)) {
                    this.dieCount[type] = asNumber(data.dieCount[type], 0)
                }
            }
        }
    }

    public getModifierValue(stats: Partial<IProperties>): number {
        return resolveScaling(this.scaling, stats, true)
    }

    public getDieCountValue(stats: Partial<IProperties>): number {
        return resolveScaling(this.dieCount, stats)
    }

    public getDiceRollText(stats: Partial<IProperties>): string {
        const mod = this.getModifierValue(stats)
        const count = this.getDieCountValue(stats)
        return this.die === DieType.None || this.die === DieType.DX
            ? `d0${mod >= 0 ? '+' : '-'}${Math.abs(mod)}`
            : `${count}${this.die}${mod >= 0 ? '+' : '-'}${Math.abs(mod)}`
    }

    public static properties: DataPropertyMap<IDieEffect, DieEffect> = {
        ...EffectBase.properties,
        type: {
            value: EffectType.Die,
            validate: (value) => value === EffectType.Die,
            simplify: (value) => value
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

export default DieEffect
