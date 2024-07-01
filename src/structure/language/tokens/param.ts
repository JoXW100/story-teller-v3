import TextToken from './text'
import { isKeyOf, keysOf } from 'utils'
import type { MonacoType, MarkdownString, TokenContext, CompletionItem } from 'types/language'
import type { ElementDefinitions } from 'structure/elements/dictionary'

class ParamToken extends TextToken {
    private readonly keyword: keyof typeof this.elements
    private _type: 'value' | 'key'

    public constructor(elements: ElementDefinitions, line: number, column: number, keyword: keyof ElementDefinitions, type: 'value' | 'key' = 'value', context: TokenContext = {}) {
        super(elements, line, column, context)
        this._type = type
        this.keyword = keyword
    }

    public get type(): typeof this._type {
        return this._type
    }

    public set type(type: typeof this._type) {
        this._type = type
    }

    public override getHoverText(): MarkdownString[] {
        if (this.type === 'key' && isKeyOf(this.keyword, this.elements)) {
            return [{
                value: `'${this.text}', an argument to command '${this.keyword}'`
            }]
        }
        return []
    }

    public override getCompletion(monaco: MonacoType): CompletionItem[] {
        return keysOf(this.elements[this.keyword].params).map<Partial<CompletionItem>>((token) => {
            return {
                label: token,
                insertText: token + ': ',
                kind: monaco.languages.CompletionItemKind.Property
            }
        }) as CompletionItem[]
    }
}

export default ParamToken
