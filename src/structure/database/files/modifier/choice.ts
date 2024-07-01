import type ModifierDocument from '.'
import ModifierDataBase from './data'
import { ModifierType } from './common'
import type Modifier from './modifier'
import { isNumber, isObjectId, isRecord, isString, keysOf } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IEditorChoiceData, IInnerModifierData, IModifierChoiceData } from 'types/database/files/modifier'
import ConditionFactory from 'structure/database/condition/factory'

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

export function validateInnerModifierData(value: unknown): value is Simplify<IInnerModifierData> {
    return isRecord(value) && (!('condition' in value) || ConditionFactory.validate(value.condition)) &&
        (!('modifiers' in value) || (Array.isArray(value.modifiers) && value.modifiers.every(isObjectId)))
}

export function isInnerModifierData(value: unknown): value is IInnerModifierData {
    return isRecord(value) && 'condition' in value &&
        ConditionFactory.validate(value.condition) && 'modifiers' in value &&
        Array.isArray(value.modifiers) && value.modifiers.every(isObjectId)
}

export function simplifyInnerModifierDataRecord(value: Record<string, IInnerModifierData>): Simplify<IInnerModifierData> | null {
    const result: Record<string, Simplify<IInnerModifierData>> = {}
    let flag = false
    for (const key of keysOf(value)) {
        flag = true
        const data = value[key]
        const condition = ConditionFactory.simplify(data.condition)
        let innerData: Simplify<IInnerModifierData> = {}
        if (Object.keys(condition).length > 0) {
            innerData = { ...result, condition: condition }
        }
        if (data.modifiers.length > 0) {
            innerData = { ...result, modifiers: data.modifiers }
        }
        result[key] = innerData
    }
    return flag ? result : null
}

class ModifierChoiceData extends ModifierDataBase implements IModifierChoiceData {
    public override readonly type = ModifierType.Choice
    public readonly num: number
    public readonly options: Record<string, IInnerModifierData>

    public constructor(data: Simplify<IModifierChoiceData>) {
        super(data)
        this.num = data.num ?? ModifierChoiceData.properties.num.value
        this.options = ModifierChoiceData.properties.options.value
        if (data.options !== undefined) {
            for (const key of keysOf(data.options)) {
                const source = data.options[key]
                if (source !== undefined) {
                    this.options[key] = {
                        condition: ConditionFactory.create(source.condition),
                        modifiers: []
                    }
                    if (source.modifiers !== undefined) {
                        for (const id of source.modifiers) {
                            if (isObjectId(id)) {
                                this.options[key].modifiers.push(id)
                            }
                        }
                    }
                }
            }
        }
    }

    public apply(data: Modifier, self: ModifierDocument): void {
        throw new Error('Not implemented')
    }

    public override getEditorChoiceData(): IEditorChoiceData | null {
        return { type: 'value', value: keysOf(this.options), numChoices: this.num }
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
            validate: (value) => isRecord(value, (key, val) => isString(key) && validateInnerModifierData(val)),
            simplify: simplifyInnerModifierDataRecord
        }
    }
}

export default ModifierChoiceData
