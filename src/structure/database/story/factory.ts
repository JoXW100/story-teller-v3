import DatabaseStory from '.'
import { isRecord } from 'utils'
import { hasObjectProperties, validateObjectProperties } from 'structure/database'
import type { DataPropertyMap, IDatabaseStory } from 'types/database'

interface IStoryFactory {
    readonly create: (data: IDatabaseStory) => DatabaseStory
    readonly is: (data: unknown) => data is IDatabaseStory
    readonly validate: (data: unknown) => data is Record<string, unknown> & IDatabaseStory
    readonly properties: () => DataPropertyMap<IDatabaseStory, DatabaseStory>
}

const StoryFactory: IStoryFactory = {
    create: function (data: IDatabaseStory): DatabaseStory {
        return new DatabaseStory(data)
    },
    is: function (data: unknown): data is IDatabaseStory {
        return this.validate(data) && hasObjectProperties(data, this.properties())
    },
    validate: function (data: unknown): data is Record<string, unknown> & IDatabaseStory {
        return isRecord(data) && validateObjectProperties(data, this.properties())
    },
    properties: function (): DataPropertyMap<IDatabaseStory, DatabaseStory> {
        return DatabaseStory.properties
    }
}

export default StoryFactory
