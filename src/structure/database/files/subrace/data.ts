import { asObjectId, isObjectId, isObjectIdOrNull, isString } from 'utils'
import EmptyToken from 'structure/language/tokens/empty'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISubraceData } from 'types/database/files/subrace'
import type { TokenContext } from 'types/language'

class SubraceData implements ISubraceData {
    public readonly name: string
    public readonly description: string
    public readonly parentRace: ObjectId | null
    // Abilities
    public readonly abilities: Array<ObjectId | string>
    // Modifiers
    public readonly modifiers: ObjectId[]

    public constructor (data: Simplify<ISubraceData> = {}) {
        this.name = data.name ?? SubraceData.properties.name.value
        this.description = data.description ?? SubraceData.properties.description.value
        this.parentRace = asObjectId(data.parentRace) ?? SubraceData.properties.parentRace.value
        // Abilities
        this.abilities = SubraceData.properties.abilities.value
        if (Array.isArray(data.abilities)) {
            for (const id of data.abilities) {
                this.abilities.push(id as string)
            }
        }
        // Modifiers
        this.modifiers = SubraceData.properties.modifiers.value
        if (Array.isArray(data.modifiers)) {
            for (const id of data.modifiers) {
                if (isObjectId(id)) {
                    this.modifiers.push(id)
                }
            }
        }
    }

    public static properties: DataPropertyMap<ISubraceData, SubraceData> = {
        name: {
            value: '',
            validate: isString
        },
        description: {
            value: '',
            validate: isString
        },
        parentRace: {
            value: null,
            validate: isObjectIdOrNull
        },
        abilities: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(isString),
            simplify: (value) => value.length > 0 ? value : null
        },
        modifiers: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(isObjectId),
            simplify: (value) => value.length > 0 ? value : null
        }
    }

    public createContexts(elements: ElementDefinitions): [TokenContext] {
        const descriptionContext: TokenContext = {
            title: new EmptyToken(elements, this.name),
            name: new EmptyToken(elements, this.name)
        }
        return [descriptionContext]
    }
}

export default SubraceData
