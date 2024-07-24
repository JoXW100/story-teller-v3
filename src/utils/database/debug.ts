import type { DBResponse } from 'types/database'
import type { Collection, Db } from 'mongodb'
import Database, { success } from '.'
import type { IDBStory } from './story'
import type { IDBFile } from './files'
import { type CollectionName, Collections } from './constants'
import { keysOf } from 'utils'
import Logger from 'utils/logger'

interface IDebugCollections {
    main: Collection
    temp: Collection
    backup: Collection
}

class DebugHandler {
    public readonly test: boolean
    private readonly collections: Record<CollectionName, IDebugCollections>

    private get currentFilesCollection(): Collection<IDBFile> { return Database.files!.collection }
    private get currentStoriesCollection(): Collection<IDBStory> { return Database.stories!.collection }

    constructor (database: Db, test: boolean) {
        this.test = test
        this.collections = {} as any
        for (const name of keysOf(Collections)) {
            this.collections[name] = {
                main: database.collection(Collections[name].main),
                temp: database.collection(Collections[name].temp),
                backup: database.collection(Collections[name].backup)
            }
        }
    }

    async run(data: Record<string, unknown>): Promise<DBResponse<boolean>> {
        await this.clear('files', 'backup')
        await this.clear('stories', 'backup')
        // Backup
        await this.backup('files')
        await this.backup('stories')
        return success(true)
    }

    async clear(name: CollectionName, type: keyof IDebugCollections): Promise<DBResponse<boolean>> {
        const res = await this.collections[name][type].deleteMany({})
        Logger.log('debug.clear', name, type, res.deletedCount)
        return success(true)
    }

    async backup(name: CollectionName): Promise<DBResponse<boolean>> {
        const res = await this.collections[name].main.aggregate([
            { $out: this.collections[name].backup.collectionName }
        ]).toArray()
        Logger.log('debug.transfer', name, res.length)
        return success(true)
    }

    async deploy(name: CollectionName): Promise<DBResponse<boolean>> {
        const res = await this.collections[name].temp.aggregate([
            { $out: this.collections[name].main.collectionName }
        ]).toArray()
        Logger.log('debug.deploy', name, res.length)
        return success(true)
    }

    async move(from: CollectionName, target: CollectionName, type: keyof IDebugCollections): Promise<DBResponse<boolean>> {
        const res = await this.collections[from][type].aggregate([
            { $out: this.collections[target][type].collectionName }
        ]).toArray()
        Logger.log('debug.move', from, target, type, res.length)
        return success(true)
    }

    async convertStories(name: CollectionName): Promise<DBResponse<boolean>> {
        return success(true)
    }

    async convertFiles(name: CollectionName): Promise<DBResponse<boolean>> {
        return success(true)
    }
}

export default DebugHandler
