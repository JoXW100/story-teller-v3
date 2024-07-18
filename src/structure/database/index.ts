import { isKeyOf, keysOf } from 'utils'
import Logger from 'utils/logger'
import { OptionalAttribute } from 'structure/dnd'
import type { DataPropertyMap } from 'types/database'
import type { IBonusGroup, ICreatureStats } from 'types/editor'

export enum DocumentType {
    Ability = 'abi',
    Character = 'cha',
    Creature = 'cre',
    Class = 'cla',
    Subclass = 'scl',
    Race = 'rce',
    Item = 'ite',
    Map = 'map',
    Modifier = 'mod',
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

export interface ICalcValue {
    mode: CalcMode
    value?: number
}

export const AutoCalcValue = { mode: CalcMode.Auto } satisfies ICalcValue

export function createCalcValue(data?: Partial<ICalcValue>, other?: ICalcValue): ICalcValue {
    if (data === undefined) {
        return other ?? AutoCalcValue
    }
    switch (data.mode) {
        case CalcMode.Modify:
        case CalcMode.Override:
            return { mode: data.mode, value: data.value ?? other?.value ?? 0 }
        case CalcMode.Auto:
        default:
            return { mode: data.mode ?? other?.mode ?? CalcMode.Auto }
    }
}

export function simplifyCalcValue(data: ICalcValue): Partial<ICalcValue> | null {
    switch (data.mode) {
        case CalcMode.Modify:
        case CalcMode.Override:
            if (data.value === 0) {
                return { mode: data.mode }
            }
            return { mode: data.mode, value: data.value }
        case CalcMode.Auto:
            return null
    }
}

export const EmptyCreatureStats: ICreatureStats = {
    level: 0,
    casterLevel: 0,
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
    spellAttribute: OptionalAttribute.None,
    proficiency: 2,
    critRange: 20,
    multiAttack: 1,
    armorLevel: 0,
    shieldLevel: 0
}

export const EmptyBonusGroup: IBonusGroup = {
    bonus: 0,
    areaBonus: 0,
    singleBonus: 0,
    meleeBonus: 0,
    rangedBonus: 0,
    thrownBonus: 0
}

export const DocumentFileType = { ...DocumentType, ...FileType }
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DocumentFileType = DocumentType | FileType

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
