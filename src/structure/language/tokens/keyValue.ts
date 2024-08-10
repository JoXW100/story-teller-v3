import type Tokenizer from '../tokenizer'
import Token from '.'
import { asKeyOf, keysOf } from 'utils'
import type { IElement } from 'structure/elements'
import type { CompletionItem, MonacoType, TokenContext } from 'types/language'
import TextToken from './text'
import EquationToken from './equation'
import VariableToken from './variable'

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

class KeyValueToken extends Token {
    private readonly element: IElement
    private _key: string | null = null

    public constructor(element: IElement, startLineNumber?: number, startColumn?: number, context?: TokenContext) {
        super(startLineNumber, startColumn, context)
        this.element = element
    }

    public get key(): string | null {
        return this._key ?? this.element.defaultParam as string | null
    }

    public get value(): string {
        return this.children[0]?.getText()?.trim() ?? ''
    }

    public override get isEmpty(): boolean {
        return this.children.length === 0
    }

    public parse(tokenizer: Tokenizer): void {
        const token = tokenizer.next(true)
        if (token === null) {
            this.finalize(tokenizer, 'Unexpected end of text')
            return
        }
        switch (token.content) {
            case '\%': {
                const equation = new EquationToken(token.startLineNumber, token.startColumn, this.context)
                equation.parse(tokenizer)
                const next = tokenizer.next(true)
                if (next === null) {
                    this.finalize(tokenizer, 'Unexpected end of text')
                    return
                } else if (next.content !== '\]' && next.content !== '\,') {
                    this.finalize(tokenizer, `Unexpected symbol '${next.content}', expected ',' or ']'`)
                    return
                } else {
                    this.children.push(equation)
                    this.finalize(tokenizer)
                    return
                }
            }
            case '\$': {
                const variable = new VariableToken(token.startLineNumber, token.startColumn, this.context)
                variable.parse(tokenizer)
                const next = tokenizer.next(true)
                if (next === null) {
                    this.finalize(tokenizer, 'Unexpected end of text')
                    return
                } else if (next.content !== '\]' && next.content !== '\,') {
                    this.finalize(tokenizer, `Unexpected symbol '${next.content}', expected ',' or ']'`)
                    return
                } else {
                    this.children.push(variable)
                    this.finalize(tokenizer)
                    return
                }
            }
            default: {
                tokenizer.back()
                const text = new KeyToken(this.element, /^[\]\,\:]$/i, token.startLineNumber, token.startColumn, this.context)
                text.parse(tokenizer)
                const next = tokenizer.next(true)
                if (next === null) {
                    this.finalize(tokenizer, 'Unexpected end of text')
                    return
                }
                switch (next.content) {
                    case '\]':
                    case '\,': {
                        tokenizer.back()
                        this.children.push(text)
                        this.finalize(tokenizer)
                        return
                    }
                    case '\:': {
                        this._key = asKeyOf<string>(text.value.trim(), this.element.params)
                        if (this._key === null) {
                            this.finalize(tokenizer, `Invalid parameter: '${text.value}'`)
                            return
                        }
                        const value = new TextToken(/^[\]\,]$/i, token.startLineNumber, token.startColumn, this.context)
                        value.parse(tokenizer)
                        this.children.push(value)
                        this.finalize(tokenizer)
                        return
                    }
                    default: {
                        this.finalize(tokenizer, `Unexpected symbol '${next.content}'`)
                    }
                }
            }
        }
    }

    public build(): React.ReactNode {
        return null
    }
}

export default KeyValueToken
