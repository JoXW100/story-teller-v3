import type CommandToken from 'structure/language/tokens/command'
import { isKeyOf, keysOf } from 'utils'

export interface IElementParam<T> {
    default?: T // if undefined, this parameter is not optional
    validate: (value: string) => boolean
    parse: (value: string) => T
}

export interface IElement<T extends Record<string, any> = any> {
    readonly name: string
    readonly defaultParam: keyof T | null
    readonly params: { [K in keyof T]: IElementParam<T[K]> }
    readonly init: (token: CommandToken) => void
    readonly parse: (token: CommandToken, key?: string) => React.ReactNode
    readonly create: (params: T, key?: string, children?: React.ReactNode) => React.ReactNode
}

export abstract class Element<T extends Record<string, any> = any> implements IElement<T> {
    public abstract readonly name: string
    public abstract readonly defaultParam: keyof T | null
    public abstract readonly params: { [K in keyof T]: IElementParam<T[K]> }
    public readonly element?: React.FC<{ key?: string } & T>

    public constructor(element?: React.FC<{ key?: string } & T>) {
        this.element = element
    }

    public init(_token: CommandToken): void {
    }

    public parse(token: CommandToken, key?: string): React.ReactNode {
        const texts = token.params?.value ?? {}
        const params = this.getValidatedParams(texts)

        if (params === null) {
            return null
        }

        return this.create(params, key, token.body?.build())
    }

    public getValidatedParams(values: Record<string, string>): T | null {
        const params: Partial<T> = {}
        for (const key of keysOf(this.params)) {
            const isKey = isKeyOf(key, values)
            if ((!isKey && this.params[key].default === undefined) || (isKey && !this.params[key].validate(values[key]))) {
                return null
            }
            params[key] = isKey ? this.params[key].parse(values[key]) : this.params[key].default
        }
        return params as T
    }

    public create(params: T, key?: string, children?: React.ReactNode): React.ReactNode {
        return this.element?.({ key: key, children: children, ...params })
    }
}
