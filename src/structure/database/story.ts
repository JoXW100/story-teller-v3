import { DatabaseObject } from './object'
import type { ObjectId } from 'types'
import type { IDatabaseStoryData, IDatabaseStory } from 'types/database'

class DatabaseStory extends DatabaseObject implements IDatabaseStoryData {
    public readonly name: string
    public readonly description: string
    public readonly image: string | null
    public readonly root: ObjectId | null
    public readonly dateCreated: number
    public readonly dateUpdated: number

    public constructor(data: IDatabaseStory | IDatabaseStoryData) {
        super(data.id)
        this.name = data.name
        this.description = data.description
        this.image = data.image
        this.root = 'root' in data ? data.root : null
        this.dateCreated = data.dateCreated
        this.dateUpdated = data.dateUpdated
    }

    public static validate(value: unknown): value is IDatabaseStory {
        return typeof value === 'object' && value !== null &&
            'name' in value && typeof value.name === 'string' &&
            'description' in value && typeof value.description === 'string' &&
            'image' in value && (typeof value.image === 'string' || value.image === null) &&
            'dateCreated' in value && typeof value.dateCreated === 'number' &&
            'dateUpdated' in value && typeof value.dateUpdated === 'number'
    }

    public static parseJSON(value: string): DatabaseStory | null {
        const data: unknown = JSON.parse(value)
        if (this.validate(data)) {
            return new DatabaseStory(data)
        }
        return null
    }

    public toJSON(): Record<string, unknown> {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            image: this.image,
            root: this.root,
            dateCreated: this.dateCreated,
            dateUpdated: this.dateUpdated
        }
    }
}

export default DatabaseStory
