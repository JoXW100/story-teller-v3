import SpellNoneData from './none'
import SpellSelfData from './self'
import SpellSingleData from './single'
import SpellMultipleData from './multiple'
import SpellAreaData from './area'
import SpellTouchData from './touch'
import { asNumber, isEnum, isRecord } from 'utils'
import { CastingTime, TargetType } from 'structure/dnd'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { ISpellData } from 'types/database/files/spell'

export type SpellData = SpellNoneData | SpellTouchData | SpellSelfData | SpellSingleData | SpellMultipleData | SpellAreaData

const SpellDataFactory: IDatabaseFactory<ISpellData, SpellData> = {
    create: function (data: Simplify<ISpellData> = {}): SpellData {
        switch (data.target) {
            case TargetType.Touch:
                return new SpellTouchData(data)
            case TargetType.Self:
                return new SpellSelfData(data)
            case TargetType.Single:
                return new SpellSingleData(data)
            case TargetType.Multiple:
                return new SpellMultipleData(data)
            case TargetType.Area:
            case TargetType.Point:
                return new SpellAreaData(data)
            default:
                return new SpellNoneData(data as Record<string, unknown>)
        }
    },
    is: function (data: unknown): data is ISpellData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<ISpellData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: ISpellData): Simplify<ISpellData> {
        const simplified = simplifyObjectProperties(data, this.properties(data))
        if ('timeCustom' in simplified && simplified.time !== CastingTime.Custom) {
            delete simplified.timeCustom
        }
        if ('durationCustom' in simplified && simplified.duration !== CastingTime.Custom) {
            delete simplified.durationCustom
        }
        if ('allowUpcast' in simplified && !('level' in simplified && asNumber(simplified.level, 0) > 0)) {
            delete simplified.materials
        }
        if ('materials' in simplified && !('componentMaterial' in simplified)) {
            delete simplified.materials
        }
        return simplified
    },
    properties: function (data: unknown): DataPropertyMap<ISpellData, SpellData> {
        const type = isRecord(data) && isEnum(data.target, TargetType)
            ? data.target
            : TargetType.None
        switch (type) {
            case TargetType.None:
                return SpellNoneData.properties
            case TargetType.Touch:
                return SpellTouchData.properties
            case TargetType.Self:
                return SpellSelfData.properties
            case TargetType.Single:
                return SpellSingleData.properties
            case TargetType.Multiple:
                return SpellMultipleData.properties
            case TargetType.Area:
            case TargetType.Point:
                return SpellAreaData.properties
        }
    }
}

export default SpellDataFactory
