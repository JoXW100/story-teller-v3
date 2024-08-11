import ModifierDataFactory from '../modifier/factory'
import type { ModifierData } from '../modifier/factory'
import { isString } from 'utils'
import EmptyToken from 'structure/language/tokens/empty'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IConditionData } from 'types/database/files/condition'
import type { TokenContext } from 'types/language'

class ConditionData implements IConditionData {
    public readonly name: string
    public readonly description: string
    // Modifiers
    public readonly modifiers: ModifierData[]

    public constructor(data: Simplify<IConditionData>) {
        this.name = data.name ?? ConditionData.properties.name.value
        this.description = data.description ?? ConditionData.properties.description.value
        // Other
        this.modifiers = ConditionData.properties.modifiers.value
        if (Array.isArray(data.modifiers)) {
            for (const value of data.modifiers) {
                this.modifiers.push(ModifierDataFactory.create(value))
            }
        }
    }

    public static properties: DataPropertyMap<IConditionData, ConditionData> = {
        name: {
            value: '',
            validate: isString
        },
        description: {
            value: '',
            validate: isString
        },
        // Modifiers
        modifiers: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(ModifierDataFactory.validate),
            simplify: (value) => value.length > 0 ? value : null
        }
    }

    public createDescriptionContexts(elements: ElementDefinitions): [description: TokenContext] {
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

export default ConditionData
