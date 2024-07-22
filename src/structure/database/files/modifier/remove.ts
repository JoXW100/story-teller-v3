import { ModifierType } from './common'
import ModifierDataBase from './data'
import type Modifier from './modifier'
import { asObjectId, isObjectIdOrNull, isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import Condition, { ConditionType } from 'structure/database/condition'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IModifierRemoveData } from 'types/database/files/modifier'

export const ModifierRemoveDataFactory: IDatabaseFactory<IModifierRemoveData, ModifierRemoveData> = {
    create: function (data: Simplify<IModifierRemoveData> = {}): ModifierRemoveData {
        return new ModifierRemoveData(data)
    },
    is: function (data: unknown): data is ModifierRemoveData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<ModifierRemoveData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IModifierRemoveData): Simplify<ModifierRemoveData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IModifierRemoveData, ModifierRemoveData> {
        return ModifierRemoveData.properties
    }
}

class ModifierRemoveData extends ModifierDataBase implements IModifierRemoveData {
    public override readonly type = ModifierType.Remove
    public readonly value: ObjectId | null

    public constructor(data: Simplify<IModifierRemoveData>) {
        super(data)
        this.value = asObjectId(data.value) ?? ModifierRemoveData.properties.value.value
    }

    public override apply(modifier: Modifier): void {
        if (this.value !== null) {
            modifier.properties.conditions[this.value] = new Condition({ type: ConditionType.None, value: false })
        }
    }

    public static properties: Omit<DataPropertyMap<IModifierRemoveData, ModifierRemoveData>, 'subtype'> = {
        ...ModifierDataBase.properties,
        type: {
            value: ModifierType.Remove,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        value: {
            value: null,
            validate: isObjectIdOrNull
        }
    }
}

export default ModifierRemoveData
