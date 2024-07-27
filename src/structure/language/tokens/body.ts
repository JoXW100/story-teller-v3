import Token from '.'
import CommandToken from './command'
import TextToken from './text'
import VariableToken from './variable'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { MarkerData, IToken, TokenContext } from 'types/language'

class BodyToken extends Token {
    public override readonly consumePart: boolean = true
    private currentToken: IToken | null = null

    public constructor(elements: ElementDefinitions, line: number, column: number, context: TokenContext = {}) {
        super(elements, line, column, { ...context })
    }

    public parse(part: string, line: number, column: number, markers: MarkerData[]): boolean {
        if (this.currentToken !== null && !(this.currentToken instanceof TextToken)) {
            if (this.currentToken.parse(part, line, column, markers)) {
                return true
            }
            const token = this.currentToken.complete(line, column, markers)
            this.subTokens.push(token)
            this.currentToken = null

            if (token.consumePart) {
                return true
            }
        }

        switch (part) {
            case '}': {
                if (this.currentToken !== null) {
                    this.subTokens.push(this.currentToken.complete(line, column, markers))
                    this.currentToken = null
                }
                return false
            }
            case '\\': {
                if (this.currentToken !== null) {
                    this.subTokens.push(this.currentToken.complete(line, column, markers))
                    this.currentToken = null
                }
                this.currentToken = new CommandToken(this.elements, line, column, this.context)
                return true
            }
            case '$': {
                if (this.currentToken !== null) {
                    this.subTokens.push(this.currentToken.complete(line, column, markers))
                }
                this.currentToken = new VariableToken(this.elements, line, column, this.context)
                return true
            }
            case '~': {
                if (this.currentToken instanceof TextToken) {
                    return this.currentToken.parse(' ', line, column, markers)
                }
                this.currentToken = new TextToken(this.elements, line, column, this.context)
                return this.currentToken.parse(' ', line, column, markers)
            }
            case '{':
            case '[': {
                markers.push({
                    startLineNumber: line,
                    endLineNumber: line,
                    startColumn: column,
                    endColumn: column,
                    message: `Unexpected '${part}'`,
                    severity: 8
                })
                return true
            }
            default: {
                if (this.currentToken === null) {
                    if (/^[\t\n\r ]*$/.test(part)) {
                        return true
                    }
                    this.currentToken = new TextToken(this.elements, line, column, this.context)
                }
                if (this.currentToken.parse(part, line, column, markers)) {
                    return true
                }
                const token = this.currentToken.complete(line, column, markers)
                this.subTokens.push(token)
                this.currentToken = null
                return true
            }
        }
    }

    public build(id: string = '0'): React.ReactNode {
        return this.subTokens.map((token, index) => token.build(`${id}-${index}`) as JSX.Element)
    }

    public override complete(line: number, column: number, markers: MarkerData[]): this {
        if (this.currentToken !== null) {
            const token = this.currentToken.complete(line, column, markers)
            this.subTokens.push(token)
            this.currentToken = null
        } else if (this.currentToken !== null) {
            markers.push({
                startLineNumber: this.lineStart,
                endLineNumber: line,
                startColumn: this.columnStart,
                endColumn: column,
                message: 'Unexpected end of body',
                severity: 8
            })
        }
        return super.complete(line, column, markers)
    }
}

export default BodyToken
