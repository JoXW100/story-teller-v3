import Token from '.'
import ParamsToken from './params'
import BodyToken from './body'
import { asKeyOf, keysOf } from 'utils'
import type { CompletionItem, MonacoType, MarkdownString, MarkerData } from 'types/language'

class CommandToken extends Token {
    private keyword: keyof typeof this.elements | null = null
    private mode: 'params' | 'body' | 'keyword' | 'none' = 'keyword'

    public get value(): keyof typeof this.elements | null {
        return this.keyword
    }

    public get params(): ParamsToken | null {
        return this.subTokens[0] as ParamsToken ?? null
    }

    private set params(value: ParamsToken) {
        this.subTokens[0] = value
    }

    public get body(): BodyToken | null {
        return this.subTokens[1] as BodyToken ?? null
    }

    private set body(value: BodyToken) {
        this.subTokens[1] = value
    }

    public parse(part: string, line: number, column: number, markers: MarkerData[]): boolean {
        switch (this.mode) {
            case 'keyword':
                if (this.keyword === null) {
                    this.keyword = asKeyOf(part, this.elements)
                    this.mode = 'none'
                    if (this.keyword === null) {
                        markers.push({
                            startLineNumber: line,
                            endLineNumber: line,
                            startColumn: column,
                            endColumn: column + part.length,
                            message: `Invalid keyword: '${part}'`,
                            severity: 8
                        })
                    }
                    return true
                }
                return false
            case 'body':
                if (this.body !== null && this.body.parse(part, line, column, markers)) {
                    return true
                } else {
                    this.body?.complete(line, column, markers)
                    this.mode = 'none'
                    return true
                }
            case 'params':
                if (this.params !== null && this.params.parse(part, line, column, markers)) {
                    return true
                } else {
                    this.params?.complete(line, column, markers)
                    this.mode = 'none'
                    return true
                }
            default:
                if (this.keyword === 'set') {
                    const key = this.params?.getValue('name')?.value
                    if (key !== null && key !== undefined) {
                        this.context[key] = this.body
                    }
                }
                break
        }

        if (this.keyword === null) {
            return false
        }

        if (/^[\t\n\r ]*$/.test(part)) {
            return true
        }

        switch (part) {
            case '{':
                if (this.body !== null) {
                    markers.push({
                        startLineNumber: line,
                        endLineNumber: line,
                        startColumn: column,
                        endColumn: column + part.length,
                        message: `Unexpected body start: '${part}', ${this.keyword} already has a body defined`,
                        severity: 8
                    })
                }
                this.body = new BodyToken(this.elements, line, column, this.context)
                this.mode = 'body'
                return true
            case '[':
                if (this.params !== null) {
                    markers.push({
                        startLineNumber: line,
                        endLineNumber: line,
                        startColumn: column,
                        endColumn: column + part.length,
                        message: `Unexpected params start: '${part}', ${this.keyword} already has params defined`,
                        severity: 8
                    })
                }
                this.params = new ParamsToken(this.elements, line, column, this.keyword, this.context)
                this.mode = 'params'
                return true
            case ']':
                markers.push({
                    startLineNumber: line,
                    endLineNumber: line,
                    startColumn: column,
                    endColumn: column,
                    message: `Unexpected params end: '${part}', no start bracket found`,
                    severity: 8
                })
                return true
            default:
                return false
        }
    }

    public build(id: string = '0'): React.ReactNode {
        if (this.keyword !== null) {
            return this.elements[this.keyword].parse(this, id)
        }
    }

    public override complete(line: number, column: number, markers: MarkerData[]): this {
        if (this.mode !== 'none') {
            markers.push({
                startLineNumber: this.lineStart,
                endLineNumber: line,
                startColumn: this.columnStart,
                endColumn: column,
                message: 'Unexpected end of command',
                severity: 8
            })
        }
        return super.complete(line, column, markers)
    }

    public override getHoverText(): MarkdownString[] {
        if (this.keyword === null) {
            return []
        }
        return [{
            value: `'${this.keyword}', a command with arguments: ${keysOf(this.elements[this.keyword].params).join(', ')}`
        }]
    }

    public override getCompletion(monaco: MonacoType): CompletionItem[] {
        return keysOf(this.elements).map<Partial<CompletionItem>>((token) => {
            return {
                label: token,
                insertText: token,
                kind: monaco.languages.CompletionItemKind.Function
            }
        }) as CompletionItem[]
    }
}

export default CommandToken
