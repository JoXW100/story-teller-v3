import type { DataPropertyMap } from 'types/database'
import type { IEffectConditionBase } from 'types/database/effectCondition'

export enum EffectConditionType {
    None = 'none',
    Hit = 'hit',
    Save = 'save',
    Check = 'check'
}

class EffectConditionBase implements IEffectConditionBase {
    public static properties: DataPropertyMap<IEffectConditionBase, EffectConditionBase> = {}
}

export default EffectConditionBase
