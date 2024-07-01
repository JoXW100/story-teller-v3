import { isEnum, isNumber, isObjectId, isRecord, isString } from 'utils'
import { isValidAbilityFormat } from 'utils/importers/stringFormatAbilityImporter'
import { CreatureType, Language, MovementType, ProficiencyLevelBasic, Sense, SizeType } from 'structure/dnd'
import { getOptionType } from 'structure/optionData'
import EmptyToken from 'structure/language/tokens/empty'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IRaceData } from 'types/database/files/race'
import type { TokenContext } from 'types/language'

class RaceData implements IRaceData {
    public readonly name: string
    public readonly description: string
    public readonly type: CreatureType
    public readonly size: SizeType
    public readonly speed: Partial<Record<MovementType, number>>
    public readonly senses: Partial<Record<Sense, number>>
    public readonly languages: Partial<Record<Language, ProficiencyLevelBasic>>
    public readonly abilities: Array<ObjectId | string>
    public readonly modifiers: ObjectId[]

    public constructor(data: Simplify<IRaceData>) {
        this.name = data.name ?? RaceData.properties.name.value
        this.description = data.description ?? RaceData.properties.description.value
        this.type = data.type ?? RaceData.properties.type.value
        this.size = data.size ?? RaceData.properties.size.value
        this.speed = data.speed ?? RaceData.properties.speed.value
        this.senses = data.senses ?? RaceData.properties.senses.value
        this.languages = data.languages ?? RaceData.properties.languages.value
        // Other
        this.abilities = RaceData.properties.abilities.value
        if (Array.isArray(data.abilities)) {
            for (const id of data.abilities) {
                this.abilities.push(id as string)
            }
        }

        this.modifiers = RaceData.properties.modifiers.value
        if (Array.isArray(data.modifiers)) {
            for (const id of data.modifiers) {
                if (isObjectId(id)) {
                    this.modifiers.push(id)
                }
            }
        }
    }

    public createContexts(elements: ElementDefinitions): [TokenContext] {
        const descriptionContext = {
            title: new EmptyToken(elements, this.name),
            name: new EmptyToken(elements, this.name)
        }
        return [descriptionContext]
    }

    public get typeText(): string {
        return getOptionType('creatureType').options[this.type]
    }

    public get sizeText(): string {
        return getOptionType('size').options[this.size]
    }

    public static properties: DataPropertyMap<IRaceData, RaceData> = {
        name: {
            value: '',
            validate: isString
        },
        description: {
            value: '',
            validate: isString
        },
        type: {
            value: CreatureType.Humanoid,
            validate: (value) => isEnum(value, CreatureType)
        },
        size: {
            value: SizeType.Medium,
            validate: (value) => isEnum(value, SizeType)
        },
        speed: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, MovementType) && isNumber(value) && value >= 0),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        senses: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, Sense) && isNumber(value) && value >= 0),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        languages: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, Language) && isEnum(value, ProficiencyLevelBasic)),
            simplify: (value) => Object.values(value).some((value) => value !== ProficiencyLevelBasic.None) ? value : null
        },
        abilities: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every((value) => isObjectId(value) || isValidAbilityFormat(value)),
            simplify: (value) => value.length > 0 ? value : null
        },
        modifiers: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(isObjectId),
            simplify: (value) => value.length > 0 ? value : null
        }
    }
}

export default RaceData
