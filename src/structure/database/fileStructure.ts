import { DatabaseObject, FlagType, DocumentFileType } from '.'
import type { ObjectId } from 'types'
import type { IFileStructure } from 'types/database'
import { asBoolean, asEnum, asString, isEnum } from 'utils'

class FileStructure extends DatabaseObject implements IFileStructure {
    public readonly holderId: ObjectId | null
    public readonly type: DocumentFileType
    public readonly name: string
    public readonly flags: readonly FlagType[]
    public readonly open: boolean
    public readonly children: readonly FileStructure[]

    public constructor(data: IFileStructure) {
        super(data.id)
        this.holderId = data.holderId ?? null
        this.type = asEnum(data.type, DocumentFileType, DocumentFileType.Empty)
        this.name = asString(data.name, '')
        const flags: FlagType[] = []
        if (Array.isArray(data.flags)) {
            for (const flag of data.flags) {
                if (isEnum(flag, FlagType)) {
                    flags.push(flag)
                }
            }
        }
        this.flags = flags
        this.open = asBoolean(data.open, false)
        if (Array.isArray(data.children)) {
            this.children = data.children.map((child) => new FileStructure(child))
        } else {
            this.children = []
        }
    }

    public updateContained(file: IFileStructure): IFileStructure {
        if (this.id === file.id) {
            return {
                ...file,
                children: this.children.map((child) => child.updateContained(file))
            }
        } else {
            return {
                id: this.id,
                holderId: this.holderId,
                type: this.type,
                name: this.name,
                flags: this.flags,
                open: this.open,
                children: this.children.map((child) => child.updateContained(file))
            }
        }
    }
}

export default FileStructure
