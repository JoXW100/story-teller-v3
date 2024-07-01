import ClassData from '../class/data'
import { asObjectId, isObjectIdOrNull } from 'utils'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISubclassData } from 'types/database/files/subclass'

class SubclassData extends ClassData implements ISubclassData {
    public readonly parentClass: ObjectId | null

    public constructor (data: Simplify<ISubclassData> = {}) {
        super(data)
        this.parentClass = asObjectId(data.parentClass) ?? SubclassData.properties.parentClass.value
    }

    public static properties: DataPropertyMap<ISubclassData, SubclassData> = {
        ...ClassData.properties,
        parentClass: {
            value: null,
            validate: isObjectIdOrNull
        }
    }
}

export default SubclassData
