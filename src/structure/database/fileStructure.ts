import { DocumentFileType } from '.'
import { DatabaseObject } from './object'
import { isEnum, isObjectIdOrNull } from 'utils'
import type { ObjectId } from 'types'
import type { IFileStructure } from 'types/database'

class FileStructure extends DatabaseObject implements IFileStructure {
    public readonly holderId: ObjectId | null
    public readonly type: DocumentFileType
    public readonly name: string
    public readonly open: boolean
    public readonly children: readonly FileStructure[]

    public constructor(data: IFileStructure) {
        super(data.id)
        this.holderId = data.holderId
        this.type = data.type
        this.name = data.name
        this.open = data.open
        this.children = data.children.map((child) => new FileStructure(child))
    }

    public static validate(value: unknown): value is IFileStructure {
        return typeof value === 'object' && value !== null &&
            'holderId' in value && isObjectIdOrNull(value.holderId) &&
            'type' in value && isEnum(value.type, DocumentFileType) &&
            'name' in value && (typeof value.name === 'string') &&
            'open' in value && typeof value.open === 'boolean' &&
            'children' in value && Array.isArray(value.children) &&
            value.children.every(child => this.validate(child))
    }

    public static parseJSON(value: string): FileStructure | null {
        const data: unknown = JSON.parse(value)
        if (this.validate(data)) {
            return new FileStructure(data)
        }
        return null
    }

    public toJSON(): IFileStructure {
        return {
            id: this.id,
            holderId: this.holderId,
            type: this.type,
            name: this.name,
            open: this.open,
            children: this.children.map(child => child.toJSON())
        }
    }
}

export default FileStructure
