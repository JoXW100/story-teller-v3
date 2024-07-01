import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { TokenContext, MonacoType, IToken, MarkerData, MonacoModel, CompletionItem, MarkdownString, Position } from 'types/language'

export abstract class Token implements IToken {
    protected _lineEnd: number = -1
    protected _columnEnd: number = -1
    protected _error: string | null = null

    public readonly elements: ElementDefinitions
    public readonly context: TokenContext
    public readonly subTokens: IToken[] = []
    public readonly consumePart: boolean = false
    public readonly lineStart: number
    public get lineEnd(): number {
        if (this._lineEnd > 0) {
            return this._lineEnd
        }
        let max = this.lineStart
        for (const token of this.subTokens) {
            max = Math.max(max, token.lineEnd)
        }
        return max
    }

    public readonly columnStart: number
    public get columnEnd(): number {
        if (this._columnEnd > 0) {
            return this._columnEnd
        }
        let max = this.columnStart
        let line = this.lineStart
        for (const token of this.subTokens) {
            const tokenLineStart = token.lineStart
            if (tokenLineStart >= line) {
                max = Math.max(max, token.columnStart)
                line = tokenLineStart
            }
        }
        return max
    }

    public get hasError(): boolean {
        return this._error !== null
    }

    public get errorMessage(): string {
        return this._error ?? ''
    }

    public get isEmpty(): boolean {
        return this.subTokens.length === 0
    }

    public constructor(elements: ElementDefinitions, line: number, column: number, context: TokenContext = {}) {
        this.elements = elements
        this.lineStart = line
        this.columnStart = column
        this.context = context
    }

    public complete(line: number, column: number, _: MarkerData[]): this {
        this._lineEnd = line
        this._columnEnd = column
        return this
    }

    public findTokenAt(position: Position): IToken[] {
        if (position.lineNumber < this.lineStart ||
            position.lineNumber > this.lineEnd) {
            return []
        }
        if (position.lineNumber === this.lineStart && position.column < this.columnStart) {
            return []
        }
        if (position.lineNumber === this.lineEnd && position.column - 1 > this.columnEnd) {
            return []
        }
        for (const token of this.subTokens) {
            const match = token?.findTokenAt(position) ?? []
            if (match.length > 0) {
                return [...match, this]
            }
        }
        return [this]
    }

    public getHoverText(_: MonacoModel): MarkdownString[] {
        return []
    }

    public getCompletion(_: MonacoType): CompletionItem[] {
        return []
    }

    public abstract parse(part: string, line: number, column: number, markers: MarkerData[]): boolean

    public abstract build(key?: string): React.ReactNode
}

export default Token
