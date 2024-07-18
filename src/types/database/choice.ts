import type { LinkedCategoryType } from 'structure/database/files/modifier/add/linked'
import type { ModifierData } from 'structure/database/files/modifier/factory'
import type { OptionTypeKey } from 'structure/optionData'

export interface ISingleChoiceData<V = unknown> {
    readonly isChoice: true
    readonly value: V[]
}

export interface IMultipleChoiceData<V = unknown> extends ISingleChoiceData<V> {
    readonly numChoices: number
}

export interface INonChoiceData<V = unknown> {
    readonly isChoice: false
    readonly value: V
}

export type SingleChoiceData<T = unknown> = ISingleChoiceData<T> | INonChoiceData<T>
export type MultipleChoiceData<T = unknown> = IMultipleChoiceData<T> | INonChoiceData<T>

export interface IEditorChoiceDataBase {
    readonly source: ModifierData
    readonly type: string
    readonly numChoices?: number
}

export interface IEditorEnumChoiceData extends IEditorChoiceDataBase {
    readonly type: 'enum'
    readonly value: unknown[]
    readonly enum: OptionTypeKey
}

export interface IEditorValueChoiceData extends IEditorChoiceDataBase {
    readonly type: 'value' | 'id'
    readonly value: unknown[]
}

export interface IEditorExternalChoiceData extends IEditorChoiceDataBase {
    readonly type: 'linked'
    readonly category: LinkedCategoryType
}

export type IEditorChoiceData = IEditorEnumChoiceData | IEditorValueChoiceData |
IEditorExternalChoiceData