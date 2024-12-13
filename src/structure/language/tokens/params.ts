import type Tokenizer from '../tokenizer'
import Token from '.'
import KeyValueToken from './keyValue'
import type { IElement } from 'structure/elements'
import type { TokenContext } from 'types/language'

class ParamsToken extends Token {
    private readonly element: IElement

    public constructor(element: IElement, startLineNumber?: number, startColumn?: number, context?: TokenContext) {
        super(startLineNumber, startColumn, context)
        this.element = element
    }

    public get value(): Record<string, string> {
        const result: Record<string, string> = {}
        for (const child of this.children) {
            if (child instanceof KeyValueToken && child.key !== null) {
                result[child.key] = child.value
            }
        }
        return result
    }

    public parse(tokenizer: Tokenizer): void {
        let token = tokenizer.next(true)
        while (token !== null) {
            switch (token.content) {
                case ']': {
                    this.finalize(tokenizer)
                    return
                }
                case ',': {
                    break
                }
                default: {
                    tokenizer.back()
                    const value = new KeyValueToken(this.element, token.startLineNumber, token.startColumn, this.context)
                    value.parse(tokenizer)
                    this.children.push(value)
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

export default ParamsToken
