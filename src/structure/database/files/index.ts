import { DocumentFileType, FileType } from '..'
import { DatabaseObject } from '../object'
import { isBoolean, isEnum, isNumber, isObjectId, isRecord, isString } from 'utils'
import type { DataPropertyMap, IDatabaseFactory, IDatabaseFile } from 'types/database'
import type { IToken } from 'types/language'
import type { ElementDefinitions } from 'structure/elements/dictionary'

abstract class DatabaseFile<T extends DocumentFileType = DocumentFileType, S extends object = any, I extends object = any, D extends I = I> extends DatabaseObject implements IDatabaseFile<T, S, D> {
    public readonly type: T
    public readonly name: string
    public readonly dateCreated: number
    public readonly dateUpdated: number
    public readonly isOwner: boolean
    public readonly data: D
    public readonly storage: S

    public constructor(document: IDatabaseFile<T, S, D>) {
        super(document.id)
        this.type = document.type
        this.name = document.name
        this.data = document.data
        this.storage = document.storage
        this.isOwner = document.isOwner
        this.dateCreated = document.dateCreated
        this.dateUpdated = document.dateUpdated
    }

    public static properties: DataPropertyMap<IDatabaseFile, DatabaseFile> = {
        id: {
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
        dateCreated: {
            value: 0,
            validate: isNumber,
            simplify: (value) => value
        },
        dateUpdated: {
            value: 0,
            validate: isNumber,
            simplify: (value) => value
        },
        storage: {
            get value() { return {} },
            validate: isRecord,
            simplify: (value) => value
        },
        data: {
            get value() { return {} },
            validate: isRecord,
            simplify: (value) => value
        },
        isOwner: {
            value: false,
            validate: isBoolean,
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

    public abstract getTitle(): string
    public abstract getTokenizedDescription(elements: ElementDefinitions): IToken
    public abstract getDataFactory(): IDatabaseFactory<I, D>
}

export default DatabaseFile
