import BodyToken from './tokens/body'
import { keysOf } from 'utils'
import type { IToken, MonacoType, MonacoEditor, MarkerData, TokenizedResult, CompletionItemProvider, HoverProvider, TokenContext } from 'types/language'
import type { ElementDefinitions } from 'structure/elements/dictionary'

class StoryScript {
    private readonly tokenHolder: { token: IToken | null } = { token: null }
    private readonly elements: ElementDefinitions

    public constructor(elements: ElementDefinitions) {
        this.elements = elements
    }

    public register(monaco: MonacoType): void {
        monaco.languages.register({ id: 'storyscript' })
        monaco.languages.setMonarchTokensProvider('storyscript', {
            keywords: keysOf(this.elements).map(k => `\\${k}`),
            brackets: [
                { open: '[', close: ']', token: 'param-brackets' },
                { open: '{', close: '}', token: 'body-brackets' },
                { open: '[', close: ']~', token: 'param-brackets' },
                { open: '{', close: '}~', token: 'body-brackets' }
            ],
            tokenizer: {
                root: [
                    [/\[/, {
                        token: '@brackets',
                        switchTo: 'arguments'
                    }],
                    [/\\\w+/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@default': 'variable'
                        }
                    }],
                    [/\$\w+/, 'variable'],
                    [/[\{\}\[\]]/, '@brackets'],
                    [/\~/, 'keyword'],
                    [/\%\%.*/, 'comment']
                ],
                arguments: [
                    [/((?:^|[\[,])[\n\r\t ]*)(https?:\/\/[^\],]+)/i, ['@default', 'url']],
                    [/((?:^|[\[,])[\n\r\t ]*)(\w+)(:)/, ['@default', 'key', '@default']],
                    [/((?:^|[\[,])[\n\r\t ]*)([^,:\]\n\t]+[\n\r\t ]*)/, ['@default', 'value']],
                    [/\]/, {
                        token: '@brackets',
                        switchTo: 'root'
                    }]
                ]
            }
        })
        monaco.editor.defineTheme('storyscript-default', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'keyword', foreground: '#FF6600' },
                { token: 'comment', foreground: '#999999' },
                { token: 'key', foreground: '#009966' },
                { token: 'value', foreground: '#006699' },
                { token: 'string', foreground: '#009966' },
                { token: 'variable', foreground: '#006699' },
                { token: 'param-brackets', foreground: '#fcba03' },
                { token: 'body-brackets', foreground: '#e303fc' }
            ],
            colors: { }
        })
        monaco.languages.registerCompletionItemProvider('storyscript', this.createCompletionItemProvider(monaco))
        monaco.languages.registerHoverProvider('storyscript', this.createHoverProvider(monaco))
        monaco.languages.registerDefinitionProvider('storyscript', {
            provideDefinition(model, position, token) {
                // const word = model.getWordAtPosition(position)
                // console.log('definition', word)
                // TODO: LINK TO KEYWORD DEFINITION
                return undefined
            }
        })
    }

    public applyMarkers(editor: MonacoEditor, monaco: MonacoType, data?: TokenizedResult, context?: TokenContext): IToken | null {
        const model = editor.getModel()
        if (model === null) {
            return this.tokenHolder.token
        }

        if (data !== undefined) {
            this.tokenHolder.token = data.root
            monaco.editor.setModelMarkers(model, 'owner', data.markers)
        } else {
            const root = new BodyToken(this.elements, 1, 1, context)
            const markers: MarkerData[] = []
            const numLines = model.getLineCount()
            for (let i = 1; i <= numLines; i++) {
                const line = model.getLineContent(i)
                StoryScript.parseLine(line, i, root, markers)
            }
            this.tokenHolder.token = root.complete(numLines, model.getLineContent(numLines).length, markers)

            monaco.editor.setModelMarkers(model, 'owner', markers)
        }

        return this.tokenHolder.token
    }

    private static parseLine(line: string, lineNumber: number, token: IToken, markers: MarkerData[]): void {
        let column = 1
        const splits = line.split(/((?:\w+)|[\\~$:,\[\]\{\}]|%%)/)
        for (const part of splits) {
            if (part.length === 0) {
                continue
            }
            if (part === '%%') {
                break // comment
            }
            if (!token.parse(part, lineNumber, column, markers)) {
                markers.push({
                    startLineNumber: lineNumber,
                    endLineNumber: lineNumber,
                    startColumn: column,
                    endColumn: column,
                    message: `Unexpected '${part}'`,
                    severity: 8
                })
            }
            column += part.length
        }
    }

    public static tokenize(elements: ElementDefinitions, text: string, context?: TokenContext): TokenizedResult {
        const root = new BodyToken(elements, 1, 1, context)
        const markers: MarkerData[] = []
        const lines = text.split(/[\n\r]+/)
        for (let i = 0; i < lines.length; i++) {
            this.parseLine(lines[i], i + 1, root, markers)
        }

        return {
            root: root.complete(lines.length, lines[lines.length - 1].length, markers),
            markers: markers
        }
    }

    private createCompletionItemProvider(monaco: MonacoType): CompletionItemProvider {
        const tokenHolder = this.tokenHolder
        return {
            provideCompletionItems(model, position, context, token) {
                const target = tokenHolder.token?.findTokenAt(position)?.[0] ?? null
                const suggestions = target?.getCompletion(monaco) ?? []
                return {
                    suggestions: suggestions,
                    incomplete: false
                }
            }
        }
    }

    private createHoverProvider(monaco: MonacoType): HoverProvider {
        const tokenHolder = this.tokenHolder
        return {
            provideHover: function (model, position, token) {
                if (tokenHolder.token !== null) {
                    const match = tokenHolder.token.findTokenAt(position)
                    if (match === null || match.length < 1) {
                        return undefined
                    }

                    const target = match[0]
                    const hover = target.getHoverText(model)
                    return { contents: hover }
                }

                return undefined
            }
        }
    }
}

export default StoryScript
