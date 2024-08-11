import type { IDatabaseFileData, IDatabaseFileStorage } from '..'

export interface ITextData extends IDatabaseFileData {
    title: string
    description: string
    content: string
}

export interface ITextStorage extends IDatabaseFileStorage {

}
