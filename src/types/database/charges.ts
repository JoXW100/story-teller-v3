import type { RestType } from 'structure/dnd'
import type { ICondition } from './condition'

export interface IChargesData {
    readonly condition: ICondition
    readonly charges: number
    readonly chargesReset: RestType
}
