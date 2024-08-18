import type { DataPropertyMap, IDatabaseStory } from '.'
import type DatabaseStory from 'structure/database/story'

export interface IStoryFactory {
    readonly create: (data: IDatabaseStory) => DatabaseStory
    readonly is: (data: unknown) => data is IDatabaseStory
    readonly validate: (data: unknown) => data is Record<string, unknown> & IDatabaseStory
    readonly properties: () => DataPropertyMap<IDatabaseStory, DatabaseStory>
}
