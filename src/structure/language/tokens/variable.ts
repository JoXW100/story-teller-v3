import type Tokenizer from '../tokenizer'
import Token from '.'
import { keysOf } from 'utils'
import type { ValueOf } from 'types'
import type { CompletionItem, MarkdownString, MonacoModel, MonacoType } from 'types/language'
import EmptyToken from './empty'

class VariableToken extends Token {
    private static readonly WordExpr = /^\w+$/i
    private text: string = ''

    public get value(): string {
        return this.text
    }

    public override get isEmpty(): boolean {
        return this.value.length === 0
    }

    public parse(tokenizer: Tokenizer): void {
        const token = tokenizer.next()
        if (token === null) {
            this.finalize(tokenizer, 'Unexpected end of text, missing command keyword')
            return
        }

        const value = token.content.trim()
        if (!VariableToken.WordExpr.test(value)) {
            tokenizer.addMarker(`Invalid variable name: '${value}'`, token)
        } else if (!(value in this.context)) {
            tokenizer.addMarker(`Undefined variable: '${value}'`, token)
        } else {
            this.text = value
        }

        this.finalize(tokenizer)
    }

    public build(key?: string | undefined): React.ReactNode {
        return this.getContent()?.build(key)
    }

    public getContent(): ValueOf<typeof this.context> | null {
        return this.context[this.text] ?? null
    }

    public override getText(): string | null {
        return this.getContent()?.getText() ?? null
    }

    public override getHoverText(model: MonacoModel): MarkdownString[] {
        const token = this.getContent()
        if (token !== null) {
            if (token === null) {
                return [{
                    value: `'${this.text}' -> `
                }]
            }
            const value = token instanceof EmptyToken
                ? token.value
                : model.getValueInRange(token)

            return [{
                value: `variable: '${this.text}' = ${value}`
            }]
        }
        return []
    }

    public override getCompletion(monaco: MonacoType): CompletionItem[] {
        return keysOf(this.context).map<Partial<CompletionItem>>((token) => {
            return {
                label: token,
                insertText: token,
                kind: monaco.languages.CompletionItemKind.Variable
            }
        }) as CompletionItem[]
    }
}

export default VariableToken
