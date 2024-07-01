import { MongoClient } from 'mongodb'
import StoryCollection from './story'
import FileCollection from './files'
import Logger from 'utils/logger'
import variables from 'types/variables'
import type { DBResponse } from 'types/database'

export function success<T>(value: T): DBResponse<T> {
    return { success: true, result: value }
}

export function failure<T = unknown>(value: string | null = null): DBResponse<T> {
    return { success: false, result: value }
}

abstract class Database {
    private static _connection: MongoClient | null = null
    private static _stories: StoryCollection | null = null
    private static _documents: FileCollection | null = null

    static get isConnected(): boolean { return this._connection !== null }
    static get stories(): StoryCollection | null { return this._stories }
    static get files(): FileCollection | null { return this._documents }

    static async connect(test: boolean = false): Promise<DBResponse<boolean>> {
        if (!this.isConnected) {
            try {
                let client: Promise<MongoClient>

                if (variables.mongoClientPromise !== undefined) {
                    client = variables.mongoClientPromise
                } else {
                    const url = process.env.MONGODB_URI
                    if (url === undefined) {
                        Logger.error('Database.connect', 'URL', url)
                        return failure('Undefined database connection url')
                    }
                    client = MongoClient.connect(url)
                    variables.mongoClientPromise = client
                }

                this._connection = await client
                const database = this._connection.db(process.env.MONGODB_DB)
                this._stories = new StoryCollection(database, test)
                this._documents = new FileCollection(database, test)
            } catch (error: unknown) {
                this._connection = null
                this._stories = null
                this._documents = null
                Logger.error('Database.connect', error)
                return failure(String(error))
            }
        }
        return success(this.isConnected)
    }
}

export default Database
