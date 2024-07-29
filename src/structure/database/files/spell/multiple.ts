import SpellDataBase from './data'
import { isNumber, nullifyEmptyRecord } from 'utils'
import { TargetType } from 'structure/dnd'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISpellMultipleData } from 'types/database/files/spell'

class SpellMultipleData extends SpellDataBase implements ISpellMultipleData {
    public override readonly target: TargetType.Multiple
    public override readonly condition: EffectCondition
    public readonly range: number
    public readonly count: number

    public constructor(data: Simplify<ISpellMultipleData>) {
        super(data)
        this.target = data.target ?? SpellMultipleData.properties.target.value
        this.range = data.range ?? SpellMultipleData.properties.range.value
        this.count = data.count ?? SpellMultipleData.properties.count.value
        this.condition = EffectConditionFactory.create(data.condition)
    }

    public override readonly targetIcon = null
    public override get targetText(): string {
        return `${this.count}x ${this.range} ft`
    }

    public static properties: DataPropertyMap<ISpellMultipleData, SpellMultipleData> = {
        ...SpellDataBase.properties,
        target: {
            value: TargetType.Multiple,
            validate: (value) => value === this.properties.target.value,
            simplify: (value) => value
        },
        range: {
            value: 0,
            validate: isNumber
        },
        count: {
            value: 0,
            validate: isNumber
        },
        condition: {
            get value() { return EffectConditionFactory.create({}) },
            validate: EffectConditionFactory.validate,
            simplify: (value) => nullifyEmptyRecord(EffectConditionFactory.simplify(value))
        }
    }
}

export default SpellMultipleData
