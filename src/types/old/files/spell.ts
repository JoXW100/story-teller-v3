import type { IFileContent, IFileMetadata, IFileStorage } from '.'
import type { Duration, AreaType, CastingTime, MagicSchool } from '../dnd'
import type ICreatureActionData from './iConditionalHitEffect'

interface ISpellContent extends IFileContent {
    text: string
}

interface ISpellMetadata extends IFileMetadata, ICreatureActionData {
    level?: number
    school?: MagicSchool
    time?: CastingTime
    timeCustom?: string
    timeValue?: number
    duration?: Duration
    durationValue?: number
    ritual?: boolean
    concentration?: boolean
    componentVerbal?: boolean
    componentSomatic?: boolean
    componentMaterial?: boolean
    materials?: string
    // Range
    range?: number
    rangeLong?: number
    area?: AreaType
    areaSize?: number
    areaHeight?: number
}

interface ISpellStorage extends IFileStorage {
}

export type {
    ISpellContent,
    ISpellMetadata,
    ISpellStorage
}
