import type { CreateFilePopupData } from 'components/dialogs/createFile'
import type { LanguageKey } from 'data'
import type { DocumentType } from 'structure/database'
import type { IDatabaseFile } from './database'

export enum InputType {
    File = 'file',
    Folder = 'folder',
    Import = 'import'
}

export interface IDialogParams {
    id: string
}

export interface IConfirmationDialogParams extends IDialogParams {
    headerTextId: LanguageKey
    headerTextArgs?: string[]
    bodyTextId?: LanguageKey
    bodyTextArgs?: string[]
}

export interface INoticeDialogParams extends IDialogParams {
    headerTextId: LanguageKey
    headerTextArgs?: string[]
    bodyTextId?: LanguageKey
    bodyTextArgs?: string[]
}

export interface ISelectFileDialogParams extends IDialogParams {
    allowedTypes: readonly DocumentType[]
}

export interface ICreateFileDialogParams extends IDialogParams {
    type: InputType
}

export interface IDialogPromise {
    onClose: (handler: () => void) => Omit<this, 'onClose'>
}

export interface IConfirmationDialogPromise extends IDialogPromise {
    onConfirm: (handler: () => void) => Omit<this, 'onConfirm'>
    onCancel: (handler: () => void) => Omit<this, 'onCancel'>
}

export interface ICreateFileDialogPromise extends IDialogPromise {
    onConfirm: (handler: (data: CreateFilePopupData) => void) => Omit<this, 'onConfirm'>
}

export interface ISelectFileDialogPromise extends IDialogPromise {
    onSelect: (handler: (file: IDatabaseFile) => void) => Omit<this, 'onSelect'>
}

export interface IDialogArgs<T extends IDialogParams = IDialogParams, P extends IDialogPromise = IDialogPromise> {
    params: T
    promise: P
}

export interface DialogTypeMap {
    confirmation: IDialogArgs<IConfirmationDialogParams, IConfirmationDialogPromise>
    notice: IDialogArgs<INoticeDialogParams, IDialogPromise>
    createFile: IDialogArgs<ICreateFileDialogParams, ICreateFileDialogPromise>
    selectFile: IDialogArgs<ISelectFileDialogParams, ISelectFileDialogPromise>
}

export type DialogArgs<K extends keyof DialogTypeMap> = DialogTypeMap[K]['params'] & { callback: (type: keyof DialogTypeMap[K]['promise'], ...args: any[]) => void }
export type OpenDialogHandler<K extends keyof DialogTypeMap> = (type: K, params: DialogTypeMap[K]['params']) => DialogTypeMap[K]['promise']
export type DialogDetails<K extends keyof DialogTypeMap = keyof DialogTypeMap> = K extends keyof DialogTypeMap ? {
    show: true
    id: string
    type: K
    params: DialogTypeMap[K]['params']
    promise: DialogTypeMap[K]['promise']
} | {
    show: false
    id: string | null
} : never
