import type { IconType } from 'assets/icons'
import AbilityAttackDataBase from '.'
import { isNumber } from 'utils'
import { TargetType } from 'structure/dnd'
import AreaFactory, { type Area } from 'structure/database/area/factory'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityAttackAreaData } from 'types/database/files/ability'

class AbilityAttackAreaData extends AbilityAttackDataBase implements IAbilityAttackAreaData {
    public override readonly target: TargetType.Point | TargetType.Area
    public override readonly condition: EffectCondition
    public readonly range: number
    public readonly area: Area

    public constructor(data: Simplify<IAbilityAttackAreaData>) {
        super(data)
        this.target = data.target ?? AbilityAttackAreaData.properties.target.value
        this.range = data.range ?? AbilityAttackAreaData.properties.range.value
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

    public static properties: DataPropertyMap<IAbilityAttackAreaData, AbilityAttackAreaData> = {
        ...AbilityAttackDataBase.properties,
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
            simplify: AreaFactory.simplify
        },
        condition: {
            get value() { return EffectConditionFactory.create({}) },
            validate: EffectConditionFactory.validate,
            simplify: EffectConditionFactory.simplify
        }
    }
}

export default AbilityAttackAreaData
