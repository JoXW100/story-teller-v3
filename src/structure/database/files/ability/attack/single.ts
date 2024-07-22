import AbilityAttackDataBase from '.'
import { isNumber } from 'utils'
import { TargetType } from 'structure/dnd'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityAttackSingleData } from 'types/database/files/ability'

class AbilityAttackSingleData extends AbilityAttackDataBase implements IAbilityAttackSingleData {
    public override readonly target: TargetType.Single
    public override readonly condition: EffectCondition
    public readonly range: number

    public constructor(data: Simplify<IAbilityAttackSingleData>) {
        super(data)
        this.target = data.target ?? AbilityAttackSingleData.properties.target.value
        this.range = data.range ?? AbilityAttackSingleData.properties.range.value
        this.condition = EffectConditionFactory.create(data.condition)
    }

    public override readonly targetIcon = null
    public override get targetText(): string {
        return `${this.range} ft`
    }

    public static properties: DataPropertyMap<IAbilityAttackSingleData, AbilityAttackSingleData> = {
        ...AbilityAttackDataBase.properties,
        target: {
            value: TargetType.Single,
            validate: (value) => value === this.properties.target.value,
            simplify: (value) => value
        },
        range: {
            value: 0,
            validate: isNumber
        },
        condition: {
            get value() { return EffectConditionFactory.create() },
            validate: EffectConditionFactory.validate,
            simplify: EffectConditionFactory.simplify
        }
    }
}

export default AbilityAttackSingleData
