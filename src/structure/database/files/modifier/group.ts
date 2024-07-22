import type Modifier from './modifier'
import ModifierDataBase from './data'
import { ModifierType } from './common'
import ModifierDataFactory, { type ModifierData, simplifyModifierDataRecord } from './factory'
import { isRecord, isString, keysOf } from 'utils'
import Condition, { ConditionType } from 'structure/database/condition'
import ConditionFactory, { simplifyCondition } from 'structure/database/condition/factory'
import { hasObjectProperties, validateObjectProperties, simplifyObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IModifierGroupData } from 'types/database/files/modifier'

export const ModifierGroupDataFactory: IDatabaseFactory<IModifierGroupData, ModifierGroupData> = {
    create: function (data: Simplify<IModifierGroupData> = {}): ModifierGroupData {
        return new ModifierGroupData(data)
    },
    is: function (data: unknown): data is ModifierGroupData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<ModifierGroupData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IModifierGroupData): Simplify<ModifierGroupData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (): DataPropertyMap<IModifierGroupData, ModifierGroupData> {
        return ModifierGroupData.properties
    }
}

class ModifierGroupData extends ModifierDataBase implements IModifierGroupData {
    public override readonly type = ModifierType.Group
    public readonly condition: Condition
    public readonly modifiers: Record<string, ModifierData>

    public constructor(data: Simplify<IModifierGroupData>) {
        super(data)
        this.condition = ConditionFactory.create(data.condition)
        this.modifiers = ModifierGroupData.properties.modifiers.value
        if (data.modifiers !== undefined) {
            for (const name of keysOf(data.modifiers)) {
                const modifier = data.modifiers[name]
                if (modifier !== undefined) {
                    this.modifiers[name] = ModifierDataFactory.create(modifier)
                }
            }
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        const modifierKeys = keysOf(this.modifiers)
        for (let i = 0; i < modifierKeys.length; i++) {
            const name = modifierKeys[i]
            const source = this.modifiers[name]
            const innerKey = `${key}.${name}`
            source.apply(modifier, innerKey)
            const conditions: Condition[] = [
                this.condition,
                new Condition({
                    type: ConditionType.None,
                    value: (parameters, choices) => {
                        return !(key in modifier.properties.conditions) ||
                            modifier.properties.conditions[key].evaluate(parameters, choices)
                    }
                })
            ]
            modifier.addCondition(
                new Condition({ type: ConditionType.And, value: conditions }),
                innerKey
            )
        }
    }

    public static properties: DataPropertyMap<IModifierGroupData, ModifierGroupData> = {
        ...ModifierDataBase.properties,
        type: {
            value: ModifierType.Group,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        condition: {
            get value() { return ConditionFactory.create() },
            validate: ConditionFactory.validate,
            simplify: simplifyCondition
        },
        modifiers: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isString(key) && ModifierDataFactory.validate(val)),
            simplify: simplifyModifierDataRecord
        }
    }
}

export default ModifierGroupData
