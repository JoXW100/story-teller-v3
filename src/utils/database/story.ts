import { type Db, type Collection, type ObjectId } from 'mongodb'
import Database, { failure, success } from '.'
import { Collections } from './constants'
import { isKeyOf, keysOf } from 'utils'
import Logger from 'utils/logger'
import { FileType, FlagType } from 'structure/database'
import StoryFactory from 'structure/database/story/factory'
import type { KeysOfTwo } from 'types'
import type { IDatabaseStory, DBResponse } from 'types/database'

export interface IDBStory {
    _id: ObjectId
    _userId: string
    flags: FlagType[]
    name: string
    description: string
    image: string | null
    sources: ObjectId[]
    dateCreated: number
    dateUpdated: number
}

function validateUpdate(update: Record<string, unknown>): boolean {
    const updateRecord: Record<string, unknown> = {}
    for (const updateKey of keysOf(update)) {
        const keys = updateKey.split('.')
        let relative = updateRecord
        for (let i = 0; i < keys.length - 1; i++) {
            relative = (relative[keys[i]] ??= {}) as Record<string, unknown>
        }

        relative[keys[keys.length - 1]] = update[updateKey]
    }

    const properties = StoryFactory.properties()
    for (const updateKey of keysOf(updateRecord)) {
        if (!isKeyOf(updateKey, properties) || !properties[updateKey].validate(updateRecord[updateKey])) {
            Logger.warn('story.validateUpdate', 'Failed Update Key Validation', updateKey)
            return false
        }
    }

    return true
}

class StoryCollection {
    public readonly collection: Collection<IDBStory>

    constructor (database: Db, test: boolean) {
        const name = test
            ? Collections.stories.test
            : Collections.stories.main
        this.collection = database.collection<IDBStory>(name)
    }

    /**
     * Adds a story to the database
     * @param userId The Auth0 sub of the user
     * @param name The name of the story
     * @param description The description of the story
     * @param image The url to an image, or null
     * @returns A response containing the id of the story, or an error message
     */
    async add(userId: string, name: string, description: string, image: string | null, sources: ObjectId[], flags: FlagType[]): Promise<DBResponse<string>> {
        try {
            const time = Date.now()
            const request: Omit<IDBStory, '_id' | '_userId'> = {
                name: name,
                description: description,
                image: image === 'null' ? null : image,
                sources: sources,
                flags: Array.from(new Set(flags)),
                dateCreated: time,
                dateUpdated: time
            }

            const files = Database.files

            if (files === null) {
                Logger.warn('story.add', 'Collection was disabled')
                return failure('Documents collection was disabled')
            }

            if (!StoryFactory.validate(request)) {
                Logger.warn('story.add', 'Failed validation')
                return failure('Failed story validation')
            }

            if (process.env.NODE_ENV !== 'development' && request.flags.includes(FlagType.Official)) {
                Logger.warn('story.add', 'Failed flag validation')
                return failure('Failed story flag validation')
            }

            const result = await this.collection.insertOne({ ...request, _userId: userId } as unknown as IDBStory)

            if (!result.acknowledged) {
                Logger.warn('story.add', 'Failed to acknowledge')
                return failure('Database failed to acknowledge')
            }

            const response = await files.add(userId, result.insertedId, null, FileType.Root, '_root', {})
            if (response.success) {
                Logger.log('story.add', result.insertedId, name)
                return success(String(result.insertedId))
            } else {
                const response = await this.collection.deleteOne({ _id: result.insertedId })
                let message: string
                if (response.acknowledged && response.deletedCount > 0) {
                    message = 'Cleanup Success'
                } else {
                    message = 'Cleanup Failed'
                }
                Logger.warn('story.add', 'Failed to insert root, ' + message)
                return failure('Failed to insert root')
            }
        } catch (error) {
            Logger.error('story.add', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Adds a story to the database
     * @param userId The Auth0 sub of the user
     * @param storyId The id of the story to update
     * @param update The key-value pair update
     * @returns A response containing the id of the story, or an error message
     */
    async update(userId: string, storyId: ObjectId, update: Record<string, unknown>): Promise<DBResponse<boolean>> {
        try {
            if (!validateUpdate(update)) {
                Logger.warn('story.update', 'Invalid story update', update)
                return failure('Invalid story update')
            }

            if (process.env.NODE_ENV !== 'development' && 'flags' in update && (update.flags as FlagType[]).includes(FlagType.Official)) {
                Logger.warn('story.update', 'Failed flag validation')
                return failure('Failed story flag validation')
            }

            const query: { $set: Record<string, unknown> } = {
                $set: { dateUpdated: Date.now() }
            }

            for (const key of keysOf(update)) {
                query.$set[key] = update[key]
            }

            const result = await this.collection.updateOne({
                _userId: userId,
                _id: storyId
            }, query)

            if (!result.acknowledged) {
                Logger.warn('story.update', result)
                return failure('Database failed to acknowledge')
            }

            if (result.modifiedCount < 1) {
                Logger.warn('story.update', result)
                return failure('No story found to update')
            }

            Logger.log('story.update', storyId, Object.keys(update).map((key) => `${key}: ${String(update[key])}`).join(', '))
            return success(result.matchedCount > 0)
        } catch (error) {
            Logger.error('story.update', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Gets a story and finds its root document from the database
     * @param userId The Auth0 sub of the user
     * @param storyId The id of the story to get
     * @returns A response containing the story with a root, or an error message
     */
    async get(userId: string, storyId: ObjectId): Promise<DBResponse<IDatabaseStory>> {
        try {
            const result = await this.collection.aggregate<IDatabaseStory>([
                {
                    $match: {
                        _userId: userId,
                        _id: storyId
                    }
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        name: '$name',
                        description: '$description',
                        image: '$image',
                        sources: '$sources',
                        flags: '$flags',
                        dateCreated: '$dateCreated',
                        dateUpdated: '$dateUpdated'
                    } satisfies KeysOfTwo<IDatabaseStory, object>
                }
            ]).toArray()

            if (result.length > 0) {
                Logger.log('story.get', result[0].name)
                return success(result[0])
            } else {
                Logger.log('story.get', null)
                return failure('No story with id=' + String(storyId))
            }
        } catch (error) {
            Logger.error('story.get', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Checks if the given user owns the given story
     * @param userId The user to check ownership of
     * @param storyId The story to check owner of
     * @returns True if the user owns the story, false otherwise
     */
    async has(userId: string, storyId: ObjectId): Promise<DBResponse<boolean>> {
        try {
            const result = await this.collection.findOne({
                _id: storyId,
                _userId: userId
            })
            Logger.error('story.has', storyId, result !== null)
            return success(result !== null)
        } catch (error) {
            Logger.error('story.has', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Gets all story from the given user
     * @param userId The Auth0 sub of the user
     * @returns A response containing an array of story, or an error message
     */
    async getAll(userId: string): Promise<DBResponse<IDatabaseStory[]>> {
        try {
            const result = await this.collection.aggregate<IDatabaseStory>([
                {
                    $match: {
                        _userId: userId
                    } satisfies Partial<IDBStory>
                },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        name: '$name',
                        description: '$description',
                        image: '$image',
                        sources: '$sources',
                        flags: '$flags',
                        dateCreated: '$dateCreated',
                        dateUpdated: '$dateUpdated'
                    } satisfies KeysOfTwo<IDatabaseStory, object>
                }
            ]).toArray()
            Logger.log('story.getAll', result.length, result.map(x => x.name), result[0])
            return success(result)
        } catch (error) {
            Logger.error('story.getAll', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Gets all available source stories for the given user
     * @param userId The Auth0 sub of the user
     * @returns A response containing an array of story, or an error message
     */
    async getAllAvailableSources(userId: string): Promise<DBResponse<IDatabaseStory[]>> {
        try {
            const result = await this.collection.aggregate<IDatabaseStory>([
                {
                    $addFields: {
                        valid: {
                            $or: [
                                { $eq: [userId, '$_userId'] },
                                { $in: [FlagType.Public, '$flags'] }
                            ]
                        }
                    }
                },
                { $match: { valid: true } },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        name: '$name',
                        description: '$description',
                        image: '$image',
                        sources: '$sources',
                        flags: '$flags',
                        dateCreated: '$dateCreated',
                        dateUpdated: '$dateUpdated'
                    } satisfies KeysOfTwo<IDatabaseStory, object>
                }
            ]).toArray()
            Logger.log('story.getAll', result.length, result.map(x => x.name))
            return success(result)
        } catch (error) {
            Logger.error('story.getAll', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Gets the latest updated story
     * @param userId The Auth0 sub of the user
     * @returns A response containing a Story, null, or an error message
     */
    async getLastUpdated(userId: string): Promise<DBResponse<IDatabaseStory | null>> {
        try {
            const result = await this.collection.aggregate<IDatabaseStory>([
                {
                    $match: {
                        _userId: userId
                    } satisfies Partial<IDBStory>
                },
                {
                    $lookup: {
                        from: Database.files!.collection.collectionName,
                        localField: '_id',
                        foreignField: '_storyId',
                        as: 'documents'
                    }
                },
                {
                    $unwind: {
                        path: '$documents',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: '$_id',
                        name: '$name',
                        description: '$description',
                        image: '$image',
                        sources: '$sources',
                        flags: '$flags',
                        dateCreated: '$dateCreated',
                        dateUpdated: { $max: ['$dateUpdated', '$documents.dateUpdated'] }
                    } satisfies KeysOfTwo<IDBStory, object>
                },
                { $sort: { dateUpdated: -1 } },
                { $limit: 1 },
                {
                    $project: {
                        _id: 0,
                        id: '$_id',
                        name: '$name',
                        description: '$description',
                        image: '$image',
                        sources: '$sources',
                        flags: '$flags',
                        dateCreated: '$dateCreated',
                        dateUpdated: '$dateUpdated'
                    } satisfies KeysOfTwo<IDatabaseStory, object>
                }
            ]).toArray()

            if (result.length > 0) {
                Logger.log('story.getLastUpdated', result[0].name)
                return success(result[0])
            } else {
                Logger.warn('story.getLastUpdated', null)
                return failure('User has no stories')
            }
        } catch (error) {
            Logger.error('story.getLastUpdated', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Deletes a story and its related documents from the database
     * @param userId The Auth0 sub of the user
     * @param storyId The id of the story to delete
     * @returns True if the story was deleted, False otherwise, or an error message
     */
    async delete(userId: string, storyId: ObjectId): Promise<DBResponse<boolean>> {
        try {
            if (storyId === null) {
                return failure('Invalid story ID')
            }

            const filter = {
                _id: storyId,
                _userId: userId
            } satisfies KeysOfTwo<IDBStory, object>
            const result = await this.collection.deleteOne(filter)
            const removed = result.deletedCount > 0
            Logger.log('story.delete', removed ? storyId : 'Null')
            if (removed) {
                const res = await Database.files?.deleteFrom(userId, storyId)
                if (res === undefined) {
                    Logger.error('story.delete', 'Document collection not initialized')
                    return failure('Database not initialized')
                }
                if (!res.success || res.result < 1) {
                    Logger.error('story.delete', 'Failed removing files of removed story', storyId, res.result)
                }
            }
            return success(removed)
        } catch (error) {
            Logger.error('story.delete', error)
            if (error instanceof Error) {
                return failure(error.message)
            } else {
                return failure(String(error))
            }
        }
    }

    /**
     * Removes all stories
     * @returns The number of stories removed, or an error message
     */
    async clear(): Promise<DBResponse<number>> {
        try {
            const result = await this.collection.deleteMany()
            if (result.acknowledged) {
                Logger.log('story.clear', result.deletedCount)
                return success(result.deletedCount)
            } else {
                Logger.warn('story.clear', 'Failed to acknowledge')
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
}

export default StoryCollection
