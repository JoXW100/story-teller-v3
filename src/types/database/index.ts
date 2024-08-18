import type { DocumentIDataMap, DocumentIStorageMap } from './files'
import type { DocumentFileType, FlagType } from 'structure/database'
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
    readonly flags: readonly FlagType[]
    readonly children: readonly IFileStructure[]
}

export interface IDatabaseStory {
    readonly id: ObjectId
    readonly name: string
    readonly description: string
    readonly image: string | null
    readonly sources: ObjectId[]
    readonly flags: FlagType[]
    readonly dateCreated: number
    readonly dateUpdated: number
}

export interface IDatabaseFileData {}
export interface IDatabaseFileStorage {}
export interface IDatabaseFile<T extends DocumentFileType = DocumentFileType, D extends DocumentIDataMap[T] = DocumentIDataMap[T], S extends DocumentIStorageMap[T] = DocumentIStorageMap[T]> {
    readonly id: ObjectId
    readonly storyId: ObjectId
    readonly type: T
    readonly name: string
    readonly flags: FlagType[]
    readonly isOwner: boolean
    readonly dateCreated: number
    readonly dateUpdated: number
    readonly data: D
    readonly storage: S
}

export interface IDataProperty<T, U extends T = T> {
    readonly value: U
    readonly validate: (value: unknown) => boolean
    readonly simplify?: (value: T) => unknown | null
}

export interface ISubFile {
    readonly parentFile: ObjectId | null
}

export type DataPropertyMap<T, U extends T = T> = { readonly [K in keyof T]: IDataProperty<T[K], U[K]> }

export interface IDatabaseFactory<T extends object = object, U extends T = T> {
    readonly create: (data?: Simplify<T> | T) => U
    readonly is: (data: unknown) => data is T
    readonly validate: (data: unknown) => data is Simplify<T>
    readonly simplify: (data: T) => Simplify<T>
    readonly properties: (data: unknown) => DataPropertyMap<T, U>
}

export type ServerRequestType = 'isConnected' | 'getStory' | 'getAllStories' |
'getLastUpdatedStory' | 'getFile' | 'getFiles' | 'getFileStructure' |
'getAll' | 'addStory' | 'updateStory' | 'addFile' | 'copyFile' |
'updateFile' | 'moveFile' | 'deleteStory' | 'deleteFile' | 'getSubFiles' |
'getAbilitiesOfCategory' | 'getAllAvailableSources' | 'debug' | 'publishFile' |
'getLastUpdatedFiles'
