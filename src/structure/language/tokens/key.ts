import TextToken from './text'
import { keysOf } from 'utils'
import type { IElement } from 'structure/elements'
import type { CompletionItem, MonacoType, TokenContext } from 'types/language'

class KeyToken extends TextToken {
    private readonly element: IElement

    public constructor(element: IElement, breakExpr: RegExp, startLineNumber?: number, startColumn?: number, context?: TokenContext) {
        super(breakExpr, startLineNumber, startColumn, context)
        this.element = element
    }

    public override getCompletion(monaco: MonacoType): CompletionItem[] {
        return keysOf(this.element.params).map<Partial<CompletionItem>>((key) => {
            return {
                label: String(key),
                insertText: `${String(key)}:`,
                kind: monaco.languages.CompletionItemKind.Property
            }
        }) as CompletionItem[]
    }
}

export default KeyToken
