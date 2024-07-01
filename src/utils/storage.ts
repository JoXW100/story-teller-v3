import { asEnum, asKeyOf } from 'utils'
import Logger from './logger'

abstract class Storage {
    /** Sets the value of the item at the given key */
    static setString(key: string, value: string): boolean {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value)
            return true
        }
        return false
    }

    /** Sets the value of the item at the given key */
    static setInt(key: string, value: number): boolean {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value.toString())
            return true
        }
        return false
    }

    /** Sets the value of the item at the given key */
    static setBoolean(key: string, value: boolean): boolean {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value ? 'true' : 'false')
            return true
        }
        return false
    }

    /** Sets the value of the item at the given key */
    static setObject<T extends object>(key: string, value: T): boolean {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(value))
            return true
        }
        return false
    }

    /** Gets the value of the item at the given key */
    static getString(key: string): string | null {
        if (typeof window !== 'undefined') {
            return window.localStorage.getItem(key)
        }
        return null
    }

    static getKeyOf<T extends Record<string, any>>(key: string, type: T): keyof T | null {
        if (typeof window !== 'undefined') {
            const value = window.localStorage.getItem(key)
            return asKeyOf(value, type)
        }
        return null
    }

    static getEnum<T extends Record<string, string | number | symbol>>(
        key: string,
        type: T
    ): T[keyof T] | null {
        if (typeof window !== 'undefined') {
            const value = window.localStorage.getItem(key)
            return asEnum(value, type)
        }
        return null
    }

    /** Gets the value of the item at the given key */
    static getInt(key: string): number | null {
        if (typeof window !== 'undefined') {
            const value = window.localStorage.getItem(key)
            if (value !== null) {
                const num = parseInt(value)
                return isNaN(num) ? null : num
            }
        }
        return null
    }

    /** Gets the value of the item at the given key */
    static getBoolean(key: string): boolean | null {
        if (typeof window !== 'undefined') {
            const value = window.localStorage.getItem(key)
            if (value !== null) {
                return value === 'true'
            }
        }
        return null
    }

    /** Sets the value of the item at the given key */
    static getObject<T extends object>(key: string): T | null {
        if (typeof window !== 'undefined') {
            const value = window.localStorage.getItem(key)
            if (value !== null) {
                return JSON.parse(value) as T
            }
        }
        return null
    }

    static delete(key: string): boolean {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key)
            Logger.warn('storage.delete', key)
            return true
        }
        return false
    }
}

export default Storage
