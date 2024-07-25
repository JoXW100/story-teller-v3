import { DatabaseObject, FlagType } from '..'
import { isEnum, isNumber, isObjectId, isString, isStringOrNull } from 'utils'
import type { ObjectId } from 'types'
import type { IDatabaseStory, DataPropertyMap } from 'types/database'

class DatabaseStory extends DatabaseObject implements IDatabaseStory {
    public readonly name: string
    public readonly description: string
    public readonly image: string | null
    public readonly dateCreated: number
    public readonly dateUpdated: number
    public readonly sources: ObjectId[]
    public readonly flags: FlagType[]

    public constructor(data: IDatabaseStory) {
        super(data.id)
        this.name = data.name
        this.description = data.description
        this.image = data.image
        this.sources = data.sources
        this.flags = data.flags
        this.dateCreated = data.dateCreated
        this.dateUpdated = data.dateUpdated
    }

    public static properties: DataPropertyMap<IDatabaseStory, DatabaseStory> = {
        id: {
            value: null as any,
            validate: isObjectId,
            simplify: (value) => value
        },
        name: {
            value: '',
            validate: (value) => isString(value) && value.length > 0,
            simplify: (value) => value
        },
        description: {
            value: '',
            validate: (value) => isString(value),
            simplify: (value) => value
        },
        image: {
            value: null,
            validate: isStringOrNull,
            simplify: (value) => value
        },
        sources: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(isObjectId),
            simplify: (value) => value
        },
        flags: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every((val) => isEnum(val, FlagType)),
            simplify: (value) => value.reduce<FlagType[]>((flags, value) => flags.includes(value) ? flags : [...flags, value], [])
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
        }
    }
}

export default DatabaseStory
