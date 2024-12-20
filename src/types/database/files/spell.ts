import type { IDatabaseFileData, IDatabaseFileStorage } from '..'
import type { IArea } from '../area'
import type { CastingTime, Duration, MagicSchool, SpellLevel, TargetType } from 'structure/dnd'
import type { IEffect } from 'types/database/effect'
import type { IEffectCondition, IEffectConditionNone } from 'types/database/effectCondition'

export interface ISpellDataBase extends IDatabaseFileData {
    readonly name: string
    readonly description: string
    readonly notes: string
    // readonly icon: string
    readonly level: SpellLevel
    readonly school: MagicSchool
    // Time
    readonly time: CastingTime
    readonly timeCustom: string
    readonly timeValue: number
    readonly duration: Duration
    readonly durationCustom: string
    readonly durationValue: number
    // Target
    readonly target: TargetType
    readonly condition: IEffectCondition
    // Properties
    readonly allowUpcast: boolean
    readonly ritual: boolean
    readonly concentration: boolean
    readonly componentVerbal: boolean
    readonly componentSomatic: boolean
    readonly componentMaterial: boolean
    readonly materials: string
    // Effects
    readonly effects: Record<string, IEffect>
}

export interface ISpellNoneData extends ISpellDataBase {
    readonly target: TargetType.None
    readonly condition: IEffectConditionNone
}

export interface ISpellTouchData extends ISpellDataBase {
    readonly target: TargetType.Touch
}

export interface ISpellSelfData extends ISpellDataBase {
    readonly target: TargetType.Self
    readonly area: IArea
}

export interface ISpellSingleData extends ISpellDataBase {
    readonly target: TargetType.Single
    readonly range: number
}

export interface ISpellMultipleData extends ISpellDataBase {
    readonly target: TargetType.Multiple
    readonly range: number
    readonly count: number
}

export interface ISpellAreaData extends ISpellDataBase {
    readonly target: TargetType.Point | TargetType.Area
    readonly range: number
    readonly area: IArea
}

export type ISpellData = ISpellNoneData | ISpellTouchData | ISpellSelfData |
ISpellSingleData | ISpellMultipleData | ISpellAreaData

export interface ISpellStorage extends IDatabaseFileStorage {

}
