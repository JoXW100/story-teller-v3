import { isKeyOf, keysOf } from 'utils'
import Logger from 'utils/logger'
import { OptionalAttribute } from 'structure/dnd'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IBonusGroup, IProperties } from 'types/editor'

export enum DocumentType {
    Ability = 'abi',
    Character = 'cha',
    Creature = 'cre',
    Class = 'cla',
    Encounter = 'enc',
    Subclass = 'scl',
    Race = 'rce',
    Subrace = 'src',
    Item = 'ite',
    Map = 'map',
    Modifier = 'mod',
    NPC = 'npc',
    Spell = 'spe',
    Text = 'txt'
}

export enum FileType {
    Root = 'root',
    Empty = 'empty',
    Folder = 'folder'
}

export enum CalcMode {
    Auto = 'auto',
    Override = 'override',
    Modify = 'modify'
}

export enum FlagType {
    Public = 'public',
    Official = 'official'
}

export abstract class DatabaseObject {
    public readonly id: ObjectId

    protected constructor(id: ObjectId) {
        this.id = id
    }
}

export interface ICalcValueAuto {
    mode: CalcMode.Auto
}

export interface ICalcValueModify {
    mode: CalcMode.Modify
    value: number
}

export interface ICalcValueOverride {
    mode: CalcMode.Override
    value: number
}

export type CalcValue = ICalcValueAuto | ICalcValueModify | ICalcValueOverride

export const DocumentFileType = { ...DocumentType, ...FileType }
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DocumentFileType = DocumentType | FileType

export const EmptyProperties: IProperties = {
    level: 0,
    classLevel: 0,
    casterLevel: 0,
    spellLevel: 0,
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
    strModifier: 0,
    dexModifier: 0,
    conModifier: 0,
    intModifier: 0,
    wisModifier: 0,
    chaModifier: 0,
    spellAttribute: OptionalAttribute.None,
    proficiency: 2,
    critRange: 20,
    critDieCount: 0,
    multiAttack: 1,
    armorLevel: 0,
    shieldLevel: 0,
    walkSpeed: 0,
    burrowSpeed: 0,
    climbSpeed: 0,
    flySpeed: 0,
    hoverSpeed: 0,
    swimSpeed: 0,
    attunedItems: 0
}

export const EmptyBonusGroup: IBonusGroup = {
    bonus: 0,
    meleeBonus: 0,
    rangedBonus: 0,
    thrownBonus: 0
}

export function createCalcValue(data: Partial<CalcValue> = {}): CalcValue {
    switch (data.mode) {
        case CalcMode.Modify:
        case CalcMode.Override:
            return { mode: data.mode, value: data.value ?? 0 }
        case CalcMode.Auto:
        default:
            return { mode: CalcMode.Auto }
    }
}

export function simplifyCalcValue(data: CalcValue): Partial<CalcValue> | null {
    switch (data.mode) {
        case CalcMode.Modify:
        case CalcMode.Override:
            if (data.value === 0) {
                return { mode: data.mode }
            } else {
                return { mode: data.mode, value: data.value }
            }
        case CalcMode.Auto:
            return null
    }
}

export function simplifyNumberRecord(value: Record<any, number>, defaultNumber: number = 0): Simplify<typeof value> | null {
    const result: Simplify<Record<any, number>> = {}
    let flag = false
    for (const key of keysOf(value)) {
        const number = value[key]
        if (number !== defaultNumber) {
            result[key] = number
            flag = true
        }
    }
    return flag ? result : null
}

export function hasObjectProperties<T, U extends T>(value: { [P in keyof T]?: unknown }, properties: DataPropertyMap<T, U>): boolean {
    for (const key of keysOf(properties)) {
        if (!properties[key].validate(value[key])) {
            Logger.log('hasObjectProperties failed', key, properties, value)
            return false
        }
    }
    return true
}

export function validateObjectProperties<T, U extends T>(value: { [P in keyof T]?: unknown }, properties: DataPropertyMap<T, U>): boolean {
    for (const key of keysOf(value)) {
        if (!isKeyOf(key, properties) || !properties[key].validate(value[key])) {
            Logger.log('validateObjectProperties failed', key, value, Object.keys(properties))
            return false
        }
    }
    return true
}

export function simplifyObjectProperties<T, U extends T>(value: T, properties: DataPropertyMap<T, U>): Record<string, unknown> {
    const simplified: Record<string, unknown> = {}
    for (const key of keysOf(properties)) {
        const property = properties[key]
        const res = property.simplify === undefined
            ? property.value === value[key] ? null : value[key]
            : property.simplify(value[key])
        if (res !== null) {
            simplified[key as string] = res
        }
    }
    return simplified
}
