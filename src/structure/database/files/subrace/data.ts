import { asObjectId, isObjectId, isObjectIdOrNull, isString } from 'utils'
import EmptyToken from 'structure/language/tokens/empty'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISubraceData } from 'types/database/files/subrace'
import type { TokenContext } from 'types/language'

class SubraceData implements ISubraceData {
    public readonly name: string
    public readonly description: string
    public readonly content: string
    public readonly parentFile: ObjectId | null
    // Abilities
    public readonly abilities: Array<ObjectId | string>
    // Modifiers
    public readonly modifiers: ObjectId[]

    public constructor (data: Simplify<ISubraceData> = {}) {
        this.name = data.name ?? SubraceData.properties.name.value
        this.description = data.description ?? SubraceData.properties.description.value
        this.content = data.content ?? SubraceData.properties.content.value
        this.parentFile = asObjectId(data.parentFile) ?? SubraceData.properties.parentFile.value
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
        content: {
            value: '',
            validate: isString
        },
        parentFile: {
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

    public createDescriptionContexts(elements: ElementDefinitions): [description: TokenContext] {
        const descriptionContext = {
            title: new EmptyToken(elements, this.name),
            name: new EmptyToken(elements, this.name)
        }
        return [descriptionContext]
    }

    public createContexts(elements: ElementDefinitions): [description: TokenContext, content: TokenContext] {
        const [descriptionContext] = this.createDescriptionContexts(elements)
        const contentContext: TokenContext = {
            ...descriptionContext,
            description: StoryScript.tokenize(elements, this.description, descriptionContext).root
        }
        return [descriptionContext, contentContext]
    }
}

export default SubraceData
