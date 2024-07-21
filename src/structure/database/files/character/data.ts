import CreatureData from '../creature/data'
import { asEnum, isEnum, isNumber, isObjectId, isObjectIdOrNull, isRecord, isString, keysOf } from 'utils'
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
    public readonly raceName: string
    // Classes
    public readonly classes: Record<ObjectId, ClassLevel>
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
        } else {
            this.raceName = CharacterData.properties.raceName.value
        }
        // Classes
        this.classes = CharacterData.properties.classes.value
        if (data.classes !== undefined) {
            for (const key of keysOf(data.classes)) {
                this.classes[key] = asEnum(data.classes[key], ClassLevel) ?? ClassLevel.Level1
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
        // Other
        attunementSlots: {
            value: 3,
            validate: isNumber
        }
    }
}

export default CharacterData
