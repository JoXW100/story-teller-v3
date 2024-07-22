import { ModifierType } from '../common'
import ModifierDataBase from '../data'
import { isRecord, isEnum, isNumber, asNumber, keysOf } from 'utils'
import { simplifyNumberRecord } from 'structure/database'
import { ScalingType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusDataBase } from 'types/database/files/modifier'

export enum ModifierBonusType {
    AC = 'ac',
    Health = 'health',
    AbilityScore = 'abilityScore',
    Save = 'save',
    Skill = 'skill',
    Speed = 'speed',
    SpellAttack = 'spellAttack',
    SpellSave = 'spellSave',
    CritRange = 'critRange',
    CritDieCount = 'critDieCount',
    MultiAttack = 'multiAttack',
    AttunementSlot = 'attunementSlot'
}

export abstract class ModifierBonusDataBase extends ModifierDataBase implements IModifierBonusDataBase {
    public override readonly type = ModifierType.Bonus
    public abstract readonly subtype: ModifierBonusType
    public readonly scaling: Partial<Record<ScalingType, number>>

    public constructor(data: Simplify<IModifierBonusDataBase>) {
        super(data)
        this.scaling = ModifierBonusDataBase.properties.scaling.value
        if (data.scaling !== undefined) {
            for (const type of keysOf(data.scaling)) {
                if (isEnum(type, ScalingType)) {
                    this.scaling[type] = asNumber(data.scaling[type], 0)
                }
            }
        }
    }

    public static properties: Omit<DataPropertyMap<IModifierBonusDataBase, ModifierBonusDataBase>, 'subtype'> = {
        ...ModifierDataBase.properties,
        type: {
            value: ModifierType.Bonus,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        scaling: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        }
    }
}

export default ModifierBonusDataBase
