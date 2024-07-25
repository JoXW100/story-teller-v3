import type { UserId, DateValue, ObjectId } from '.'

interface IStory {
    id: ObjectId | null
    name: string
    desc: string
    dateCreated: DateValue
    dateUpdated: DateValue
}

interface IStoryData extends IStory {
    root: ObjectId
}

interface DBStory {
    _id: ObjectId
    _userId: UserId
    name: string
    desc: string
    dateCreated: DateValue
    dateUpdated: DateValue
}

interface DBStoryUpdate {
    name?: string
    desc?: string
}

export type {
    IStory,
    IStoryData,
    DBStory,
    DBStoryUpdate
}
