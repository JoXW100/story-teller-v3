import ModifierDataFactory, { type ModifierData, simplifyModifierDataRecord } from './factory'
import { ModifierAddType } from './add'
import { ModifierType } from './common'
import ModifierDataBase from './data'
import type Modifier from './modifier'
import { isNumber, isRecord, isString, keysOf } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import Condition, { ConditionType } from 'structure/database/condition'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IModifierChoiceData } from 'types/database/files/modifier'

export const ModifierChoiceDataFactory: IDatabaseFactory<IModifierChoiceData, ModifierChoiceData> = {
    create: function (data: Simplify<IModifierChoiceData> = {}): ModifierChoiceData {
        return new ModifierChoiceData(data)
    },
    is: function (data: unknown): data is ModifierChoiceData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<ModifierChoiceData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IModifierChoiceData): Simplify<ModifierChoiceData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IModifierChoiceData, ModifierChoiceData> {
        return ModifierChoiceData.properties
    }
}

class ModifierChoiceData extends ModifierDataBase implements IModifierChoiceData {
    public override readonly type = ModifierType.Choice
    public readonly num: number
    public readonly options: Record<string, ModifierData>

    public constructor(data: Simplify<IModifierChoiceData>) {
        super(data)
        this.num = data.num ?? ModifierChoiceData.properties.num.value
        this.options = ModifierChoiceData.properties.options.value
        if (data.options !== undefined) {
            for (const key of keysOf(data.options)) {
                this.options[key] = ModifierDataFactory.create(data.options[key])
            }
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        const optionKeys = keysOf(this.options)
        modifier.addChoice({
            source: this,
            type: 'value',
            value: optionKeys,
            numChoices: this.num
        }, key)
        for (let i = 0; i < optionKeys.length; i++) {
            const optionName = optionKeys[i]
            const option = this.options[optionName]
            if (option.type === ModifierType.Add && option.subtype === ModifierAddType.Ability && !option.value.isChoice && option.value.value === null) {
                continue // Nothing to do here.
            }
            const innerKey = `${key}.${optionName}`
            option.apply(modifier, innerKey)
            const conditions: Condition[] = [
                this.condition,
                new Condition({
                    type: ConditionType.None,
                    value: (parameters, choices) => {
                        const indices: unknown = choices[key]
                        return Array.isArray(indices) && indices.includes(i) &&
                            (!(key in modifier.properties.conditions) || modifier.properties.conditions[key].evaluate(parameters, choices))
                    }
                })
            ]
            modifier.addCondition(
                new Condition({ type: ConditionType.And, value: conditions }),
                innerKey
            )
        }
    }

    public static properties: DataPropertyMap<IModifierChoiceData, ModifierChoiceData> = {
        ...ModifierDataBase.properties,
        type: {
            value: ModifierType.Choice,
            validate: (value) => value === ModifierType.Choice,
            simplify: (value) => value
        },
        num: {
            value: 1,
            validate: isNumber,
            simplify: (value) => value === this.properties.num.value ? null : Math.floor(value)
        },
        options: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isString(key) && ModifierDataFactory.validate(val)),
            simplify: simplifyModifierDataRecord
        }
    }
}

export default ModifierChoiceData
