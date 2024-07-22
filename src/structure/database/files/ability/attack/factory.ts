import AbilityAttackNoneData from './none'
import AbilityAttackSelfData from './self'
import AbilityAttackSingleData from './single'
import AbilityAttackMultipleData from './multiple'
import AbilityAttackAreaData from './area'
import AbilityAttackTouchData from './touch'
import { isEnum, isRecord } from 'utils'
import { TargetType } from 'structure/dnd'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IAbilityAttackData } from 'types/database/files/ability'

export type AbilityAttackData = AbilityAttackNoneData | AbilityAttackTouchData | AbilityAttackSelfData | AbilityAttackSingleData | AbilityAttackMultipleData | AbilityAttackAreaData

const AbilityAttackDataFactory: IDatabaseFactory<IAbilityAttackData, AbilityAttackData> = {
    create: function (data: Simplify<IAbilityAttackData> = {}): AbilityAttackData {
        switch (data.target) {
            case TargetType.Touch:
                return new AbilityAttackTouchData(data)
            case TargetType.Self:
                return new AbilityAttackSelfData(data)
            case TargetType.Single:
                return new AbilityAttackSingleData(data)
            case TargetType.Multiple:
                return new AbilityAttackMultipleData(data)
            case TargetType.Area:
            case TargetType.Point:
                return new AbilityAttackAreaData(data)
            default:
                return new AbilityAttackNoneData(data as Record<string, unknown>)
        }
    },
    is: function (data: unknown): data is IAbilityAttackData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IAbilityAttackData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IAbilityAttackData): Simplify<IAbilityAttackData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IAbilityAttackData, AbilityAttackData> {
        const type = isRecord(data) && isEnum(data.target, TargetType)
            ? data.target
            : TargetType.None
        switch (type) {
            case TargetType.None:
                return AbilityAttackNoneData.properties
            case TargetType.Touch:
                return AbilityAttackTouchData.properties
            case TargetType.Self:
                return AbilityAttackSelfData.properties
            case TargetType.Single:
                return AbilityAttackSingleData.properties
            case TargetType.Multiple:
                return AbilityAttackMultipleData.properties
            case TargetType.Area:
            case TargetType.Point:
                return AbilityAttackAreaData.properties
        }
    }
}

export default AbilityAttackDataFactory
