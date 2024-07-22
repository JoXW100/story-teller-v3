import EffectConditionNone from 'structure/database/effectCondition/none'
import SpellDataBase from './data'
import { TargetType } from 'structure/dnd'
import ConditionFactory from 'structure/database/condition/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISpellNoneData } from 'types/database/files/spell'

class SpellNoneData extends SpellDataBase implements ISpellNoneData {
    public override readonly target: TargetType.None
    public override readonly condition: EffectConditionNone

    public constructor(data: Simplify<ISpellNoneData>) {
        super(data)
        this.target = data.target ?? SpellNoneData.properties.target.value
        this.condition = new EffectConditionNone(data.condition ?? {})
    }

    public override readonly targetText = '-'
    public override readonly targetIcon = null

    public static override properties: DataPropertyMap<ISpellNoneData, SpellNoneData> = {
        ...SpellDataBase.properties,
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

export default SpellNoneData
