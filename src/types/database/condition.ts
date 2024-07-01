import type Condition from 'structure/database/condition'
import type { ConditionType } from 'structure/database/condition'
import type { ICreatureStats } from 'types/editor'

export interface IConditionProperties extends ICreatureStats {
    spellLevel: number
}

export type ConditionValue = string | number | boolean | null | ConditionExplicit
export type ConditionExplicit = {
    property: keyof IConditionProperties
} | {
    value: string | number | boolean | null
}

export type ConditionData = {
    type: ConditionType.None
} | {
    type: ConditionType.Equals | ConditionType.NotEquals | ConditionType.GreaterEquals | ConditionType.LessEquals
    value: ConditionValue[]
} | {
    type: ConditionType.Not
    value: Condition
} | {
    type: ConditionType.Or | ConditionType.Nor | ConditionType.And | ConditionType.Nand
    value: Condition[]
}

export interface ICondition {
    readonly eq?: ConditionValue[]
    readonly neq?: ConditionValue[]
    readonly geq?: ConditionValue[]
    readonly leq?: ConditionValue[]
    readonly not?: ICondition
    readonly or?: ICondition[]
    readonly nor?: ICondition[]
    readonly and?: ICondition[]
    readonly nand?: ICondition[]
}
