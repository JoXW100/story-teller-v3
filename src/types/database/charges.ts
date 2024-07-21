import type { ScalingType, RestType } from 'structure/dnd'
import type { ICondition } from './condition'

export interface IChargesData {
    readonly condition: ICondition
    readonly chargesReset: RestType
    readonly charges: Partial<Record<ScalingType, number>>
}
