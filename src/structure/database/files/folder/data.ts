import { isBoolean } from 'utils'
import type { DataPropertyMap } from 'types/database'
import type { IFolderData } from 'types/database/files/folder'

class FolderData implements IFolderData {
    public readonly open: boolean

    public constructor(data: Partial<IFolderData>) {
        this.open = data.open ?? FolderData.properties.open.value
    }

    public static properties: DataPropertyMap<IFolderData, FolderData> = {
        open: {
            value: false,
            validate: isBoolean,
            simplify: (value) => value
        }
    }
}

export default FolderData
