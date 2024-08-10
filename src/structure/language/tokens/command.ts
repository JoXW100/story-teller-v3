import type Tokenizer from '../tokenizer'
import Token from '.'
import BodyToken from './body'
import ParamsToken from './params'
import { asKeyOf, keysOf } from 'utils'
import type { IElement } from 'structure/elements'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { CompletionItem, MarkdownString, MonacoType, TokenContext } from 'types/language'

class CommandToken extends Token {
    private readonly elements: ElementDefinitions
    private _keyword: keyof ElementDefinitions | null = null

    public constructor(elements: ElementDefinitions, startLineNumber?: number, startColumn?: number, context?: TokenContext) {
        super(startLineNumber, startColumn, context)
        this.elements = elements
    }

    public get keyword(): keyof ElementDefinitions | null {
        return this._keyword
    }

    public get params(): ParamsToken | null {
        return this.children[0] as ParamsToken ?? null
    }

    private set params(value: ParamsToken) {
        this.children[0] = value
    }

    public get body(): BodyToken | null {
        return this.children[1] as BodyToken | undefined ?? null
    }

    private set body(value: BodyToken) {
        this.children[1] = value
    }

    public parse(tokenizer: Tokenizer): void {
        let token = tokenizer.next()
        if (token === null) {
            this.finalize(tokenizer, 'Unexpected end of text, missing command keyword')
            return
        }

        this._keyword = asKeyOf(token.content, tokenizer.elements)
        if (this._keyword === null) {
            tokenizer.addMarker(`Invalid command: '\\${token?.content ?? ''}'`, token)
            this.finalize(tokenizer)
            return
        }

        token = tokenizer.next(true)
        while (token !== null) {
            switch (token.content) {
                case '{': {
                    this.body = new BodyToken(token.startLineNumber, token.startColumn, this.context)
                    this.body.parse(tokenizer)
                    break
                }
                case '[': {
                    this.params = new ParamsToken(tokenizer.elements[this._keyword] as IElement<Record<string, any>>, token.startLineNumber, token.startColumn, this.context)
                    this.params.parse(tokenizer)
                    break
                }
                default:
                    tokenizer.back()
                    this.finalize(tokenizer)
                    return
            }
            token = tokenizer.next(true)
        }
        this.finalize(tokenizer)
    }

    public build(key?: string): React.ReactNode {
        if (this._keyword !== null) {
            return this.elements[this._keyword].parse(this as any, key)
        }
    }

    public override getHoverText(): MarkdownString[] {
        if (this._keyword === null) {
            return []
        }
        return [{
            value: `'${this._keyword}', a command with arguments: ${keysOf(this.elements[this._keyword].params).join(', ')}`
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
