import EffectConditionNone from 'structure/database/effectCondition/none'
import AbilityAttackDataBase from '.'
import { TargetType } from 'structure/dnd'
import ConditionFactory from 'structure/database/condition/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityAttackNoneData } from 'types/database/files/ability'

class AbilityAttackNoneData extends AbilityAttackDataBase implements IAbilityAttackNoneData {
    public override readonly target: TargetType.None
    public override readonly condition: EffectConditionNone

    public constructor(data: Simplify<IAbilityAttackNoneData>) {
        super(data)
        this.target = data.target ?? AbilityAttackNoneData.properties.target.value
        this.condition = new EffectConditionNone(data.condition ?? {})
    }

    public override readonly targetText = '-'
    public override readonly targetIcon = null

    public static override properties: DataPropertyMap<IAbilityAttackNoneData, AbilityAttackNoneData> = {
        ...AbilityAttackDataBase.properties,
        target: {
            value: TargetType.None,
            validate: (value) => value === this.properties.target.value,
            simplify: (value) => value
        },
        condition: {
            get value() { return new EffectConditionNone({}) },
            validate: ConditionFactory.validate,
            simplify: () => null
        }
    }
}

export default AbilityAttackNoneData
