import type { IconType } from 'assets/icons'
import SpellDataBase from './data'
import { TargetType } from 'structure/dnd'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import AreaFactory, { type Area } from 'structure/database/area/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISpellSelfData } from 'types/database/files/spell'

class SpellSelfData extends SpellDataBase implements ISpellSelfData {
    public override readonly target: TargetType.Self
    public override readonly condition: EffectCondition
    public readonly area: Area

    public constructor(data: Simplify<ISpellSelfData>) {
        super(data)
        this.target = data.target ?? SpellSelfData.properties.target.value
        this.area = data.area !== undefined
            ? AreaFactory.create(data.area)
            : SpellSelfData.properties.area.value
        this.condition = EffectConditionFactory.create(data.condition)
    }

    public override get targetText(): string {
        const areaText = this.area.text
        return areaText.length > 0
            ? `Self (${areaText})`
            : 'Self'
    }

    public override get targetIcon(): IconType | null {
        return this.area.icon
    }

    public static properties: DataPropertyMap<ISpellSelfData, SpellSelfData> = {
        ...SpellDataBase.properties,
        target: {
            value: TargetType.Self,
            validate: (value) => value === this.properties.target.value,
            simplify: (value) => value
        },
        area: {
            get value() { return AreaFactory.create({}) },
            validate: AreaFactory.validate,
            simplify: AreaFactory.simplify
        },
        condition: {
            get value() { return EffectConditionFactory.create({}) },
            validate: EffectConditionFactory.validate,
            simplify: EffectConditionFactory.simplify
        }
    }
}

export default SpellSelfData
