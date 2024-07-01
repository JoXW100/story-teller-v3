import type NoneEffectCondition from './none'
import type HitEffectCondition from './hit'
import type SaveEffectCondition from './save'
import type { DataPropertyMap } from 'types/database'
import type { IEffectConditionBase } from 'types/database/effectCondition'

export enum EffectConditionType {
    None = 'none',
    Hit = 'hit',
    Save = 'save'
}

export type EffectCondition = NoneEffectCondition | HitEffectCondition | SaveEffectCondition

class EffectConditionBase implements IEffectConditionBase {
    public static properties: DataPropertyMap<IEffectConditionBase, EffectConditionBase> = {}
}

export default EffectConditionBase
