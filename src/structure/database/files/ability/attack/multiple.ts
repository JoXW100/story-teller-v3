import AbilityAttackDataBase from '.'
import { isNumber } from 'utils'
import { TargetType } from 'structure/dnd'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityAttackMultipleData } from 'types/database/files/ability'

class AbilityAttackMultipleData extends AbilityAttackDataBase implements IAbilityAttackMultipleData {
    public override readonly target: TargetType.Multiple
    public override readonly condition: EffectCondition
    public readonly range: number
    public readonly count: number

    public constructor(data: Simplify<IAbilityAttackMultipleData>) {
        super(data)
        this.target = data.target ?? AbilityAttackMultipleData.properties.target.value
        this.range = data.range ?? AbilityAttackMultipleData.properties.range.value
        this.count = data.count ?? AbilityAttackMultipleData.properties.count.value
        this.condition = EffectConditionFactory.create(data.condition)
    }

    public override readonly targetIcon = null
    public override get targetText(): string {
        return `${this.count}x ${this.range} ft`
    }

    public static properties: DataPropertyMap<IAbilityAttackMultipleData, AbilityAttackMultipleData> = {
        ...AbilityAttackDataBase.properties,
        target: {
            value: TargetType.Multiple,
            validate: (value) => value === this.properties.target.value,
            simplify: (value) => value
        },
        condition: {
            get value() { return EffectConditionFactory.create({}) },
            validate: EffectConditionFactory.validate,
            simplify: EffectConditionFactory.simplify
        },
        range: {
            value: 0,
            validate: isNumber
        },
        count: {
            value: 0,
            validate: isNumber
        }
    }
}

export default AbilityAttackMultipleData
