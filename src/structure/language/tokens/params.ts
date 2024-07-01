import Token from '.'
import ParamToken from './param'
import { isKeyOf } from 'utils'
import type { MarkerData, TokenContext } from 'types/language'
import type { ElementDefinitions } from 'structure/elements/dictionary'

class ParamsToken extends Token {
    public override readonly consumePart: boolean = true
    private readonly keyword: keyof typeof this.elements
    private readonly keys: Record<string, number> = {}
    private readonly values: Record<string, number> = {}
    private key: string | null = null
    private textIndex: number = -1

    private get text(): ParamToken | null {
        if (this.textIndex >= 0 && this.textIndex < this.subTokens.length) {
            return this.subTokens[this.textIndex] as ParamToken
        }
        return null
    }

    public constructor(elements: ElementDefinitions, line: number, column: number, keyword: keyof ElementDefinitions, context: TokenContext = {}) {
        // Create new context instance
        super(elements, line, column, { ...context })
        this.keyword = keyword
    }

    private endParam(line: number, column: number, markers: MarkerData[]): void {
        let key = this.key
        const index = this.textIndex
        const text = this.text?.complete(line, column, markers) ?? null
        this.key = null
        this.textIndex = -1
        if (key === null) {
            key = this.elements[this.keyword].defaultParam
            if (key === null) {
                const value = text?.value ?? ''
                markers.push({
                    startLineNumber: text?.lineStart ?? line,
                    endLineNumber: text?.lineEnd ?? line,
                    startColumn: text?.columnStart ?? column,
                    endColumn: (text?.columnStart ?? column) + value.length,
                    message: `Invalid argument: '${value}', \\${this.keyword} accepts no arguments`,
                    severity: 8
                })
                return
            }
        }
        if (text !== null) {
            this.values[key] = index
        }
    }

    private addText(line: number, column: number): ParamToken {
        const text = new ParamToken(this.elements, line, column, this.keyword, 'value', this.context)
        this.subTokens.push(text)
        this.textIndex = this.subTokens.length - 1
        return text
    }

    public getKey(key: string): ParamToken | null {
        return this.subTokens[this.keys[key]] as ParamToken ?? null
    }

    public getValue(key: string): ParamToken | null {
        return this.subTokens[this.values[key]] as ParamToken ?? null
    }

    public getKeys(): string[] {
        return Object.keys(this.keys)
    }

    public getValues(): string[] {
        return Object.values(this.values).map(i => (this.subTokens[i] as ParamToken).value)
    }

    public getKeyValues(): Record<string, string> {
        const result: Record<string, string> = {}
        for (const key in this.values) {
            result[key] = this.getValue(key)?.value ?? ''
        }
        return result
    }

    public parse(part: string, line: number, column: number, markers: MarkerData[]): boolean {
        switch (part) {
            case ',': {
                this.endParam(line, column, markers)
                return true
            }
            case ']': {
                this.endParam(line, column, markers)
                return false
            }
            case '{':
            case '}':
            case '\\':
            case '[':
                markers.push({
                    startLineNumber: line,
                    endLineNumber: line,
                    startColumn: column,
                    endColumn: column,
                    message: `Unexpected '${part}'`,
                    severity: 8
                })
                return true
            case ':': {
                if (this.text === null) {
                    markers.push({
                        startLineNumber: line,
                        endLineNumber: line,
                        startColumn: column,
                        endColumn: column + part.length,
                        message: `Unexpected '${part}'`,
                        severity: 8
                    })
                    return true
                }

                const text = this.text
                if (this.key !== null) {
                    markers.push({
                        startLineNumber: text.lineStart,
                        endLineNumber: text.lineEnd,
                        startColumn: text.columnStart,
                        endColumn: text.columnEnd + part.length,
                        message: 'Expected separator \',\'',
                        severity: 8
                    })
                    return true
                }

                const key = text.value
                if (/^https?/.test(key)) {
                    // console.log('ParamToken.url', key)
                    return text.parse(part, line, column, markers)
                }
                if (!isKeyOf(key, this.elements[this.keyword].params)) {
                    // console.log(`ParamToken.key: ${key} at line = ${line}, column = ${column}`)
                    markers.push({
                        startLineNumber: text.lineStart,
                        endLineNumber: text.lineEnd,
                        startColumn: text.columnStart,
                        endColumn: text.columnEnd,
                        message: `Invalid argument: '${key}'`,
                        severity: 8
                    })
                }
                this.key = key
                this.keys[key] = this.textIndex
                this.textIndex = -1
                text.type = 'key'
                return true
            }
            default: {
                // console.log(`ParamToken.found: ${part} at line = ${line}, column = ${column}`)
                let text = this.text
                if (text === null) {
                    if (/^[\t\n\r ]*$/.test(part)) {
                        return true
                    }
                    text = this.addText(line, column)
                }

                return text.parse(part, line, column, markers)
            }
        }
    }

    public build(id?: string | undefined): React.ReactNode {
        return null
    }

    public override complete(line: number, column: number, markers: MarkerData[]): this {
        if (this.text !== null) {
            markers.push({
                startLineNumber: this.lineStart,
                endLineNumber: line,
                startColumn: this.columnStart,
                endColumn: column,
                message: 'Unexpected end of params',
                severity: 8
            })
        }
        return super.complete(line, column, markers)
    }
}

export default ParamsToken
