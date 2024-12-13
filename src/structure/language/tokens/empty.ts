import Token from '.'
import type Tokenizer from '../tokenizer'

class EmptyToken extends Token {
    public readonly value: string

    public constructor(value: string, startLineNumber?: number, startColumn?: number) {
        super(startLineNumber, startColumn)
        this.value = value
    }

    public override get isEmpty(): boolean {
        return true
    }

    public parse(_tokenizer: Tokenizer): void {
        
    }

    public build(): React.ReactNode {
        return this.value
    }

    public override getText(): string {
        return this.value
    }
}

export default EmptyToken
