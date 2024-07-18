import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { isEnum, isNumber, isObjectId, isObjectIdOrNull, isRecord, isString } from 'utils'
import Database, { failure, success } from 'utils/database'
import Logger from 'utils/logger'
import { DocumentFileType } from 'structure/database'
import type { Enum } from 'types'
import type { ServerRequestType } from 'types/database'

class DBError extends Error {
    public readonly value: unknown

    public constructor(methodName: string, value: unknown) {
        super(`'${methodName}' encountered invalid type`)
        this.value = value
    }
}

function toObjectId(value: unknown): ObjectId {
    if (isObjectId(value)) {
        return new ObjectId(value)
    } else {
        throw new DBError('toObjectId', value)
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toObjectIdNull(value: unknown): ObjectId | null {
    if (isObjectIdOrNull(value)) {
        return value === null ? null : new ObjectId(value)
    } else {
        throw new DBError('toObjectIdNull', value)
    }
}

function toObjectIdArray(value: unknown): ObjectId[] {
    try {
        const array = (Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [])
        return array.map(toObjectId)
    } catch (e: unknown) {
        if (e instanceof DBError) {
            throw new DBError('toObjectIdArray', value)
        }
        throw e
    }
}

function toString(value: unknown): string {
    if (isString(value)) {
        return String(value)
    } else {
        throw new DBError('toString', value)
    }
}

function toRecord(value: unknown): Record<string, unknown> {
    if (isRecord(value)) {
        return value
    } else {
        throw new DBError('toRecord', value)
    }
}

function toObject(value: unknown): object {
    if (typeof value === 'object' && value !== null) {
        return value
    } else {
        throw new DBError('toObject', value)
    }
}

function toStringOrNull(value: unknown): string | null {
    if (isString(value) || value === null) {
        return value === 'null' ? null : String(value)
    } else {
        throw new DBError('toStringOrNull', value)
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function toNumber(value: unknown): number {
    if (isNumber(value)) {
        return Number(value)
    } else {
        throw new DBError('toNumber', value)
    }
}

function toEnum<T extends Enum>(value: unknown, type: T): T[keyof T] {
    if (isEnum(value, type)) {
        return value
    } else {
        throw new DBError('toEnum', value)
    }
}

function toEnumArray<T extends Enum>(value: unknown, type: T): Array<T[keyof T]> {
    try {
        const array = (Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [])
        return array.map((value) => toEnum(value, type))
    } catch (e: unknown) {
        if (e instanceof DBError) {
            throw new DBError('toEnumArray', value)
        }
        throw e
    }
}

async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const session = await getSession(req, res)
        const user = session?.user
        const userId: string | undefined = user?.sub
        const { type, ...params } = req.query as Record<string, unknown> & { type: ServerRequestType | undefined }

        if (userId === undefined) {
            res.status(404).json(failure('Could not parse user id')); return
        }

        if (!Database.isConnected) {
            const result = await Database.connect()
            if (!result.success) {
                res.status(400).json(failure('Server failed to connect to database')); return
            }
        }

        Logger.log('database.handler.params', params)
        switch (req.method) {
            case 'GET':
                switch (type) {
                    case 'isConnected':
                    { res.status(200).json(success(Database.isConnected)); return }
                    case 'getStory':
                    { res.status(200).json(await Database.stories?.get(userId, toObjectId(params.storyId)) ?? failure()); return }
                    case 'getAllStories':
                    { res.status(200).json(await Database.stories?.getAll(userId) ?? failure()); return }
                    case 'getLastUpdatedStory':
                    { res.status(200).json(await Database.stories?.getLastUpdated(userId) ?? failure()); return }
                    case 'getFile':
                    { res.status(200).json(await Database.files?.get(userId, toObjectId(params.fileId), toEnumArray(params.allowedTypes, DocumentFileType)) ?? failure()); return }
                    case 'getFiles':
                    { res.status(200).json(await Database.files?.getMultiple(userId, toObjectIdArray(params.fileIds), toEnumArray(params.allowedTypes, DocumentFileType)) ?? failure()); return }
                    case 'getSubclasses':
                    { res.status(200).json(await Database.files?.getSubclasses(userId, toObjectId(params.storyId), toObjectId(params.classId)) ?? failure()); return }
                    case 'getFeats':
                    { res.status(200).json(await Database.files?.getFeats(userId, toObjectId(params.storyId)) ?? failure()); return }
                    case 'getFightingStyles':
                    { res.status(200).json(await Database.files?.getFightingStyles(userId, toObjectId(params.storyId)) ?? failure()); return }
                    case 'getSubscribedFiles':
                    { res.status(200).json(await Database.files?.getSubscribedFiles(userId, toEnumArray(params.allowedTypes, DocumentFileType)) ?? failure()); return }
                    case 'getFileStructure':
                    { res.status(200).json(await Database.files?.getStructure(userId, toObjectId(params.storyId)) ?? failure()); return }
                    default: break
                }
                break
            case 'PUT': {
                const body: Record<string, unknown> = JSON.parse(req.body)
                Logger.log('database.handler.body', body)
                switch (type) {
                    case 'addStory':
                    { res.status(200).json(await Database.stories?.add(userId, toString(body.name), toString(body.description), toStringOrNull(body.image)) ?? failure()); return }
                    case 'updateStory':
                    { res.status(200).json(await Database.stories?.update(userId, toObjectId(body.storyId), body.update) ?? failure()); return }
                    case 'addFile':
                    { res.status(200).json(await Database.files?.add(userId, toObjectId(body.storyId), toObjectId(body.holderId), toEnum(body.type, DocumentFileType), toString(body.name), toObject(body.data)) ?? failure()); return }
                    case 'copyFile':
                    { res.status(200).json(await Database.files?.addCopy(userId, toObjectId(body.fileId), toObjectId(body.holderId), toString(body.name)) ?? failure()); return }
                    case 'updateFile':
                    { res.status(200).json(await Database.files?.update(userId, toObjectId(body.fileId), toEnum(body.type, DocumentFileType), toRecord(body.update)) ?? failure()); return }
                    case 'moveFile':
                    { res.status(200).json(await Database.files?.move(userId, toObjectId(body.fileId), toObjectId(body.targetId)) ?? failure()); return }
                    default: break
                }
            } break
            case 'DELETE':
                switch (type) {
                    case 'deleteStory':
                    { res.status(200).json(await Database.stories?.delete(userId, toObjectId(params.storyId)) ?? failure()); return }
                    case 'deleteFile':
                    { res.status(200).json(await Database.files?.delete(userId, toObjectId(params.fileId)) ?? failure()); return }
                    default: break
                }
                break
            default: break
        }

        res.status(400).json(failure('Missing API: ' + req.method + ' -> ' + toString(type)))
    } catch (error: unknown) {
        if (error instanceof DBError) {
            Logger.error('database.handler', error.message, error.value)
        } else {
            Logger.error('database.handler', error)
        }
        if (error instanceof Error) {
            res.status(400).json(failure(error.message))
        } else {
            res.status(400).json(failure(String(error)))
        }
    }
}

export default withApiAuthRequired(handler)
