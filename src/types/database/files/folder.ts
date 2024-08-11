import type { IDatabaseFileData, IDatabaseFileStorage } from '..'

export interface IFolderData extends IDatabaseFileData {
    open: boolean
}

export interface IFolderStorage extends IDatabaseFileStorage {

}
