import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { MarkerData, ITokenData } from 'types/language'

class Tokenizer {
    private static readonly TokenizationExpr = /(%%|[^\w]|\w+)/i // /([\\~$:,\[\]\(\)\{\}\n\r\t ]|%%|[^\\~$:,\[\]\(\)\{\}\n\r\t ]+)/
    private static readonly WhiteSpaceExpr = /^\s*$/

    public readonly elements: ElementDefinitions
    private readonly text: string
    private readonly _markers: MarkerData[] = []
    private readonly matchExpr: RegExp = new RegExp(Tokenizer.TokenizationExpr, 'g')
    private isPushedBack: boolean = false
    private lineIndex: number = 0
    private prevIndex: number = -1
    private current: ITokenData = {
        startLineNumber: 1,
        endLineNumber: 1,
        startColumn: 1,
        endColumn: 1,
        content: ''
    }

    public constructor(elements: ElementDefinitions, text: string) {
        this.text = text
        this.elements = elements
    }

    public get token(): ITokenData {
        return this.current
    }

    public get markers(): readonly MarkerData[] {
        return this._markers
    }

    public addMarker(message: string, token: Omit<ITokenData, 'content'>): void {
        this._markers.push({
            ...token,
            message: message,
            severity: 8
        })
    }

    public next(ignoreWhiteSpace: boolean = false): ITokenData | null {
        if (this.isPushedBack) {
            this.isPushedBack = false
            return this.current
        }
        const match = this.matchExpr.exec(this.text)
        if (match === null || match.index <= this.prevIndex) {
            return null
        } else {
            this.prevIndex = match.index
            const token = match[1]
            switch (token) {
                case '\n': {
                    const lineNumber = this.current.endLineNumber + 1
                    this.current = { ...this.current, endColumn: 1, startLineNumber: lineNumber, endLineNumber: lineNumber }
                    this.lineIndex = match.index + 1
                    return this.next(ignoreWhiteSpace)
                }
                case '%%': {
                    return this.nextLine(ignoreWhiteSpace)
                }
                case '\~': {
                    const column = 1 + match.index - this.lineIndex
                    return (this.current = { ...this.current, startColumn: column, endColumn: column, content: ' ' })
                }
                default: {
                    if (ignoreWhiteSpace && Tokenizer.WhiteSpaceExpr.test(token)) {
                        return this.next(ignoreWhiteSpace)
                    }
                    const column = 1 + match.index - this.lineIndex
                    return (this.current = { ...this.current, startColumn: column, endColumn: column + token.length - 1, content: token })
                }
            }
        }
    }

    public nextLine(ignoreWhiteSpace: boolean = false): ITokenData | null {
        while (true) {
            const match = this.matchExpr.exec(this.text)
            if (match === null || match.index <= this.prevIndex) {
                return null
            } else {
                this.prevIndex = match.index
                const token = match[1]
                if (token === '\n') {
                    const lineNumber = this.current.endLineNumber + 1
                    this.current = { ...this.current, endColumn: 1, startLineNumber: lineNumber, endLineNumber: lineNumber }
                    this.lineIndex = match.index + 1
                    return this.next(ignoreWhiteSpace)
                }
            }
        }
    }

    public back(): void {
        this.isPushedBack = true
    }
}

export default Tokenizer
