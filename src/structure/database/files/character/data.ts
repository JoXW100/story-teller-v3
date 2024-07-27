import CreatureData from '../creature/data'
import { asEnum, asObjectId, isEnum, isNumber, isObjectId, isObjectIdOrNull, isRecord, isString, keysOf } from 'utils'
import { ClassLevel } from 'structure/dnd'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ICharacterData } from 'types/database/files/character'

class CharacterData extends CreatureData implements ICharacterData {
    public readonly gender: string
    public readonly age: string
    public readonly height: string
    public readonly weight: string
    // Race
    public readonly race: ObjectId | null
    public readonly subrace: ObjectId | null
    public readonly raceName: string
    // Classes
    public readonly classes: Record<ObjectId, ClassLevel>
    public readonly subclasses: Record<ObjectId, ObjectId>
    // Other
    public readonly attunementSlots: number

    public constructor(data: Simplify<ICharacterData>) {
        super(data)
        this.gender = data.gender ?? CharacterData.properties.gender.value
        this.age = data.age ?? CharacterData.properties.age.value
        this.height = data.height ?? CharacterData.properties.height.value
        this.weight = data.weight ?? CharacterData.properties.weight.value
        // Race
        this.race = (data.race as ObjectId | null | undefined) ?? CharacterData.properties.race.value
        if (this.race === null) {
            this.raceName = data.raceName ?? CharacterData.properties.raceName.value
            this.subrace = asObjectId(data.subrace)
        } else {
            this.raceName = CharacterData.properties.raceName.value
            this.subrace = CharacterData.properties.subrace.value
        }
        // Classes
        this.classes = CharacterData.properties.classes.value
        this.subclasses = CharacterData.properties.subclasses.value
        if (data.classes !== undefined) {
            for (const key of keysOf(data.classes)) {
                if (isObjectId(key)) {
                    this.classes[key] = asEnum(data.classes[key], ClassLevel) ?? ClassLevel.Level1
                }
            }
            if (data.subclasses !== undefined) {
                for (const id of keysOf(data.subclasses)) {
                    const subclassId = data.subclasses[id]
                    if (id in this.classes && isObjectId(subclassId)) {
                        this.subclasses[id] = subclassId
                    }
                }
            }
        }
        // Other
        this.attunementSlots = data.attunementSlots ?? CharacterData.properties.attunementSlots.value
    }

    public static properties: DataPropertyMap<ICharacterData, CharacterData> = {
        ...CreatureData.properties,
        gender: {
            value: '',
            validate: isString
        },
        age: {
            value: '',
            validate: isString
        },
        height: {
            value: '',
            validate: isString
        },
        weight: {
            value: '',
            validate: isString
        },
        // Race
        race: {
            value: null,
            validate: isObjectIdOrNull
        },
        subrace: {
            value: null,
            validate: isObjectIdOrNull
        },
        raceName: {
            value: '',
            validate: isString
        },
        // Classes
        classes: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isObjectId(key) && isEnum(val, ClassLevel)),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        subclasses: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isObjectId(key) && isObjectId(val)),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        // Other
        attunementSlots: {
            value: 3,
            validate: isNumber
        }
    }
}

export default CharacterData
