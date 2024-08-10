import BodyToken from './tokens/body'
import { isDefined, keysOf } from 'utils'
import type { IToken, MonacoType, MonacoEditor, MarkerData, CompletionItemProvider, HoverProvider, TokenContext, MonacoDisposable, MonarchLanguage, ITokenizedResult } from 'types/language'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import Tokenizer from './tokenizer'

class StoryScript {
    private isRegistered = false
    private readonly tokenHolder: { token: IToken | null } = { token: null }
    private readonly elements: ElementDefinitions
    private readonly disposable: MonacoDisposable[] = []

    public constructor(elements: ElementDefinitions) {
        this.elements = elements
    }

    public register(monaco: MonacoType): void {
        if (this.isRegistered) {
            return
        }

        this.isRegistered = true
        monaco.languages.register({ id: 'storyscript' })
        this.disposable.push(monaco.languages.setMonarchTokensProvider('storyscript', this.createMonarchTokensProvider()))
        this.disposable.push(monaco.languages.registerCompletionItemProvider('storyscript', this.createCompletionItemProvider(monaco)))
        this.disposable.push(monaco.languages.registerHoverProvider('storyscript', this.createHoverProvider(monaco)))
        // monaco.languages.registerDefinitionProvider('storyscript', {
        //     provideDefinition(model, position, token) {
        //         // const word = model.getWordAtPosition(position)
        //         // console.log('definition', word)
        //         // TODO: LINK TO KEYWORD DEFINITION
        //         return undefined
        //     }
        // })
        monaco.editor.defineTheme('storyscript-default', {
            base: 'vs',
            inherit: true,
            rules: [
                { token: 'keyword', foreground: '#FF6600' },
                { token: 'comment', foreground: '#999999' },
                { token: 'equation', foreground: '#5b9138' },
                { token: 'key', foreground: '#009966' },
                { token: 'value', foreground: '#006699' },
                { token: 'string', foreground: '#009966' },
                { token: 'variable', foreground: '#006699' },
                { token: 'param-brackets', foreground: '#fcba03' },
                { token: 'body-brackets', foreground: '#e303fc' }
            ],
            colors: { }
        })
    }

    public dispose(): void {
        for (const disposable of this.disposable) {
            disposable.dispose()
        }
        this.isRegistered = false
    }

    public applyMarkers(editor: MonacoEditor, monaco: MonacoType, data?: ITokenizedResult, context?: TokenContext): void {
        const model = editor.getModel()
        if (model === null) {
            return
        }

        if (data !== undefined) {
            this.tokenHolder.token = data.root
            monaco.editor.setModelMarkers(model, 'owner', data.markers as MarkerData[])
        } else {
            const result = StoryScript.tokenize(this.elements, editor.getValue(), context)
            this.tokenHolder.token = result.root
            monaco.editor.setModelMarkers(model, 'owner', result.markers as MarkerData[])
        }
    }

    public get token(): IToken | null {
        return this.tokenHolder.token
    }

    public static tokenize(elements: ElementDefinitions, text: string, context?: TokenContext): ITokenizedResult {
        const root = new BodyToken(1, 1, context)
        const tokenizer = new Tokenizer(elements, text)
        root.parse(tokenizer, true)

        return {
            root: root,
            markers: tokenizer.markers
        }
    }

    private createMonarchTokensProvider(): MonarchLanguage {
        return {
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
                    [/\%\%.*/, 'comment'],
                    [/\%/, {
                        token: 'equation',
                        switchTo: 'equation'
                    }],
                    [/\\\w+/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@default': 'variable'
                        }
                    }],
                    [/\$\w+/, 'variable'],
                    [/[\{\}\[\]]/, '@brackets'],
                    [/\~/, 'keyword']
                ],
                arguments: [
                    [/\$\w+/, 'variable'],
                    [/((?:^|[\[,])\s*)(https?:\/\/[^\],]+)/i, ['@default', 'url']],
                    [/((?:^|[\[,])\s*)(\w+)(:)/, ['@default', 'key', '@default']],
                    [/((?:^|[\[,])\s*)([^,:\]\s]+\s*)/, ['@default', 'value']],
                    [/\]/, {
                        token: '@brackets',
                        switchTo: 'root'
                    }]
                ],
                equation: [
                    [/\$\w+/, 'variable'],
                    [/[0-9\+\-\*\/\s]+/, 'equation'],
                    [/\%/, {
                        token: 'equation',
                        switchTo: 'root'
                    }]
                ]
            }
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
                if (isDefined(tokenHolder.token)) {
                    const match = tokenHolder.token.findTokenAt(position)
                    if (match.length < 1) {
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
