import ModifierDataFactory, { type ModifierData } from '../modifier/factory'
import { asObjectId, isObjectIdOrNull, isString } from 'utils'
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
    // Modifiers
    public readonly modifiers: ModifierData[]

    public constructor (data: Simplify<ISubraceData> = {}) {
        this.name = data.name ?? SubraceData.properties.name.value
        this.description = data.description ?? SubraceData.properties.description.value
        this.content = data.content ?? SubraceData.properties.content.value
        this.parentFile = asObjectId(data.parentFile) ?? SubraceData.properties.parentFile.value
        // Modifiers
        this.modifiers = SubraceData.properties.modifiers.value
        if (Array.isArray(data.modifiers)) {
            for (const value of data.modifiers) {
                this.modifiers.push(ModifierDataFactory.create(value))
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
        modifiers: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(ModifierDataFactory.validate),
            simplify: (value) => value.length > 0 ? value : null
        }
    }

    public createDescriptionContexts(_elements: ElementDefinitions): [description: TokenContext] {
        const descriptionContext = {
            title: new EmptyToken(this.name),
            name: new EmptyToken(this.name)
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
