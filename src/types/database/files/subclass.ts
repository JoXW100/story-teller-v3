import type { IClassData, IClassStorage } from './class'
import type { ObjectId } from 'types'

export interface ISubclassData extends IClassData {
    readonly parentClass: ObjectId | null
}

export interface ISubclassStorage extends IClassStorage {

}
