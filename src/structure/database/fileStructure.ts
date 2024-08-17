import { DatabaseObject, type FlagType, type DocumentFileType } from '.'
import type { ObjectId } from 'types'
import type { IFileStructure } from 'types/database'

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
        this.type = data.type
        this.name = data.name
        this.flags = data.flags
        this.open = data.open
        this.children = data.children.map((child) => new FileStructure(child))
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
