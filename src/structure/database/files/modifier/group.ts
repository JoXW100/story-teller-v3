import type Modifier from './modifier'
import ModifierDataBase from './data'
import { ModifierType } from './common'
import { SourceType } from './modifier'
import ModifierDataFactory, { type ModifierData } from './factory'
import { isRecord, keysOf } from 'utils'
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
    public readonly modifiers: ModifierData[]

    public constructor(data: Simplify<IModifierGroupData>) {
        super(data)
        this.condition = ConditionFactory.create(data.condition)
        this.modifiers = ModifierGroupData.properties.modifiers.value
        if (Array.isArray(data.modifiers)) {
            for (const modifier of data.modifiers) {
                this.modifiers.push(ModifierDataFactory.create(modifier))
            }
        } else if (isRecord(data.modifiers)) {
            for (const name of keysOf(data.modifiers)) {
                const modifier = data.modifiers[name]
                if (modifier !== undefined) {
                    this.modifiers.push(ModifierDataFactory.create(modifier))
                }
            }
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        for (let i = 0; i < this.modifiers.length; i++) {
            const source = this.modifiers[i]
            const innerKey = `${key}.${i}`
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
            modifier.addSource(innerKey, SourceType.Modifier, key)
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
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(ModifierDataFactory.validate),
            simplify: (value) => value.length > 0 ? value : null
        }
    }
}

export default ModifierGroupData
