import { type Db, type Collection, ObjectId } from 'mongodb'
import Database, { failure, success } from '.'
import { DocumentCollectionName, DocumentCollectionTestName } from './constants'
import { isKeyOf, isRecord, keysOf } from 'utils'
import Logger from 'utils/logger'
import { DocumentFileType, FileType } from 'structure/database'
import DatabaseFile from 'structure/database/files'
import DocumentFactory from 'structure/database/files/factory'
import type { KeysOfTwo } from 'types'
import type { DBResponse, IFileStructure, IDatabaseFile } from 'types/database'
import { AbilityType } from 'structure/database/files/ability/common'

interface IDBDocument {
    _userId: string
    _storyId: ObjectId
    _holderId: ObjectId | null
    type: DocumentFileType
    name: string
    data: unknown
    dateCreated: number
    dateUpdated: number
}

function validateUpdate(update: Record<string, unknown>, type: DocumentFileType): boolean {
    const updateRecord: Record<string, unknown> = {}
    for (const updateKey of keysOf(update)) {
        const keys = updateKey.split('.')
        let relative = updateRecord
        for (let i = 0; i < keys.length - 1; i++) {
            relative = (relative[keys[i]] ??= {}) as Record<string, unknown>
        }

        relative[keys[keys.length - 1]] = update[updateKey]
    }

    for (const updateKey of keysOf(updateRecord)) {
        switch (updateKey) {
            case 'data': {
                if (!isRecord(updateRecord[updateKey])) {
                    Logger.warn('file.validateUpdate', 'Failed Data Validation', updateRecord[updateKey])
                    return false
                }

                const factory = DocumentFactory.dataFactory(type)
                if (factory === null) {
                    Logger.warn('file.validateUpdate', 'Failed Getting Factory', type)
                    return false
                }

                return factory.validate(updateRecord[updateKey])
            }
            case 'storage': {
                if (!isRecord(updateRecord[updateKey])) {
                    Logger.warn('file.validateUpdate', 'Failed Storage Validation', updateRecord[updateKey])
                    return false
                }

                const factory = DocumentFactory.storageFactory(type)
                if (factory === null) {
                    Logger.warn('file.validateUpdate', 'Failed Getting Factory', type)
                    return false
                }

                return factory.validate(updateRecord[updateKey])
            }
            case 'dateCreated':
            case 'dateUpdated':
            case 'isOwner':
                Logger.warn('file.validateUpdate', 'Failed Update Key Validation', updateKey)
                return false
            default: {
                if (!isKeyOf(updateKey, DatabaseFile.properties) || !DatabaseFile.properties[updateKey].validate(updateRecord[updateKey])) {
                    Logger.warn('file.validateUpdate', 'Failed Update Key Validation', updateKey)
                    return false
                }
            }
        }
    }

    return true
}

class FileCollection {
    public readonly collection: Collection<IDBDocument>

    constructor (database: Db, test: boolean) {
        const name = test
            ? DocumentCollectionTestName
            : DocumentCollectionName
        this.collection = database.collection<IDBDocument>(name)
    }

    /**
     * Adds a document to the database
     * @param userId The Auth0 sub of the user
     * @param storyId The id of the story
     * @param holderId The id of the holder object or null
     * @param type The document type
     * @param name The document name
     * @param data The contained data
     * @returns The id of the document, or an error message
     */
    async add(userId: string, storyId: ObjectId, holderId: ObjectId | null, type: DocumentFileType, name: string, data: object): Promise<DBResponse<string>> {
        try {
            if (storyId === null) {
                return failure('Invalid story ID')
            }

            if (!DatabaseFile.properties.type.validate(type)) {
                Logger.warn('file.add', 'Invalid file type', type)
                return failure('Invalid file type')
            }

            if (!DatabaseFile.properties.name.validate(name)) {
                Logger.warn('file.add', 'Invalid name', name)
                return failure('Invalid name')
            }

            const factory = DocumentFactory.dataFactory(type)
            if (factory === null) {
                data = {}
            } else if (!factory.validate(data)) {
                Logger.warn('file.add', 'Failed data validation')
                return failure('Failed data validation')
            }

            const response = await Database.stories!.has(userId, storyId)
            if (!response.success || !response.result) {
                Logger.warn('file.add', 'Could not validate story')
                return failure('Could not validate story')
            }

            const time = Date.now()
            const request: IDBDocument = {
                _userId: userId,
                _storyId: storyId,
                _holderId: holderId,
                type: type,
                name: name,
                data: data,
                dateCreated: time,
                dateUpdated: time
            }

            const result = await this.collection.insertOne(request)

            if (result.acknowledged) {
                Logger.log('file.add', result.insertedId, name)
                return success(String(result.insertedId))
            } else {
                Logger.warn('file.add', 'Failed to acknowledge')
                return failure('Database failed to acknowledge')
            }
        } catch (error: unknown) {
            Logger.error('file.add', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /** Adds a copy of a file to the database */
    async addCopy (userId: string, fileId: ObjectId, holderId: ObjectId, name: string): Promise<DBResponse<boolean>> {
        try {
            if (name.length === 0) {
                Logger.warn('file.addCopy', 'Invalid file name', name)
                return failure('Invalid file name')
            }

            const time = Date.now()
            const id = new ObjectId()
            const result = await this.collection.aggregate([
                {
                    $match: {
                        _userId: userId,
                        _id: fileId
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                },
                {
                    $lookup: {
                        from: this.collection.collectionName,
                        let: { storyId: '$_storyId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$_id', holderId] },
                                            { $eq: ['$_userId', userId] },
                                            { $eq: ['$_storyId', '$$storyId'] }
                                        ]
                                    }
                                }
                            },
                            { $limit: 1 }
                        ],
                        as: 'holder'
                    }
                },
                {
                    $set: {
                        _id: id,
                        _holderId: { $ifNull: [{ $first: '$holder._id' }, '$_holderId'] },
                        name: name,
                        dateCreated: time,
                        dateUpdated: time
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                },
                { $project: { holder: 0 } },
                {
                    $merge: {
                        into: this.collection.collectionName,
                        on: '_id',
                        whenMatched: 'fail',
                        whenNotMatched: 'insert'
                    }
                }
            ]).toArray()
            Logger.log('files.addCopy', result)
            return success(true)
        } catch (error: unknown) {
            Logger.error('file.addCopy', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Updates a file in the database
     * @param userId The Auth0 sub of the user
     * @param fileId The id of the file to update
     * @param update The key-value pair update
     * @returns True if the document was deleted, False otherwise, or an error message
     */
    async update(userId: string, fileId: ObjectId, type: DocumentFileType, update: Record<string, unknown>): Promise<DBResponse<boolean>> {
        try {
            if (!validateUpdate(update, type)) {
                Logger.warn('file.update', 'Invalid file update', update)
                return failure('Invalid file update')
            }

            const query: { $set: Record<string, unknown> } = {
                $set: { dateUpdated: Date.now() }
            }

            for (const key of keysOf(update)) {
                query.$set[key] = update[key]
            }

            const filter = {
                _userId: userId,
                _id: fileId,
                type: type
            } satisfies KeysOfTwo<IDatabaseFile, object>

            const result = await this.collection.updateOne(filter, query)

            if (!result.acknowledged) {
                Logger.warn('file.update', 'Database failed to acknowledge', result)
                return failure('Database failed to acknowledge')
            }

            if (result.modifiedCount < 1) {
                Logger.warn('file.update', 'No file found to update', result)
                return failure('No file found to update')
            }

            Logger.log('file.update', fileId, result.modifiedCount)
            return success(result.acknowledged)
        } catch (error: unknown) {
            Logger.error('file.update', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Moves a file by changing its holder in the database
     * @param userId The Auth0 sub of the user
     * @param fileId The id of the file to update
     * @param targetId The id of the holder file
     * @returns True if the document was deleted, False otherwise, or an error message
     */
    async move(userId: string, fileId: ObjectId, targetId: ObjectId): Promise<DBResponse<boolean>> {
        try {
            const time = Date.now()
            await this.collection.aggregate([
                {
                    $match: {
                        _userId: userId,
                        _id: fileId
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                },
                {
                    $lookup: {
                        from: this.collection.collectionName,
                        let: { storyId: '$_storyId' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$_id', targetId] },
                                            { $eq: ['$_userId', userId] },
                                            { $eq: ['$_storyId', '$$storyId'] }
                                        ]
                                    }
                                }
                            },
                            { $limit: 1 }
                        ],
                        as: 'holder'
                    }
                },
                {
                    $set: {
                        _holderId: { $ifNull: [{ $first: '$holder._id' }, '$_holderId'] },
                        dateUpdated: time
                    }
                },
                { $project: { holder: 0 } },
                {
                    $merge: {
                        into: this.collection.collectionName,
                        whenMatched: 'replace',
                        whenNotMatched: 'discard'
                    }
                }
            ]).toArray()
            Logger.log('files.move', `${String(fileId)} -> ${String(targetId)}`)
            return success(true)
        } catch (error: unknown) {
            Logger.error('file.move', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Gets a document from the database
     * @param userId The Auth0 sub of the user
     * @param fileId The id of the file to get
     * @param allowedTypes The allowed typed of the file
     * @returns The document with the given id, or an error message
     */
    async get(userId: string, fileId: ObjectId, allowedTypes?: DocumentFileType[]): Promise<DBResponse<IDatabaseFile>> {
        try {
            const result = await this.collection.aggregate<IDatabaseFile>([
                {
                    $match: {
                        _id: fileId,
                        type: allowedTypes !== undefined && allowedTypes?.length > 0
                            ? { $in: allowedTypes }
                            : { $nin: [FileType.Root] }
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        storyId: '$_storyId',
                        type: '$type',
                        name: '$name',
                        isOwner: { $eq: ['$_userId', userId] },
                        dateCreated: '$dateCreated',
                        dateUpdated: '$dateUpdated',
                        data: { $ifNull: ['$data', {}] },
                        storage: { $ifNull: ['$storage', {}] }
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                },
                { $limit: 1 }
            ]).toArray()

            if (result.length > 0) {
                Logger.log('file.get', result[0].name)
                return success(result[0])
            } else {
                Logger.warn('file.get', null)
                return failure('No file with id=' + String(fileId))
            }
        } catch (error) {
            Logger.error('file.get', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Gets multiple documents from the database
     * @param userId The Auth0 sub of the user
     * @param fileIds The ids of the files to get
     * @param allowedTypes The allowed typed of the files
     * @returns The documents with the given ids, or an error message
     */
    async getMultiple(userId: string, fileIds: ObjectId[], allowedTypes?: DocumentFileType[]): Promise<DBResponse<IDatabaseFile[]>> {
        try {
            if (fileIds.length === 0) {
                return success([])
            }
            const result = await this.collection.aggregate<IDatabaseFile>([
                {
                    $match: {
                        _id: { $in: fileIds },
                        type: allowedTypes !== undefined && allowedTypes?.length > 0
                            ? { $in: allowedTypes }
                            : { $nin: [FileType.Root, FileType.Empty] }
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        storyId: '$_storyId',
                        type: '$type',
                        name: '$name',
                        isOwner: { $eq: ['$_userId', userId] },
                        dateCreated: '$dateCreated',
                        dateUpdated: '$dateUpdated',
                        data: { $ifNull: ['$data', {}] },
                        storage: { $ifNull: ['$storage', {}] }
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                }
            ]).toArray()

            if (result.length > 0) {
                Logger.log('file.getMultiple', result.map(x => x.name).join(', '))
                return success(result)
            } else {
                Logger.warn('file.getMultiple', null)
                return failure('Failed to get files with ids = ' + fileIds.join(', '))
            }
        } catch (error) {
            Logger.error('file.getMultiple', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Gets subscribed documents from the database
     * @param userId The Auth0 sub of the user
     * @param allowedTypes The allowed typed of the files
     * @returns The subscribed documents, or an error message
     */
    async getSubscribedFiles(userId: string, allowedTypes?: DocumentFileType[]): Promise<DBResponse<IDatabaseFile[]>> {
        try {
            const result = await this.collection.aggregate<IDatabaseFile>([
                {
                    $match: {
                        _userId: userId,
                        type: allowedTypes !== undefined && allowedTypes?.length > 0
                            ? { $in: allowedTypes }
                            : { $nin: [FileType.Root, FileType.Empty] }
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        storyId: '$_storyId',
                        type: '$type',
                        name: '$name',
                        isOwner: { $eq: ['$_userId', userId] },
                        dateCreated: '$dateCreated',
                        dateUpdated: '$dateUpdated',
                        data: { $ifNull: ['$data', {}] },
                        storage: { $ifNull: ['$storage', {}] }
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                }
            ]).toArray()

            Logger.log('file.getSubscribedFiles', result.map(x => x.name).join(', '))
            return success(result)
        } catch (error) {
            Logger.error('file.getSubscribedFiles', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Gets subscribed subclasses to the given class
     * @param userId The Auth0 sub of the user
     * @param storyId The story to fetch subclasses for
     * @param classId The id of the class to get subclasses to
     * @returns The subscribed subclass documents, or an error message
     */
    async getSubclasses(userId: string, storyId: ObjectId, classId: ObjectId): Promise<DBResponse<IDatabaseFile[]>> {
        try {
            const result = await this.collection.aggregate<IDatabaseFile>([
                {
                    $match: {
                        _userId: userId,
                        _storyId: storyId,
                        type: DocumentFileType.Subclass,
                        'data.parentClass': String(classId)
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        storyId: '$_storyId',
                        type: '$type',
                        name: '$name',
                        isOwner: { $eq: ['$_userId', userId] },
                        dateCreated: '$dateCreated',
                        dateUpdated: '$dateUpdated',
                        data: { $ifNull: ['$data', {}] },
                        storage: { $ifNull: ['$storage', {}] }
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                }
            ]).toArray()

            Logger.log('file.getSubclasses', String(classId), result.map(x => x.name).join(', '))
            return success(result)
        } catch (error) {
            Logger.error('file.getSubclasses', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Gets subscribed custom abilities of a specific category
     * @param userId The Auth0 sub of the user
     * @param storyId The story to fetch abilities for
     * @param category The category of abilities
     * @returns The subscribed ability documents, or an error message
     */
    async getAbilitiesOfCategory(userId: string, storyId: ObjectId, category: string): Promise<DBResponse<IDatabaseFile[]>> {
        try {
            const result = await this.collection.aggregate<IDatabaseFile>([
                {
                    $match: {
                        _userId: userId,
                        _storyId: storyId,
                        type: DocumentFileType.Ability,
                        'data.type': AbilityType.Custom,
                        'data.category': category
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        storyId: '$_storyId',
                        type: '$type',
                        name: '$name',
                        isOwner: { $eq: ['$_userId', userId] },
                        dateCreated: '$dateCreated',
                        dateUpdated: '$dateUpdated',
                        data: { $ifNull: ['$data', {}] },
                        storage: { $ifNull: ['$storage', {}] }
                    } satisfies KeysOfTwo<IDatabaseFile, object>
                }
            ]).toArray()

            Logger.log('file.getFeats', result.map(x => x.name).join(', '))
            return success(result)
        } catch (error) {
            Logger.error('file.getFeats', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Deletes a document from the database
     * @param userId The Auth0 sub of the user
     * @param fileId The id of the file to delete
     * @returns True if the file was deleted, False otherwise, or an error message
     */
    async delete(userId: string, fileId: ObjectId): Promise<DBResponse<boolean>> {
        try {
            const filter = {
                _userId: userId,
                _id: fileId
            } satisfies KeysOfTwo<IDBDocument, object>

            const result = await this.collection.deleteOne(filter)

            if (result.acknowledged) {
                Logger.log('file.delete', fileId, result.deletedCount > 0)
                return success(result.deletedCount > 0)
            } else {
                Logger.warn('file.delete', 'Failed to acknowledge')
                return failure('Database failed to acknowledge')
            }
        } catch (error) {
            Logger.error('file.delete', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Deletes documents with the given story id from the database
     * @param userId The Auth0 sub of the user
     * @param storyId The id of the story
     * @returns The number of documents deleted, or an error message
     */
    async deleteFrom(userId: string, storyId: ObjectId): Promise<DBResponse<number>> {
        try {
            const filter = {
                _userId: userId,
                _storyId: storyId
            } satisfies KeysOfTwo<IDBDocument, object>

            const result = await this.collection.deleteMany(filter)

            if (result.acknowledged) {
                Logger.log('file.deleteFrom', storyId, result.deletedCount)
                return success(result.deletedCount)
            } else {
                Logger.warn('file.deleteFrom', 'Failed to acknowledge')
                return failure('Database failed to acknowledge')
            }
        } catch (error) {
            Logger.error('file.delete', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Removes all documents
     * @returns The number of documents removed, or an error message
     */
    async clear(): Promise<DBResponse<number>> {
        try {
            const result = await this.collection.deleteMany()

            if (result.acknowledged) {
                Logger.log('file.clear', result.deletedCount)
                return success(result.deletedCount)
            } else {
                Logger.warn('file.clear', 'Failed to acknowledge')
                return failure('Database failed to acknowledge')
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Gets the file structure of story in the database
     * @param userId The Auth0 sub of the user
     * @param storyId The id of the story
     * @returns The file structure of the given story
     */
    async getStructure (userId: string, storyId: ObjectId): Promise<DBResponse<IFileStructure>> {
        try {
            const result = (await this.collection.aggregate<IFileStructure>([
                {
                    $match: {
                        _userId: userId,
                        _storyId: storyId
                    }
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        holderId: '$_holderId',
                        type: '$type',
                        name: '$name',
                        open: { $ifNull: ['$data.open', false] },
                        children: []
                    } satisfies KeysOfTwo<IFileStructure, object>
                }
            ]).toArray())

            let root: IFileStructure | null = null
            const data: Record<string, IFileStructure> = {}
            for (const value of result) {
                if (value.type === FileType.Root) {
                    root = value
                } else {
                    data[value.id] = value
                }
            }

            if (root === null) {
                return failure('Database failed finding root file object.')
            }

            for (const file of Object.values(data)) {
                const holder = data[file.holderId ?? root.id] ?? root;
                (holder.children as IFileStructure[]).push(file)
            }

            Logger.log('file.getStructure', result.length)
            return success(root)
        } catch (error: unknown) {
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }
}

export default FileCollection
