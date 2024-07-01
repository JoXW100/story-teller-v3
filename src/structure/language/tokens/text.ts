import Token from '.'
import type { MarkerData } from 'types/language'

class TextToken extends Token {
    protected text: string = ''

    public get value(): string {
        return this.text
    }

    public override get isEmpty(): boolean {
        return this.text.length === 0
    }

    public parse(part: string, line: number, column: number, markers: MarkerData[]): boolean {
        this.text += part
        this._lineEnd = line
        this._columnEnd = column + part.length
        return true
    }

    public build(): React.ReactNode {
        return this.value
    }
}

export default TextToken
