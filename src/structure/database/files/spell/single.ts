import SpellDataBase from './data'
import { isNumber } from 'utils'
import { TargetType } from 'structure/dnd'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISpellSingleData } from 'types/database/files/spell'

class SpellSingleData extends SpellDataBase implements ISpellSingleData {
    public override readonly target: TargetType.Single
    public override readonly condition: EffectCondition
    public readonly range: number

    public constructor(data: Simplify<ISpellSingleData>) {
        super(data)
        this.target = data.target ?? SpellSingleData.properties.target.value
        this.range = data.range ?? SpellSingleData.properties.range.value
        this.condition = EffectConditionFactory.create(data.condition)
    }

    public override readonly targetIcon = null
    public override get targetText(): string {
        return `${this.range} ft`
    }

    public static properties: DataPropertyMap<ISpellSingleData, SpellSingleData> = {
        ...SpellDataBase.properties,
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

export default SpellSingleData
