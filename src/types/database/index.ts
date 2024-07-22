import type { DocumentFileType } from 'structure/database'
import type { ObjectId, Simplify } from 'types'

export type DBResponse<T> = {
    success: true
    result: T
} | {
    success: false
    result: string | null
}

export interface IFileStructure {
    readonly id: ObjectId
    readonly holderId: ObjectId | null
    readonly type: DocumentFileType
    readonly name: string
    readonly open: boolean
    readonly children: readonly IFileStructure[]
}

export interface IDatabaseStory {
    readonly id: ObjectId
    readonly name: string
    readonly description: string
    readonly image: string | null
    readonly dateCreated: number
    readonly dateUpdated: number
}

export interface IDatabaseFile<T extends DocumentFileType = DocumentFileType, S extends object = any, D extends object = any> {
    readonly id: ObjectId
    readonly storyId: ObjectId
    readonly type: T
    readonly name: string
    readonly isOwner: boolean
    readonly dateCreated: number
    readonly dateUpdated: number
    readonly data: Readonly<D>
    readonly storage: Readonly<S>
}

export interface IDatabaseStoryData extends IDatabaseStory {
    readonly root: ObjectId | null
}

export interface IDataProperty<T, U extends T = T> {
    readonly value: U
    readonly validate: (value: unknown) => boolean
    readonly simplify?: (value: T) => unknown | null
}

export type DataPropertyMap<T, U extends T = T> = { readonly [K in keyof T]: IDataProperty<T[K], U[K]> }

export interface IDatabaseFactory<T extends object, U extends T = T> {
    readonly create: (data?: Simplify<T> | T) => U
    readonly is: (data: unknown) => data is T
    readonly validate: (data: unknown) => data is Simplify<T>
    readonly simplify: (data: T) => Simplify<T>
    readonly properties: (data: unknown) => DataPropertyMap<T, U>
}

export type ServerRequestType = 'isConnected' | 'getStory' | 'getAllStories' |
'getLastUpdatedStory' | 'getFile' | 'getFiles' | 'getFileStructure' |
'getSubscribedFiles' | 'addStory' | 'updateStory' | 'addFile' | 'copyFile' |
'updateFile' | 'moveFile' | 'deleteStory' | 'deleteFile' | 'getSubclasses' |
'getAbilitiesOfCategory' | 'getSubraces'
