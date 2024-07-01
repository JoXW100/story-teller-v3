import { isBoolean, isNumber, isRecord } from 'utils'
import type { Simplify } from 'types'
import type { SingleChoiceData, MultipleChoiceData, IMultipleChoiceData } from 'types/database/files/modifier'

export enum ModifierType {
    Add = 'add',
    Bonus = 'bonus',
    Remove = 'remove',
    Set = 'set',
    Choice = 'choice',
    Ability = 'ability'
}

export function createSingleChoiceData<T>(data: Simplify<SingleChoiceData<T>> | undefined, toValue: (value: unknown) => T, defaultChoice: boolean = false): SingleChoiceData<T> {
    if (data?.isChoice ?? defaultChoice) {
        const values: T[] = []
        if (Array.isArray(data?.value)) {
            for (const x of data.value) {
                if (x !== undefined) {
                    values.push(toValue(x))
                }
            }
        }
        return {
            isChoice: true,
            value: values
        }
    } else {
        return {
            isChoice: false,
            value: toValue(data?.value)
        }
    }
}

export function createMultipleChoiceData<T>(data: Simplify<MultipleChoiceData<T>> | undefined, toValue: (value: unknown) => T, defaultChoice: boolean = false, defaultNumChoices: number = 1): MultipleChoiceData<T> {
    const choice = createSingleChoiceData(data, toValue, defaultChoice)
    if (choice.isChoice) {
        return { ...choice, numChoices: (data as Partial<IMultipleChoiceData>).numChoices ?? defaultNumChoices }
    }
    return choice
}

export function isSingleChoiceData(value: unknown): value is SingleChoiceData {
    return isRecord(value) &&
     'isChoice' in value && isBoolean(value.isChoice) &&
     ((value.isChoice && 'value' in value && Array.isArray(value.value)) ||
      (!value.isChoice && 'value' in value))
}

export function isMultipleChoiceData(value: unknown): value is MultipleChoiceData {
    return isSingleChoiceData(value) && (!value.isChoice || ('numChoices' in value && isNumber(value.numChoices)))
}

export function validateChoiceData(value: unknown, validateValue: (value: unknown) => boolean): value is SingleChoiceData {
    return isSingleChoiceData(value) && ((value.isChoice && value.value.every(validateValue)) || (!value.isChoice && validateValue(value.value)))
}
