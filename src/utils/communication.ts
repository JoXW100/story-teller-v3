import Logger from './logger'
import { isEnum, isObjectId, keysOf } from 'utils'
import { type DocumentFileType, DocumentType, type FlagType } from 'structure/database'
import FileStructure from 'structure/database/fileStructure'
import type AbilityDocument from 'structure/database/files/ability'
import type DatabaseStory from 'structure/database/story'
import type { ObjectId } from 'types'
import type { IDatabaseStory, DBResponse, IFileStructure, IDatabaseFile, ServerRequestType } from 'types/database'
import type { Document, DocumentTypeMap, IDocumentFactory } from 'types/database/files/factory'
import type { IStoryFactory } from 'types/database/story'

type FetchMethod = 'GET' | 'PUT' | 'DELETE'
type FetchParams = Record<string, unknown>

export interface Open5eResponse<T> {
    readonly count: number
    readonly next: string | null
    readonly previous: string | null
    readonly results: T[]
}

abstract class Communication {
    private static readonly databaseRootURL = '/api/database/'
    private static readonly serverRootURL = '/api/server'
    private static readonly open5eRootURL = 'https://api.open5e.com/'

    private static storyFactory: IStoryFactory
    private static documentFactory: IDocumentFactory

    public static readonly cache = new Map<ObjectId, Document>()

    private static async databaseFetch<T>(type: ServerRequestType, method: FetchMethod, params: FetchParams = {}): Promise<DBResponse<T>> {
        try {
            let data: Response | null = null
            switch (method) {
                case 'PUT':
                    data = await fetch(this.databaseRootURL + type, {
                        method: method,
                        body: JSON.stringify(params)
                    })
                    break
                case 'DELETE':
                case 'GET':
                default: {
                    let query: string = this.databaseRootURL + type
                    const paramNames = keysOf(params)
                    for (let i = 0; i < paramNames.length; i++) {
                        const param = paramNames[i]
                        if (params[param] === undefined) {
                            continue
                        }
                        const symbol = i === 0 ? '?' : '&'
                        query += `${symbol}${param}=${String(params[param])}`
                    }
                    data = await fetch(query, { method: method })
                } break
            }
            return await data.json()
        } catch (error) {
            Logger.throw('communication.databaseFetch', error)
            return { success: false, result: String(error) }
        }
    }

    public static init(storyFactory: IStoryFactory, documentFactory: IDocumentFactory): void {
        this.storyFactory = storyFactory
        this.documentFactory = documentFactory
    }

    public static async debug(params: FetchParams = {}): Promise<DBResponse<boolean>> {
        return await this.databaseFetch<boolean>('debug', 'PUT', params)
    }

    public static async getStory(storyId: ObjectId): Promise<DBResponse<DatabaseStory>> {
        const response = await this.databaseFetch<IDatabaseStory>('getStory', 'GET', {
            storyId: storyId
        })
        Logger.log('Communication.getStory', response)
        if (response.success) {
            if (this.storyFactory.validate(response.result)) {
                return { success: true, result: this.storyFactory.create(response.result) }
            } else {
                return { success: false, result: 'Failed validation' }
            }
        }
        return response
    }

    public static async getAllStories(): Promise<DBResponse<DatabaseStory[]>> {
        const response = await this.databaseFetch<IDatabaseStory[]>('getAllStories', 'GET')
        if (response.success) {
            const result: DatabaseStory[] = []
            for (const story of response.result) {
                if (this.storyFactory.validate(story)) {
                    result.push(this.storyFactory.create(story))
                }
            }
            Logger.log('Communication.getAllStories', result)
            return { success: true, result: result }
        }
        return response
    }

    public static async getAllAvailableSources(): Promise<DBResponse<DatabaseStory[]>> {
        const response = await this.databaseFetch<IDatabaseStory[]>('getAllAvailableSources', 'GET')
        if (response.success) {
            const result: DatabaseStory[] = []
            for (const story of response.result) {
                if (this.storyFactory.validate(story)) {
                    result.push(this.storyFactory.create(story))
                }
            }
            return { success: true, result: result }
        }
        return response
    }

    public static async getLastUpdatedStory(): Promise<DatabaseStory | null> {
        const response = await this.databaseFetch<IDatabaseStory>('getLastUpdatedStory', 'GET')
        if (response.success && this.storyFactory.validate(response.result)) {
            return this.storyFactory.create(response.result)
        }
        return null
    }

    public static async getLastUpdatedFiles(storyId: ObjectId, count: number = 1): Promise<DBResponse<DocumentTypeMap[DocumentType][]>> {
        const response = await this.databaseFetch<IDatabaseFile[]>('getLastUpdatedFiles', 'GET', {
            storyId: storyId,
            count: count
        })

        if (response.success) {
            if (!response.result.every(value => this.documentFactory.validate(value))) {
                Logger.error('Communication.getLastUpdatedFiles', response.result)
                return { success: false, result: 'Failed to get file, validation failed' }
            } else {
                const result: DocumentTypeMap[DocumentType][] = []
                for (const document of response.result) {
                    const instance = this.documentFactory.create(document)
                    if (instance === null) {
                        throw new Error('Validated file creation resulted in null value')
                    }
                    this.cache.set(instance.id, instance)
                    result.push(instance as DocumentTypeMap[DocumentType])
                }
                return {
                    success: true,
                    result: result
                }
            }
        }
        return response
    }

    public static async addStory(name: string, description: string, image: string | null, sources: ObjectId[], flags: FlagType[]): Promise<DBResponse<ObjectId>> {
        Logger.log('Communication.addStory', name, description, image, sources, flags)
        const response = await this.databaseFetch<ObjectId>('addStory', 'PUT', {
            name: name,
            description: description,
            image: image,
            sources: sources,
            flags: flags
        })
        if (response.success && !isObjectId(response.result)) {
            Logger.error('Communication.addStory', response.result)
            return { success: false, result: 'Response was not a valid id' }
        }
        return response
    }

    public static async updateStory(storyId: ObjectId, update: Record<string, unknown>): Promise<DBResponse<boolean>> {
        Logger.log('Communication.updateStory', storyId, update)
        const response = await this.databaseFetch<boolean>('updateStory', 'PUT', {
            storyId: storyId,
            update: update
        })
        return response
    }

    public static async deleteStory(storyId: ObjectId): Promise<DBResponse<boolean>> {
        const response = await this.databaseFetch<boolean>('deleteStory', 'DELETE', {
            storyId: storyId
        })
        return response
    }

    public static async getFile(fileId: ObjectId, type?: never): Promise<DBResponse<Document>>
    public static async getFile<T extends DocumentType>(fileId: ObjectId, type: T): Promise<DBResponse<DocumentTypeMap[T]>>
    public static async getFile<T extends DocumentType>(fileId: ObjectId, type?: T): Promise<DBResponse<DocumentTypeMap[T] | Document>> {
        const file = this.cache.get(fileId)
        if (file !== undefined && (type === undefined || file.type === type)) {
            return { success: true, result: file }
        }

        const response = await this.databaseFetch<IDatabaseFile>('getFile', 'GET', {
            fileId: fileId,
            allowedTypes: type !== undefined ? [type] : undefined
        })
        if (response.success) {
            if (!this.documentFactory.validate(response.result)) {
                Logger.error('Communication.getFile', response.result)
                return { success: false, result: 'Failed to get file, type missmatch' }
            } else {
                const instance = this.documentFactory.create(response.result)
                if (instance === null) {
                    throw new Error('Validated file creation resulted in null value')
                }

                this.cache.set(instance.id, instance);
                return { success: true, result: instance }
            }
        }
        return response
    }

    public static async getFileOfTypes<T extends readonly DocumentType[]>(fileId: ObjectId, allowedTypes: T): Promise<DBResponse<DocumentTypeMap[T[number]]>> {
        const file = this.cache.get(fileId)
        if (file !== undefined && isEnum(file.type, DocumentType) && allowedTypes.includes(file.type)) {
            return { success: true, result: file as DocumentTypeMap[T[number]] }
        }

        const response = await this.databaseFetch<IDatabaseFile>('getFile', 'GET', {
            fileId: fileId,
            allowedTypes: allowedTypes
        })
        if (response.success) {
            if (!this.documentFactory.validate(response.result)) {
                Logger.error('Communication.getFileOfTypes', response.result)
                return { success: false, result: 'Failed to get file, type missmatch' }
            } else {
                const instance = this.documentFactory.createOfTypes(response.result, allowedTypes)
                if (instance === null) {
                    throw new Error('Validated file creation resulted in null value')
                }

                this.cache.set(instance.id, instance)
                return { success: true, result: instance }
            }
        }
        return response
    }

    public static async getFilesOfTypes<T extends readonly DocumentType[]>(fileIds: readonly ObjectId[], allowedTypes: T): Promise<DBResponse<Record<ObjectId, DocumentTypeMap[T[number]]>>> {
        const result: Record<ObjectId, DocumentTypeMap[T[number]]> = {}
        const rest = new Set<ObjectId>()
        for (const id of fileIds) {
            const type = this.cache.get(id)?.type
            if (isEnum(type, DocumentType) && allowedTypes.includes(type)) {
                result[id] = this.cache.get(id) as DocumentTypeMap[T[number]]
            } else {
                rest.add(id)
            }
        }

        if (rest.size <= 0) {
            return { success: true, result: result }
        }

        const response = await this.databaseFetch<IDatabaseFile[]>('getFiles', 'GET', {
            fileIds: Array.from(rest),
            allowedTypes: allowedTypes
        })

        if (response.success) {
            if (!response.result.every(value => this.documentFactory.validate(value))) {
                Logger.error('Communication.getFilesOfTypes', response.result)
                return { success: false, result: 'Failed to get file, type missmatch' }
            } else {
                for (const document of response.result) {
                    const instance = this.documentFactory.createOfTypes(document, allowedTypes)
                    if (instance === null) {
                        throw new Error('Validated file creation resulted in null value')
                    }
                    this.cache.set(instance.id, result[instance.id] = instance)
                }
                return {
                    success: true,
                    result: result
                }
            }
        }
        return response
    }

    public static async getAllFiles(allowedTypes?: never, requiredFlags?: FlagType[], sources?: readonly ObjectId[]): Promise<DBResponse<Document[]>>
    public static async getAllFiles<T extends readonly DocumentType[]>(allowedTypes: T, requiredFlags?: readonly FlagType[], sources?: readonly ObjectId[]): Promise<DBResponse<DocumentTypeMap[T[number]][]>>
    public static async getAllFiles<T extends readonly DocumentType[]>(allowedTypes?: T, requiredFlags?: readonly FlagType[], sources?: readonly ObjectId[]): Promise<DBResponse<(DocumentTypeMap[T[number]] | Document)[]>> {
        const response = await this.databaseFetch<IDatabaseFile[]>('getAll', 'GET', {
            sources: sources ?? [],
            allowedTypes: allowedTypes ?? [],
            requiredFlags: requiredFlags ?? []
        })
        if (response.success) {
            if (!response.result.every(value => this.documentFactory.validate(value))) {
                Logger.error('Communication.getAllFiles', response.result)
                return { success: false, result: 'Failed to get file, type missmatch' }
            } else {
                return {
                    success: true,
                    result: response.result.map(value => {
                        const instance = this.documentFactory.create(value)
                        if (instance === null) {
                            throw new Error('Validated file creation resulted in null value')
                        }
                        this.cache.set(value.id, instance)
                        return instance
                    })
                }
            }
        }
        return response
    }

    public static async getSubFiles<T extends DocumentType>(parentId: ObjectId, type: T, sources: ObjectId[] = []): Promise<DBResponse<DocumentTypeMap[T][]>> {
        const response = await this.databaseFetch<IDatabaseFile[]>('getSubFiles', 'GET', {
            parentId: parentId,
            fileType: type,
            sources: sources
        })
        if (response.success) {
            if (!response.result.every(value => this.documentFactory.validate(value))) {
                Logger.error('Communication.getSubFiles', response.result)
                return { success: false, result: 'Failed to get file, type missmatch' }
            } else {
                return {
                    success: true,
                    result: response.result.map(value => {
                        const instance = this.documentFactory.createOfTypes(value, [type])
                        if (instance === null) {
                            throw new Error('Validated file creation resulted in null value')
                        }
                        this.cache.set(value.id, instance)
                        return instance
                    })
                }
            }
        }
        return response
    }

    public static async getAbilitiesOfCategory(category: string): Promise<DBResponse<AbilityDocument[]>> {
        const response = await this.databaseFetch<IDatabaseFile[]>('getAbilitiesOfCategory', 'GET', {
            category: category
        })
        if (response.success) {
            if (!response.result.every(value => this.documentFactory.validate(value))) {
                Logger.error('Communication.getFeats', response.result)
                return { success: false, result: 'Failed to get file, type missmatch' }
            } else {
                return {
                    success: true,
                    result: response.result.map(value => {
                        const instance = this.documentFactory.createOfTypes(value, [DocumentType.Ability])
                        if (instance === null) {
                            throw new Error('Validated file creation resulted in null value')
                        }
                        this.cache.set(value.id, instance)
                        return instance
                    })
                }
            }
        }
        return response
    }

    public static async addFile(storyId: ObjectId, holderId: ObjectId, name: string, type: DocumentFileType, data?: object): Promise<DBResponse<ObjectId>> {
        const response = await this.databaseFetch<ObjectId>('addFile', 'PUT', {
            storyId: storyId,
            holderId: holderId,
            name: name,
            type: type,
            data: data
        })
        if (response.success && !isObjectId(response.result)) {
            Logger.error('Communication.addFile', response.result)
            return { success: false, result: 'Response was not a valid id' }
        }
        return response
    }

    public static async copyFile(fileId: ObjectId, holderId: ObjectId, name: string): Promise<DBResponse<boolean>> {
        const response = await this.databaseFetch<boolean>('copyFile', 'PUT', {
            fileId: fileId,
            holderId: holderId,
            name: name
        })
        return response
    }

    public static async updateFile(fileId: ObjectId, type: DocumentFileType, update: Record<string, unknown>): Promise<DBResponse<boolean>> {
        this.cache.delete(fileId)
        Logger.log('Communication.updateFile', fileId, type, update)
        const response = await this.databaseFetch<boolean>('updateFile', 'PUT', {
            fileId: fileId,
            type: type,
            update: update
        })
        return response
    }

    public static async publishFile(fileId: ObjectId, type: DocumentFileType, publish: boolean): Promise<DBResponse<boolean>> {
        this.cache.delete(fileId)
        Logger.log('Communication.publishFile', fileId, type, publish)
        const response = await this.databaseFetch<boolean>('publishFile', 'PUT', {
            fileId: fileId,
            type: type,
            publish: publish
        })
        return response
    }

    public static async moveFile(fileId: ObjectId, targetId: ObjectId): Promise<DBResponse<boolean>> {
        const response = await this.databaseFetch<boolean>('moveFile', 'PUT', {
            fileId: fileId,
            targetId: targetId
        })
        return response
    }

    public static async deleteFile(fileId: ObjectId): Promise<DBResponse<boolean>> {
        this.cache.delete(fileId)
        const response = await this.databaseFetch<boolean>('deleteFile', 'DELETE', {
            fileId: fileId
        })
        return response
    }

    public static async getFileStructure(storyId: ObjectId): Promise<DBResponse<FileStructure>> {
        const response = await this.databaseFetch<IFileStructure>('getFileStructure', 'GET', {
            storyId: storyId
        })
        if (response.success) {
            return { success: true, result: new FileStructure(response.result) }
        }
        return response
    }

    public static async open5eFetchAll<T>(type: string, query?: Record<string, string | number>, fields: string[] = []): Promise<Open5eResponse<T>> {
        try {
            const limit = 5000
            const filterQuery = query !== undefined && Object.keys(query).length > 0
                ? Object.keys(query).map((key) => `${key}=${query[key]}`).join('&') + `&limit=${limit}`
                : `limit=${limit}`
            const fieldQuery = fields.length > 0
                ? `/?fields=${fields.join(',')}&${filterQuery}`
                : `/?${filterQuery}`
            const data = await fetch(this.open5eRootURL + type + fieldQuery)
            return await data.json() as Open5eResponse<T>
        } catch (error) {
            Logger.throw('communication.open5eFetchAll', error)
            return {
                count: 0,
                next: null,
                previous: null,
                results: []
            } satisfies Open5eResponse<T>
        }
    }

    public static async open5eFetchOne<T extends object>(type: string, id: string): Promise<T | null> {
        try {
            const data = await fetch(`${this.open5eRootURL}${type}/${id}`)
            const result = await data.json() as T
            return result
        } catch (error) {
            Logger.throw('Communication.open5eFetchOne', error)
            return null
        }
    }
}

export default Communication
