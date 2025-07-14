import type { ObjectId } from 'types'

export enum SourceType {
    Ability = 'abi',
    Class = 'cla',
    Subclass = 'scl',
    Race = 'rce',
    Subrace = 'src',
    Condition = 'cnd',
    Item = 'ite',
    Modifier = 'mod'
}

export interface ISourceData {
    type: SourceType
    key: string | ObjectId
}

export interface ISourceBinding {
    readonly source: ISourceData | null
    readonly description: string
}