import Tokenizer from './tokenizer'
import BodyToken from './tokens/body'
import { isDefined, keysOf } from 'utils'
import Logger from 'utils/logger'
import type { MonacoType, MarkerData, CompletionItemProvider, HoverProvider, TokenContext, MonarchLanguage, ITokenizedResult, MonacoModelWithToken, IToken } from 'types/language'
import type { ElementDefinitions } from 'structure/elements/dictionary'

class StoryScript {
    public static readonly LanguageId = 'storyscript'
    public static register(monaco: MonacoType, elements: ElementDefinitions): void {
        if (monaco.languages.getLanguages().some((value) => value.id === this.LanguageId)) {
            return
        }

        monaco.languages.register({ id: this.LanguageId })
        monaco.languages.setMonarchTokensProvider('storyscript', this.createMonarchTokensProvider(monaco, elements))
        monaco.languages.registerCompletionItemProvider('storyscript', this.createCompletionItemProvider(monaco))
        monaco.languages.registerHoverProvider('storyscript', this.createHoverProvider(monaco))
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
                { token: 'keyword', foreground: '#ff6600' },
                { token: 'comment', foreground: '#999999' },
                { token: 'equation', foreground: '#2053c2' },
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

    public static applyMarkers(model: MonacoModelWithToken, monaco: MonacoType, data?: ITokenizedResult, context?: TokenContext): IToken | null {
        if (model === null) {
            return null
        }

        if (!isDefined(model.tokenHolder)) {
            model.tokenHolder = {
                token: null
            }
        }

        if (data !== undefined) {
            model.tokenHolder.token = data.root
            monaco.editor.setModelMarkers(model, 'owner', data.markers as MarkerData[])
            return data.root
        } else {
            const result = StoryScript.tokenize(model.elements, model.getValue(), context)
            model.tokenHolder.token = result.root
            monaco.editor.setModelMarkers(model, 'owner', result.markers as MarkerData[])
            return result.root
        }
    }

    public static tokenize(elements: ElementDefinitions, text: string, context?: TokenContext): ITokenizedResult {
        const root = new BodyToken(1, 1, context)
        const tokenizer = new Tokenizer(elements, text)
        root.parse(tokenizer, true)
        Logger.log('StoryScript.tokenize', root)
        return {
            root: root,
            markers: tokenizer.markers
        }
    }

    private static createMonarchTokensProvider(monaco: MonacoType, elements: ElementDefinitions): MonarchLanguage {
        return {
            keywords: keysOf(elements).map(k => `\\${k}`),
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
                    [/%%.*/, 'comment'],
                    [/\$\{/, {
                        token: 'equation',
                        switchTo: 'equation'
                    }],
                    [/\\\w+/, {
                        cases: {
                            '@keywords': 'keyword',
                            '@default': 'variable'
                        }
                    }],
                    [/\$\w+~?/, 'variable'],
                    [/[{}[\]]/, '@brackets'],
                    [/~/, 'keyword']
                ],
                arguments: [
                    [/\$\w+/, 'variable'],
                    [/\$\{/, {
                        token: 'equation',
                        switchTo: 'argEquation'
                    }],
                    [/((?:^|[[,])\s*)(https?:\/\/[^\],]+)/i, ['@default', 'url']],
                    [/((?:^|[[,])\s*)(\w+)(:)/, ['@default', 'key', '@default']],
                    [/((?:^|[[,])\s*)([^,:\]\s]+\s*)/, ['@default', 'value']],
                    [/\]/, {
                        token: '@brackets',
                        switchTo: 'root'
                    }]
                ],
                equation: [
                    [/\$\w+/, 'variable'],
                    [/[0-9+\-*/\s]+/, 'equation'],
                    [/\}/, {
                        token: 'equation',
                        switchTo: 'root'
                    }]
                ],
                argEquation: [
                    [/\$\w+/, 'variable'],
                    [/[0-9+\-*/\s]+/, 'equation'],
                    [/\}/, {
                        token: 'equation',
                        switchTo: 'arguments'
                    }]
                ]
            }
        }
    }

    private static createCompletionItemProvider(monaco: MonacoType): CompletionItemProvider {
        return {
            provideCompletionItems(model, position, _context, _token) {
                const tokenHolder = (model as MonacoModelWithToken).tokenHolder
                const target = tokenHolder.token?.findTokenAt(position)?.[0] ?? null
                const suggestions = target?.getCompletion(monaco) ?? []
                return {
                    suggestions: suggestions,
                    incomplete: false
                }
            }
        }
    }

    private static createHoverProvider(_monaco: MonacoType): HoverProvider {
        return {
            provideHover: async function (model, position, _token) {
                const tokenHolder = (model as MonacoModelWithToken).tokenHolder
                if (isDefined(tokenHolder.token)) {
                    const match = tokenHolder.token?.findTokenAt(position)
                    console.log('createHoverProvider.getHoverText', match)
                    if (match === undefined || match.length < 1) {
                        return undefined
                    }

                    const target = match[0]
                    const hover = await target.getHoverText(model)
                    return { contents: hover }
                }

                return undefined
            }
        }
    }
}

export default StoryScript
