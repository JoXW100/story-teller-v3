import { isEnum, isNumber, isObjectId, isRecord } from 'utils'
import { isValidAbilityFormat } from 'utils/importers/stringFormatAbilityImporter'
import { OptionalAttribute, SpellLevel } from 'structure/dnd'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IClassLevelData } from 'types/database/files/class'

export enum LevelModifyType {
    Replace = 'replace',
    Add = 'add'
}

class ClassLevelData implements IClassLevelData {
    public readonly type: LevelModifyType
    public readonly spellAttribute: OptionalAttribute
    public readonly spellSlots: Partial<Record<SpellLevel, number>>
    public readonly preparationSlots: number
    public readonly learnedSlots: number
    public readonly abilities: Array<string | ObjectId>
    public readonly modifiers: ObjectId[]

    constructor(data: Simplify<IClassLevelData> = {}) {
        this.type = data.type ?? ClassLevelData.properties.type.value
        this.spellAttribute = data.spellAttribute ?? ClassLevelData.properties.spellAttribute.value
        this.spellSlots = data.spellSlots ?? ClassLevelData.properties.spellSlots.value
        this.preparationSlots = data.preparationSlots ?? ClassLevelData.properties.preparationSlots.value
        this.learnedSlots = data.learnedSlots ?? ClassLevelData.properties.learnedSlots.value
        this.abilities = ClassLevelData.properties.abilities.value
        if (Array.isArray(data.abilities)) {
            for (const id of data.abilities) {
                this.abilities.push(id as string)
            }
        }
        this.modifiers = ClassLevelData.properties.modifiers.value
        if (Array.isArray(data.modifiers)) {
            for (const id of data.modifiers) {
                this.modifiers.push(id as ObjectId)
            }
        }
    }

    public static properties: DataPropertyMap<IClassLevelData, ClassLevelData> = {
        type: {
            value: LevelModifyType.Add,
            validate: (value) => isEnum(value, LevelModifyType)
        },
        spellAttribute: {
            value: OptionalAttribute.None,
            validate: (value) => isEnum(value, OptionalAttribute)
        },
        spellSlots: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, SpellLevel) && isNumber(val) && val >= 0),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        preparationSlots: {
            value: 0,
            validate: isNumber
        },
        learnedSlots: {
            value: 0,
            validate: isNumber
        },
        abilities: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every((value) => isObjectId(value) || isValidAbilityFormat(value)),
            simplify: (value) => value.length > 0 ? value : null
        },
        modifiers: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(isObjectId),
            simplify: (value) => value.length === 0 ? null : value
        }
    }
}

export default ClassLevelData
