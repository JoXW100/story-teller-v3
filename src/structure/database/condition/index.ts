import type { ICondition, ConditionValue, ConditionData, IConditionProperties } from 'types/database/condition'
import { isBoolean, getRelativeFieldObject } from 'utils'

export enum ConditionType {
    None = 'none',
    Equals = 'eq',
    NotEquals = 'neq',
    GreaterEquals = 'geq',
    LessEquals = 'leq',
    Range = 'range',
    Not = 'not',
    Or = 'or',
    Nor = 'nor',
    And = 'and',
    Nand = 'nand',
}

export enum ConditionValueType {
    Property = 'property',
    Boolean = 'boolean',
    Constant = 'constant'
}

class Condition implements ICondition {
    public readonly data: ConditionData

    public get eq(): ConditionValue[] | undefined { return this.data.type === ConditionType.Equals ? this.data.value : undefined }
    public get neq(): ConditionValue[] | undefined { return this.data.type === ConditionType.NotEquals ? this.data.value : undefined }
    public get geq(): ConditionValue[] | undefined { return this.data.type === ConditionType.GreaterEquals ? this.data.value : undefined }
    public get leq(): ConditionValue[] | undefined { return this.data.type === ConditionType.LessEquals ? this.data.value : undefined }
    public get range(): ConditionValue[] | undefined { return this.data.type === ConditionType.Range ? this.data.value : undefined }
    public get not(): ICondition | undefined { return this.data.type === ConditionType.Not ? this.data.value : undefined }
    public get or(): ICondition[] | undefined { return this.data.type === ConditionType.Or ? this.data.value : undefined }
    public get nor(): ICondition[] | undefined { return this.data.type === ConditionType.Nor ? this.data.value : undefined }
    public get and(): ICondition[] | undefined { return this.data.type === ConditionType.And ? this.data.value : undefined }
    public get nand(): ICondition[] | undefined { return this.data.type === ConditionType.Nand ? this.data.value : undefined }

    public constructor(data: ConditionData) {
        this.data = data
    }

    public evaluate(data: Partial<IConditionProperties>, choices: Record<string, unknown> = {}): boolean {
        switch (this.data.type) {
            case ConditionType.None: {
                return this.data.value === undefined ||
                    (isBoolean(this.data.value) && this.data.value) ||
                    (!isBoolean(this.data.value) && this.data.value(data, choices))
            }
            case ConditionType.Equals: {
                const value = Condition.valueOf(this.data.value[0], data)
                for (let i = 1; i < this.data.value.length; i++) {
                    if (value !== Condition.valueOf(this.data.value[i], data)) {
                        return false
                    }
                }
                return true
            }
            case ConditionType.NotEquals: {
                const value = Condition.valueOf(this.data.value[0], data)
                for (let i = 1; i < this.data.value.length; i++) {
                    if (value !== Condition.valueOf(this.data.value[i], data)) {
                        return true
                    }
                }
                return false
            }
            case ConditionType.GreaterEquals: {
                if (this.data.value.length === 2) {
                    const value1 = Condition.valueOf(this.data.value[0], data)
                    const value2 = Condition.valueOf(this.data.value[1], data)
                    return Number(value1) >= Number(value2)
                }
                return false
            }
            case ConditionType.LessEquals: {
                if (this.data.value.length === 2) {
                    const value1 = Condition.valueOf(this.data.value[0], data)
                    const value2 = Condition.valueOf(this.data.value[1], data)
                    return Number(value1) <= Number(value2)
                }
                return false
            }
            case ConditionType.Range: {
                if (this.data.value.length === 3) {
                    const value1 = Condition.valueOf(this.data.value[0], data)
                    const value2 = Condition.valueOf(this.data.value[1], data)
                    const value3 = Condition.valueOf(this.data.value[2], data)
                    return Number(value1) <= Number(value2) && Number(value2) <= Number(value3)
                }
                return false
            }
            case ConditionType.Not: {
                return !this.data.value.evaluate(data, choices)
            }
            case ConditionType.Or: {
                for (const x of this.data.value) {
                    if (x.evaluate(data, choices)) {
                        return true
                    }
                }
                return false
            }
            case ConditionType.Nor: {
                for (const x of this.data.value) {
                    if (x.evaluate(data, choices)) {
                        return false
                    }
                }
                return true
            }
            case ConditionType.And: {
                for (const x of this.data.value) {
                    if (!x.evaluate(data, choices)) {
                        return false
                    }
                }
                return true
            }
            case ConditionType.Nand: {
                for (const x of this.data.value) {
                    if (!x.evaluate(data, choices)) {
                        return true
                    }
                }
                return false
            }
            default:
                return false
        }
    }

    public simplify(): ICondition {
        switch (this.data.type) {
            case ConditionType.None:
                if (isBoolean(this.data.value)) {
                    return { [this.data.type]: this.data.value }
                } else {
                    return {}
                }
            case ConditionType.Not:
                return { [this.data.type]: this.data.value.simplify() }
            case ConditionType.Or:
            case ConditionType.Nor:
            case ConditionType.And:
            case ConditionType.Nand:
                return { [this.data.type]: this.data.value.map(x => x.simplify()) }
            default:
                return { [this.data.type]: this.data.value }
        }
    }

    public stringify(): string {
        return JSON.stringify(this.simplify())
    }

    private static valueOf(value: ConditionValue, data: Partial<IConditionProperties>): string | number | boolean | null {
        switch (typeof value) {
            case 'boolean':
            case 'number':
            case 'string':
                return value
            case 'object': {
                if (value === null) {
                    return null
                } else if ('property' in value) {
                    const relative = getRelativeFieldObject(value.property, data)
                    return relative?.relative[relative.key] as any
                } else if ('value' in value) {
                    return value.value
                }
                return null
            }
            default: {
                return null
            }
        }
    }
}

export default Condition
