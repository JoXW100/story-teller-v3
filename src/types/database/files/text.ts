import type { IDatabaseFileData, IDatabaseFileStorage } from '..'

export interface ITextData extends IDatabaseFileData {
    readonly title: string
    readonly description: string
    readonly content: string
}

export interface ITextStorage extends IDatabaseFileStorage {

}
