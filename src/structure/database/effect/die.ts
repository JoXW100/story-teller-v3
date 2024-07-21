import EffectBase from '.'
import { EffectType } from './common'
import { asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import { ScalingType } from 'structure/dnd'
import { DieType } from 'structure/dice'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IDieEffect } from 'types/database/effect'
import type { IConditionProperties } from 'types/database/condition'

class DieEffect extends EffectBase implements IDieEffect {
    public readonly type: EffectType.Die
    public readonly scaling: Partial<Record<ScalingType, number>>
    public readonly die: DieType
    public readonly dieCount: number

    public constructor(data: Simplify<IDieEffect>) {
        super(data)
        this.type = data.type ?? DieEffect.properties.type.value
        this.scaling = DieEffect.properties.scaling.value
        if (data.scaling !== undefined) {
            for (const type of keysOf(data.scaling)) {
                if (isEnum(type, ScalingType)) {
                    this.scaling[type] = asNumber(data.scaling[type], 0)
                }
            }
        }
        this.die = data.die ?? DieEffect.properties.die.value
        this.dieCount = data.dieCount ?? DieEffect.properties.dieCount.value
    }

    public getModifierValue(stats: Partial<IConditionProperties>): number {
        return resolveScaling(this.scaling, stats)
    }

    public getDiceRollText(stats: Partial<IConditionProperties>): string {
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

export default DieEffect
