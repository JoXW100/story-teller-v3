import AbilityAttackDataBase from '.'
import { TargetType } from 'structure/dnd'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityAttackTouchData } from 'types/database/files/ability'

class AbilityAttackTouchData extends AbilityAttackDataBase implements IAbilityAttackTouchData {
    public override readonly target: TargetType.Touch
    public override readonly condition: EffectCondition

    public constructor(data: Simplify<IAbilityAttackTouchData>) {
        super(data)
        this.target = data.target ?? AbilityAttackTouchData.properties.target.value
        this.condition = EffectConditionFactory.create(data.condition)
    }

    public override readonly targetIcon = null
    public override readonly targetText = 'Touch'

    public static properties: DataPropertyMap<IAbilityAttackTouchData, AbilityAttackTouchData> = {
        ...AbilityAttackDataBase.properties,
        target: {
            value: TargetType.Touch,
            validate: (value) => value === this.properties.target.value,
            simplify: (value) => value
        },
        condition: {
            get value() { return EffectConditionFactory.create({}) },
            validate: EffectConditionFactory.validate,
            simplify: EffectConditionFactory.simplify
        }
    }
}

export default AbilityAttackTouchData
