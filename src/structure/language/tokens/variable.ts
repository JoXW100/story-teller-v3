import { keysOf } from 'utils'
import Token from '.'
import type { IToken, MonacoType, CompletionItem, MarkerData, MonacoModel, MarkdownString } from 'types/language'

class VariableToken extends Token {
    public override consumePart: boolean = true
    protected text: string = ''

    public get value(): string {
        return this.text
    }

    public getContent(): IToken | null {
        return this.context[this.text] ?? null
    }

    public override get isEmpty(): boolean {
        return this.text.length === 0 || !(this.text in this.context)
    }

    public override parse(part: string, line: number, column: number, markers: MarkerData[]): boolean {
        if (this.text.length > 0) {
            return false
        }

        this.text = part
        this._lineEnd = line
        this._columnEnd = column

        if (!/^\w+$/.test(this.text)) {
            markers.push({
                startLineNumber: line,
                endLineNumber: line,
                startColumn: column,
                endColumn: column + part.length,
                message: `Invalid variable name: '${this.text}'`,
                severity: 8
            })
        } else if (!(this.text in this.context)) {
            markers.push({
                startLineNumber: line,
                endLineNumber: line,
                startColumn: column,
                endColumn: column + part.length,
                message: `Undefined variable: '${this.text}'`,
                severity: 8
            })
        }

        return false // always parse just one word
    }

    public override build(id?: string | undefined): React.ReactNode {
        return this.getContent()?.build(id)
    }

    public override getHoverText(model: MonacoModel): MarkdownString[] {
        const token = this.getContent()
        if (token !== null) {
            if (token === null) {
                return [{
                    value: `'${this.text}' -> `
                }]
            }
            const value = model.getValueInRange({
                startLineNumber: token.lineStart,
                startColumn: token.columnStart + 1,
                endLineNumber: token.lineEnd,
                endColumn: token.columnEnd
            })

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
