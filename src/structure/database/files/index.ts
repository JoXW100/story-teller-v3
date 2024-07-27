import { DatabaseObject, DocumentFileType, FileType, FlagType } from '..'
import { isBoolean, isEnum, isNumber, isObjectId, isRecord, isString } from 'utils'
import type { DataPropertyMap, IDatabaseFactory, IDatabaseFile } from 'types/database'
import type { ObjectId } from 'types'
import type { IToken } from 'types/language'
import type { ElementDefinitions } from 'structure/elements/dictionary'

abstract class DatabaseFile<T extends DocumentFileType = DocumentFileType, S extends object = any, I extends object = any, D extends I = I> extends DatabaseObject implements IDatabaseFile<T, S, D> {
    public readonly storyId: ObjectId
    public readonly type: T
    public readonly name: string
    public readonly flags: FlagType[]
    public readonly isOwner: boolean
    public readonly data: D
    public readonly storage: S
    public readonly dateCreated: number
    public readonly dateUpdated: number

    public constructor(document: IDatabaseFile<T, S, D>) {
        super(document.id)
        this.storyId = document.storyId
        this.type = document.type ?? DatabaseFile.properties.type.value
        this.name = document.name ?? DatabaseFile.properties.name.value
        this.flags = document.flags ?? DatabaseFile.properties.flags.value
        this.isOwner = document.isOwner ?? DatabaseFile.properties.isOwner.value
        this.data = document.data ?? DatabaseFile.properties.data.value
        this.storage = document.storage ?? DatabaseFile.properties.storage.value
        this.dateCreated = document.dateCreated ?? DatabaseFile.properties.dateCreated.value
        this.dateUpdated = document.dateUpdated ?? DatabaseFile.properties.dateUpdated.value
    }

    public static properties: DataPropertyMap<IDatabaseFile, DatabaseFile> = {
        id: {
            value: null as any,
            validate: isObjectId,
            simplify: (value) => value
        },
        storyId: {
            value: null as any,
            validate: isObjectId,
            simplify: (value) => value
        },
        type: {
            value: FileType.Empty,
            validate: (value) => isEnum(value, DocumentFileType),
            simplify: (value) => value
        },
        name: {
            value: '__MISSING__',
            validate: (value) => isString(value) && value.length > 0,
            simplify: (value) => value
        },
        isOwner: {
            value: false,
            validate: isBoolean
        },
        flags: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every((val) => isEnum(val, FlagType)),
            simplify: (value) => value.reduce<FlagType[]>((flags, value) => flags.includes(value) ? flags : [...flags, value], [])
        },
        data: {
            get value() { return {} },
            validate: isRecord,
            simplify: (value) => value
        },
        storage: {
            get value() { return {} },
            validate: isRecord,
            simplify: (value) => value
        },
        dateCreated: {
            value: 0,
            validate: isNumber,
            simplify: (value) => value
        },
        dateUpdated: {
            value: 0,
            validate: isNumber,
            simplify: (value) => value
        }
    }

    public updateData(data: I): this {
        return new (this.constructor as any)({ ...this, data: this.getDataFactory().create(data) })
    }

    public updateStorage(storage: S): this {
        return new (this.constructor as any)({ ...this, storage: storage })
    }

    public stringify(): string {
        return JSON.stringify(this)
    }

    public getParentFile(): ObjectId | null {
        return null
    }

    public abstract getTitle(): string
    public abstract getDescription(): string
    public abstract getTokenizedDescription(elements: ElementDefinitions): IToken
    public abstract getDataFactory(): IDatabaseFactory<I, D>
}

export default DatabaseFile
