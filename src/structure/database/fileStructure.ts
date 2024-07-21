import type { DocumentFileType } from '.'
import { DatabaseObject } from './object'
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
        this.holderId = data.holderId ?? null
        this.type = data.type
        this.name = data.name
        this.open = data.open
        this.children = data.children.map((child) => new FileStructure(child))
    }

    public updateContained(file: IFileStructure): FileStructure {
        if (this.id === file.id) {
            return new FileStructure(file)
        } else {
            return new FileStructure({
                id: this.id,
                holderId: this.holderId,
                type: this.type,
                name: this.name,
                open: this.open,
                children: this.children.map((child) => child.updateContained(file))
            })
        }
    }
}

export default FileStructure
