import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { asBoolean, isEnum, isObjectId, isObjectIdOrNull, isRecord, isString } from 'utils'
import Database, { failure, success } from 'utils/database'
import Logger from 'utils/logger'
import { DocumentFileType, FlagType } from 'structure/database'
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
        if (value === '') {
            return []
        }
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
 
function toNumber(value: unknown): number {
    const res = Number(value)
    if (isNaN(res)) {
        throw new DBError('toNumber', value)
    }
    return res
}

function toEnum<T extends Enum>(value: unknown, type: T): T[keyof T] {
    if (isEnum(value, type)) {
        return value
    } else {
        throw new DBError('toEnum', value)
    }
}

function toEnumArray<T extends Enum>(value: unknown, type: T): T[keyof T][] {
    try {
        if (value === '') {
            return []
        }
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
            res.status(400).json(failure('Invalid user')); return
        }

        if (!Database.isConnected) {
            const result = await Database.connect()
            if (!result.success) {
                res.status(400).json(failure('Server failed to connect to database')); return
            }
        }

        switch (req.method) {
            case 'GET':
                switch (type) {
                    case 'isConnected':
                    { res.status(200).json(success(Database.isConnected)); return }
                    case 'getStory':
                    { res.status(200).json(await Database.stories?.get(userId, toObjectId(params.storyId)) ?? failure()); return }
                    case 'getAllStories':
                    { res.status(200).json(await Database.stories?.getAll(userId) ?? failure()); return }
                    case 'getAllAvailableSources':
                    { res.status(200).json(await Database.stories?.getAllAvailableSources(userId) ?? failure()); return }
                    case 'getLastUpdatedStory':
                    { res.status(200).json(await Database.stories?.getLastUpdated(userId) ?? failure()); return }
                    case 'getLastUpdatedFiles':
                    { res.status(200).json(await Database.files?.getLastUpdated(userId, toObjectId(params.storyId), toNumber(params.count)) ?? failure()); return }
                    case 'getFile':
                    { res.status(200).json(await Database.files?.get(userId, toObjectId(params.fileId), toEnumArray(params.allowedTypes, DocumentFileType)) ?? failure()); return }
                    case 'getFiles':
                    { res.status(200).json(await Database.files?.getMultiple(userId, toObjectIdArray(params.fileIds), toEnumArray(params.allowedTypes, DocumentFileType)) ?? failure()); return }
                    case 'getSubFiles':
                    { res.status(200).json(await Database.files?.getSubFiles(userId, toObjectIdArray(params.sources), toObjectId(params.parentId), toEnum(params.fileType, DocumentFileType)) ?? failure()); return }
                    case 'getAbilitiesOfCategory':
                    { res.status(200).json(await Database.files?.getAbilitiesOfCategory(userId, toString(params.category)) ?? failure()); return }
                    case 'getAll':
                    { res.status(200).json(await Database.files?.getAll(userId, toObjectIdArray(params.sources), toEnumArray(params.allowedTypes, DocumentFileType), toEnumArray(params.requiredFlags, FlagType)) ?? failure()); return }
                    case 'getFileStructure':
                    { res.status(200).json(await Database.files?.getStructure(userId, toObjectId(params.storyId)) ?? failure()); return }
                    default: break
                }
                break
            case 'PUT': {
                const body: Record<string, unknown> = JSON.parse(req.body)
                Logger.log('body', Object.keys(body).map(key => `${key}: ${body[key] as string}`).join(', '))
                switch (type) {
                    case 'addStory':
                    { res.status(200).json(await Database.stories?.add(userId, toString(body.name), toString(body.description), toStringOrNull(body.image), toObjectIdArray(body.sources), toEnumArray(body.flags, FlagType)) ?? failure()); return }
                    case 'updateStory':
                    { res.status(200).json(await Database.stories?.update(userId, toObjectId(body.storyId), toRecord(body.update)) ?? failure()); return }
                    case 'addFile':
                    { res.status(200).json(await Database.files?.add(userId, toObjectId(body.storyId), toObjectId(body.holderId), toEnum(body.type, DocumentFileType), toString(body.name), toObject(body.data)) ?? failure()); return }
                    case 'copyFile':
                    { res.status(200).json(await Database.files?.addCopy(userId, toObjectId(body.fileId), toObjectId(body.holderId), toString(body.name)) ?? failure()); return }
                    case 'updateFile':
                    { res.status(200).json(await Database.files?.update(userId, toObjectId(body.fileId), toEnum(body.type, DocumentFileType), toRecord(body.update)) ?? failure()); return }
                    case 'publishFile':
                    { res.status(200).json(await Database.files?.publish(userId, toObjectId(body.fileId), toEnum(body.type, DocumentFileType), asBoolean(body.publish)) ?? failure()); return }
                    case 'moveFile':
                    { res.status(200).json(await Database.files?.move(userId, toObjectId(body.fileId), toObjectId(body.targetId)) ?? failure()); return }
                    case 'debug':
                    { res.status(200).json(await Database.debug?.run(body) ?? failure()); return }
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
