import type Tokenizer from '../tokenizer'
import Token from '.'
import type { TokenContext } from 'types/language'

class TextToken extends Token {
    private text: string = ''
    private readonly breakExpr: RegExp | null

    public constructor(breakExpr: RegExp | null = null, startLineNumber?: number, startColumn?: number, context?: TokenContext) {
        super(startLineNumber, startColumn, context)
        this.breakExpr = breakExpr
    }

    public get value(): string {
        return this.text
    }

    public override get isEmpty(): boolean {
        return this.value.length === 0
    }

    public parse(tokenizer: Tokenizer): void {
        let token = tokenizer.next()
        while (token !== null) {
            if (this.breakExpr !== null && this.breakExpr.test(token.content)) {
                tokenizer.back()
                this.finalize(tokenizer)
                return
            }
            this.text += token.content
            token = tokenizer.next()
        }
        if (this.text === '') {
            this.finalize(tokenizer, 'Unexpected end of text')
        } else {
            this.finalize(tokenizer)
        }
    }

    public build(): React.ReactNode {
        return this.value
    }

    public override getText(): string {
        return this.text
    }
}

export default TextToken
