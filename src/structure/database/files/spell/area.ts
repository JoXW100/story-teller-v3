import type { IconType } from 'assets/icons'
import SpellDataBase from './data'
import { isNumber, nullifyEmptyRecord } from 'utils'
import { TargetType } from 'structure/dnd'
import AreaFactory, { type Area } from 'structure/database/area/factory'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISpellAreaData } from 'types/database/files/spell'

class SpellAreaData extends SpellDataBase implements ISpellAreaData {
    public override readonly target: TargetType.Point | TargetType.Area
    public override readonly condition: EffectCondition
    public readonly range: number
    public readonly area: Area

    public constructor(data: Simplify<ISpellAreaData>) {
        super(data)
        this.target = data.target ?? SpellAreaData.properties.target.value
        this.range = data.range ?? SpellAreaData.properties.range.value
        this.area = AreaFactory.create(data.area)
        this.condition = EffectConditionFactory.create(data.condition)
    }

    public override get targetText(): string {
        const area = this.area.text
        return area.length > 0
            ? `${this.range} ft (${area})`
            : `${this.range} ft`
    }

    public override get targetIcon(): IconType | null {
        return this.area.icon
    }

    public static properties: DataPropertyMap<ISpellAreaData, SpellAreaData> = {
        ...SpellDataBase.properties,
        target: {
            value: TargetType.Area,
            validate: (value) => value === TargetType.Area || value === TargetType.Point,
            simplify: (value) => value
        },
        range: {
            value: 0,
            validate: isNumber
        },
        area: {
            get value() { return AreaFactory.create({}) },
            validate: AreaFactory.validate,
            simplify: (value) => nullifyEmptyRecord(AreaFactory.simplify(value))
        },
        condition: {
            get value() { return EffectConditionFactory.create({}) },
            validate: EffectConditionFactory.validate,
            simplify: (value) => nullifyEmptyRecord(EffectConditionFactory.simplify(value))
        }
    }
}

export default SpellAreaData
