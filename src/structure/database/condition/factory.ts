import Condition, { ConditionType } from '.'
import { asBoolean, asEnum, isRecord, keysOf } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { ConditionData, ConditionExplicit, ConditionValue, ICondition } from 'types/database/condition'

export function isConditionExplicit(value: object): value is ConditionExplicit {
    return ('property' in value && typeof value.property === 'string') || 'value' in value
}

export function isConditionValue(value: unknown): value is ConditionValue {
    switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'string':
            return true
        case 'object':
            return value === null || isConditionExplicit(value)
        default:
            return false
    }
}

function createConditionValue(value?: Simplify<ConditionValue>): ConditionValue {
    switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'string':
            return value
        case 'object':
            if (value !== null && 'property' in value && value.property !== undefined) {
                return { property: value.property }
            }
            if (value !== null && 'value' in value && value.value !== undefined) {
                return { value: value.value }
            }
            return null
        default:
            return null
    }
}

export function createConditionData(condition: Simplify<ICondition> = {}): ConditionData {
    const type = asEnum(keysOf(condition)[0], ConditionType) ?? ConditionType.None
    switch (type) {
        case ConditionType.None:
            return { type: type }
        case ConditionType.Not:
            return { type: type, value: ConditionFactory.create(condition[type]) }
        case ConditionType.Equals:
        case ConditionType.NotEquals:
        case ConditionType.GreaterEquals:
        case ConditionType.LessEquals:
        case ConditionType.Range:
            return { type: type, value: condition[type]?.map(createConditionValue) ?? [] }
        case ConditionType.Or:
        case ConditionType.Nor:
        case ConditionType.And:
        case ConditionType.Nand:
            return { type: type, value: condition[type]?.map((condition) => ConditionFactory.create(condition)) ?? [] }
    }
}

const ConditionFactory: IDatabaseFactory<ICondition, Condition> = {
    create: function (data?: Simplify<ICondition>): Condition {
        if (data instanceof Condition) {
            return data
        }
        return new Condition(createConditionData(data))
    },
    is: function (data: unknown): data is ICondition {
        return data instanceof Condition || ConditionFactory.validate(data)
    },
    validate: function (data: unknown): data is Simplify<ICondition> {
        if (!isRecord(data) || keysOf(data).length > 1) {
            return false
        }

        const type = asEnum(keysOf(data)[0], ConditionType) ?? ConditionType.None
        switch (type) {
            case ConditionType.Not: {
                return ConditionFactory.validate(data[type])
            }
            case ConditionType.Or:
            case ConditionType.Nor:
            case ConditionType.And:
            case ConditionType.Nand: {
                const values = data[type]
                return Array.isArray(values) && values.every(ConditionFactory.validate)
            }
            case ConditionType.Equals:
            case ConditionType.GreaterEquals:
            case ConditionType.LessEquals:
            case ConditionType.Range:
            case ConditionType.NotEquals: {
                const values = data[type]
                return Array.isArray(values) && values.every(isConditionValue)
            }
            case ConditionType.None:
            default:
                return true
        }
    },
    simplify: function (data: ICondition): Simplify<ICondition> {
        if (data instanceof Condition) {
            return data.simplify()
        }

        const type = asEnum(keysOf(data)[0], ConditionType) ?? ConditionType.None
        switch (type) {
            case ConditionType.Not: {
                const value = data[type]
                return value === undefined ? {} : ConditionFactory.simplify(value)
            }
            case ConditionType.Or:
            case ConditionType.Nor:
            case ConditionType.And:
            case ConditionType.Nand: {
                const values = data[type]
                return values === undefined ? {} : { [type]: values.map(ConditionFactory.simplify) }
            }
            case ConditionType.Equals:
            case ConditionType.GreaterEquals:
            case ConditionType.LessEquals:
            case ConditionType.Range:
            case ConditionType.NotEquals: {
                return data
            }
            case ConditionType.None: {
                return { [type]: asBoolean(data[type]) }
            }
            default: {
                return {}
            }
        }
    },
    properties: function (_data: unknown): DataPropertyMap<ICondition, Condition> {
        return {}
    }
}

export function simplifyCondition(value: ICondition): Simplify<ICondition> | null {
    const simplified = ConditionFactory.simplify(value)
    return Object.keys(simplified).length > 0 ? simplified : null
}

export default ConditionFactory
