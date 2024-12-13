import type Tokenizer from '../tokenizer'
import Token from '.'
import TextToken from './text'
import EquationToken from './equation'
import VariableToken from './variable'
import KeyToken from './key'
import { asKeyOf } from 'utils'
import type { IElement } from 'structure/elements'
import type { TokenContext } from 'types/language'

class KeyValueToken extends Token {
    private static readonly BreakExpr = /^\$\{|[\],:]$/i
    private static readonly BreakValueExpr = /^\$\{|[\],$]$/i
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
        return this.children.map(child => child.getText()).join('').trim()
    }

    public override get isEmpty(): boolean {
        return this.children.length === 0
    }

    public parse(tokenizer: Tokenizer): void {
        const key = new KeyToken(this.element, KeyValueToken.BreakExpr, this.startLineNumber, this.startColumn, this.context)
        key.parse(tokenizer)
        const token = tokenizer.next(true)
        if (token === null) {
            this.finalize(tokenizer, 'Unexpected end of text')
            return
        }
        switch (token.content) {
            case ']':
            case ',': {
                tokenizer.back()
                this.children.push(key)
                this.finalize(tokenizer)
                break
            }
            case ':': {
                this._key = asKeyOf<string>(key.value.trim(), this.element.params)
                if (this._key === null) {
                    this.finalize(tokenizer, `Invalid parameter: '${key.value}'`)
                } else {
                    this.parseValue(tokenizer)
                }
                break
            }
            default: {
                tokenizer.back()
                this.parseValue(tokenizer)
            }
        }
    }

    private parseValue(tokenizer: Tokenizer): void {
        let token = tokenizer.next(true)
        while (token !== null) {
            switch (token.content) {
                case ']':
                case ',': {
                    tokenizer.back()
                    this.finalize(tokenizer)
                    return
                }
                case '$': {
                    const variable = new VariableToken(token.startLineNumber, token.startColumn, this.context)
                    variable.parse(tokenizer)
                    this.children.push(variable)
                    break
                }
                case '${': {
                    const equation = new EquationToken(token.startLineNumber, token.startColumn, this.context)
                    equation.parse(tokenizer)
                    this.children.push(equation)
                    break
                }
                default: {
                    tokenizer.back()
                    const text = new TextToken(KeyValueToken.BreakValueExpr, token.startLineNumber, token.startColumn, this.context)
                    text.parse(tokenizer)
                    this.children.push(text)
                    break
                }
            }
            token = tokenizer.next(true)
        }
        this.finalize(tokenizer, 'Unexpected end of text')
    }

    public build(): React.ReactNode {
        return null
    }
}

export default KeyValueToken
