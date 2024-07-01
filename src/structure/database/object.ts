import { type ObjectId } from 'types'

export abstract class DatabaseObject {
    public readonly id: ObjectId

    protected constructor(id: ObjectId) {
        this.id = id
    }
}
