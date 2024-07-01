import type { MongoClient } from 'mongodb'

const variables = global as typeof globalThis & {
    mongoClientPromise: Promise<MongoClient>
}

export default variables
