import type { IconType } from 'assets/icons'
import AbilityAttackDataBase from '.'
import { nullifyEmptyRecord } from 'utils'
import { TargetType } from 'structure/dnd'
import EffectConditionFactory, { type EffectCondition } from 'structure/database/effectCondition/factory'
import AreaFactory, { type Area } from 'structure/database/area/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityAttackSelfData } from 'types/database/files/ability'

class AbilityAttackSelfData extends AbilityAttackDataBase implements IAbilityAttackSelfData {
    public override readonly target: TargetType.Self
    public override readonly condition: EffectCondition
    public readonly area: Area

    public constructor(data: Simplify<IAbilityAttackSelfData>) {
        super(data)
        this.target = data.target ?? AbilityAttackSelfData.properties.target.value
        this.area = AreaFactory.create(data.area)
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

    public static properties: DataPropertyMap<IAbilityAttackSelfData, AbilityAttackSelfData> = {
        ...AbilityAttackDataBase.properties,
        target: {
            value: TargetType.Self,
            validate: (value) => value === this.properties.target.value,
            simplify: (value) => value
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

export default AbilityAttackSelfData
