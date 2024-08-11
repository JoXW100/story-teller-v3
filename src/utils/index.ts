import type { BooleanString, Enum, ObjectId } from 'types'
import { CalcMode, type CalcValue } from 'structure/database'

/**
 * Excludes duplicate values from an array
 * @param array The array of values to exclude duplicates from
 * @returns A new array of the unique values from `array`
 */
export function uniqueArray<T>(array: T[]): T[] {
    const result = new Set<T>()
    for (let i = 0; i < array.length; i++) {
        if (!result.has(array[i])) {
            result.add(array[i])
        }
    }
    return Array.from(result)
}

/**
 * Excludes values from a given array
 * @param array Array of values to exclude from
 * @param exclude The values from `array` to exclude
 * @returns A new array of the unique values from `array` excluding values from
 * the `exclude` array.
 */
export function excludeArray<T>(array: T[], exclude: Iterable<T>): T[] {
    const excludeSet = new Set<T>(exclude)
    const result = new Array<T>()
    for (let i = 0; i < array.length; i++) {
        if (!excludeSet.has(array[i])) {
            result.push(array[i])
        }
    }
    return result
}

export function keysOf<T extends string | number | symbol>(value: Partial<Record<T, any>>): T[] {
    return Object.keys(value) as T[]
}

export function isKeyOf<K, T extends string | number | symbol>(key: K, value: Partial<Record<T, any>>): key is T & K {
    return String(key) in value
}

export function asKeyOf<T extends string | number | symbol>(key: unknown, value: Partial<Record<T, any>>): T | null
export function asKeyOf<T extends string | number | symbol, O>(key: unknown, value: Partial<Record<T, any>>, other: O): T | O
export function asKeyOf<T extends string | number | symbol, O>(key: unknown, value: Partial<Record<T, any>>, other: O | null = null): T | O | null {
    return isKeyOf(key, value) ? key : other
}

export function isURLString(value: string): boolean {
    return /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/.test(value)
}

/**
 * Validates that the type of a value is a specific enum
 * @param value Value to check if a valid enum value
 * @param type The enum of the value
 * @returns True if the value is a valid enum value, otherwise, false
 */
export function isEnum<T extends Enum>(value: unknown, type: T): value is T[keyof T] {
    return (typeof value === 'string' || typeof value === 'number' || typeof value === 'symbol') &&
        Object.values(type).includes(value)
}

export function asEnum<T extends Enum>(value: unknown, type: T): T[keyof T] | null
export function asEnum<T extends Enum, O>(value: unknown, type: T, other: O): T[keyof T] | O
export function asEnum<T extends Enum, O>(value: unknown, type: T, other: O | null = null): T[keyof T] | O | null {
    return isEnum(value, type) ? value : other
}

export function isNumber(value: unknown, allowNaN: boolean = false): value is number {
    return typeof value === 'number' && (allowNaN || !isNaN(value))
}

export function isNumberOrNull(value: unknown, allowNaN: boolean = false): value is number | null {
    return value === null || isNumber(value, allowNaN)
}

export function isNumeric(value: unknown): boolean {
    return !isNaN(Number(value))
}

export function asNumber(value: unknown): number
export function asNumber<O>(value: unknown, other: O): number | O
export function asNumber<O>(value: unknown, other: O | number = NaN): number | O {
    const tmp = Number(value)
    return value === null || isNaN(tmp) ? other : tmp
}

export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
}

export function asBoolean(value: unknown, other: boolean = false): boolean {
    return isBoolean(value) ? value : other
}

export function isString(value: unknown): value is string {
    return typeof value === 'string'
}

export function isStringOrNull(value: unknown): value is string | null {
    return value === null || typeof value === 'string'
}

export function isIntString(value: string): boolean {
    return /^[0-9]+$/.test(value)
}

export function isFloatString(value: string): boolean {
    return /^([0-9]*\.)?[0-9]+$/.test(value)
}

export function isCSSValueString(value: string): boolean {
    return /^([0-9]*\.)?[0-9]+(px|cm|em|in|%|)$/.test(value)
}

export function isRecord<T = unknown>(value: unknown, validate?: (key: string, val: unknown) => boolean): value is Record<string, T> {
    return typeof value === 'object' && value !== null &&
        Object.getOwnPropertySymbols(value).length === 0 && !Array.isArray(value) &&
        (validate === undefined || keysOf(value).every((key) => validate(key, (value as Record<string, unknown>)[key])))
}

export function isRecordOrNull<T = unknown>(value: unknown, validate?: (key: string, val: unknown) => boolean): value is Record<string, T> {
    return value === null || isRecord(value, validate)
}

export function nullifyEmptyRecord<T extends Record<any, any>>(value: T): T | null {
    return Object.keys(value).length > 0 ? value : null
}

/**
 * Validates that the given value is an object id
 * @param value The value to verify
 * @returns True if the value is a valid object id, otherwise, false
 */
export function isObjectId(value: unknown): value is ObjectId {
    return typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value)
}

/**
 * Validates that the given value is an object id or null
 * @param value The value to verify
 * @returns True if the value is a valid object id or null, otherwise, false
 */
export function isObjectIdOrNull(value: unknown): value is ObjectId | null {
    return value === null || isObjectId(value)
}

export function asObjectId(value: unknown): ObjectId | null {
    return isObjectId(value) ? value : null
}

/**
 * Validates that the given value is a calc value
 * @param value The value to verify
 * @returns True if the value is a calc value, otherwise, false
 */
export function isCalcValue(value: unknown): value is CalcValue {
    return typeof value === 'object' && value !== null &&
        'mode' in value && isEnum(value.mode, CalcMode) &&
        (!('value' in value) || isNumber(value.value))
}

export function isValidURL(value: string): boolean {
    return /^https?:\/\/\S+$/.test(value)
}

export function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined
}

export function asBooleanString(value: boolean): BooleanString {
    return value ? 'true' : 'false'
}

/**
 * Gets the value from the given value indexed by a key
 * @param value The value to index
 * @param key The key used to index the value
 * @returns The value at the index in the value or null if it does not exist
 */
export function valueAtKey<T extends string | number>(value: object, key: T): unknown {
    return (value as any)[key] ?? null
}

/**
 * Calculates a clamped value
 * @param value The value to clamp
 * @param min The minimum value
 * @param max The maximum value
 * @returns The value closest to the given value in the range min to max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

/**
 * Calculates a value between two given values
 * @param value1 The value when factor is 0
 * @param value2 The value when factor is 1
 * @param factor The factor
 * @returns A value between the two given values decided by the factor value
 */
export function lerp(value1: number, value2: number, factor: number): number {
    return value1 * (1 - factor) + factor * value2
}

export function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getRelativeFieldObject(field: string, data: object): { key: string, relative: Record<string, unknown> } | null {
    if (!isString(field) || !isRecord(data)) {
        return null
    }
    const keys = field.split('.')
    let relativeData: Record<string, unknown> = data
    for (let i = 0; i < keys.length - 1; i++) {
        if (keys[i].length === 0) {
            continue
        }

        const next = relativeData[keys[i]]
        if (isRecord(next) || Array.isArray(next)) {
            relativeData = next as Record<string, unknown>
        } else {
            return null
        }
    }

    const key = keys[keys.length - 1]
    if (!isKeyOf(key, relativeData)) {
        return null
    }

    return {
        key: key,
        relative: relativeData
    }
}

export function createField(...parts: Array<string | undefined>): string {
    let field = ''
    let flag = true
    for (const part of parts) {
        switch (part) {
            case undefined:
                continue
            case 'data':
                if (flag) {
                    continue
                }
                flag = false
                field += '.' + part
                break
            default:
                flag = false
                if (field === '') {
                    field = part
                } else {
                    field += '.' + part
                }
                break
        }
    }
    return field
}
