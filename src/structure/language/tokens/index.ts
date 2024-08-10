import type Tokenizer from '../tokenizer'
import type { CompletionItem, IToken, MarkdownString, MonacoModel, MonacoType, Position, TokenContext } from 'types/language'

abstract class Token implements IToken {
    public readonly context: TokenContext
    public readonly startLineNumber: number
    public readonly startColumn: number
    private _endLineNumber: number
    private _endColumn: number
    public readonly children: Token[] = []

    public constructor(startLineNumber: number = 1, startColumn: number = 1, context: TokenContext = {}) {
        this.startLineNumber = startLineNumber
        this.startColumn = startColumn
        this._endLineNumber = this.startLineNumber
        this._endColumn = this.startColumn
        this.context = context
    }

    public get isEmpty(): boolean {
        return this.children.length === 0
    }

    public get endLineNumber(): number {
        return this._endLineNumber
    }

    protected set endLineNumber(value: number) {
        this._endLineNumber = value
    }

    public get endColumn(): number {
        return this._endColumn
    }

    protected set endColumn(value: number) {
        this._endColumn = value
    }

    public abstract parse(tokenizer: Tokenizer): void
    public abstract build(key?: string): React.ReactNode

    public findTokenAt(position: Position): Token[] {
        if (position.lineNumber < this.startLineNumber ||
            position.lineNumber > this.endLineNumber) {
            return []
        }
        if (position.lineNumber === this.startLineNumber && position.column < this.startColumn) {
            return []
        }
        if (position.lineNumber === this.endLineNumber && position.column - 1 > this.endColumn) {
            return []
        }
        for (const token of this.children) {
            const match = token.findTokenAt(position)
            if (match.length > 0) {
                return [...token.findTokenAt(position), this]
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

    public getText(): string | null {
        return ''
    }

    protected finalize(tokenizer: Tokenizer, message?: string): void {
        this.endLineNumber = tokenizer.token.startLineNumber
        this.endColumn = tokenizer.token.startColumn
        if (message !== undefined) {
            tokenizer.addMarker(message, this)
        }
    }
}

export default Token
