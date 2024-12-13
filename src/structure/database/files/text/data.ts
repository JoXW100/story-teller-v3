import { isString } from 'utils'
import EmptyToken from 'structure/language/tokens/empty'
import StoryScript from 'structure/language/storyscript'
import type { DataPropertyMap } from 'types/database'
import type { ITextData } from 'types/database/files/text'
import type { TokenContext } from 'types/language'
import type { ElementDefinitions } from 'structure/elements/dictionary'

class TextData implements ITextData {
    public readonly title: string
    public readonly description: string
    public readonly content: string

    public constructor(data: Partial<ITextData>) {
        this.title = data.title ?? TextData.properties.title.value
        this.description = data.description ?? TextData.properties.description.value
        this.content = data.content ?? TextData.properties.content.value
    }

    public static properties: DataPropertyMap<ITextData, TextData> = {
        title: {
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
        }
    }

    public createDescriptionContexts(_elements: ElementDefinitions): [description: TokenContext] {
        const descriptionContext = {
            title: new EmptyToken(this.title),
            name: new EmptyToken(this.title)
        }
        return [descriptionContext]
    }

    public createContexts(elements: ElementDefinitions): [description: TokenContext, content: TokenContext] {
        const [descriptionContext] = this.createDescriptionContexts(elements)
        const contentContext = {
            ...descriptionContext,
            description: StoryScript.tokenize(elements, this.description, descriptionContext).root
        }
        return [descriptionContext, contentContext]
    }
}

export default TextData
