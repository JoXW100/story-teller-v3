import { Element } from '.'
import type { ElementDefinitions } from './dictionary'
import { isFloatString, isCSSValueString } from 'utils'
import CommandToken from 'structure/language/tokens/command'
import BodyToken from 'structure/language/tokens/body'
import VariableToken from 'structure/language/tokens/variable'

export type TableElementParams = React.PropsWithoutRef<{
    color: string | null
    border: boolean
    weight: string | number | null
    width: string | null
    th?: React.ReactNode[]
    tc?: React.ReactNode[]
}>

class TableElement extends Element<TableElementParams> {
    public static readonly ValidSubElements = new Set<keyof ElementDefinitions>(['tableCell', 'tc', 'tableHeader', 'th'])
    public static readonly ValidHeaderElements = new Set<keyof ElementDefinitions>(['tableHeader', 'th'])
    public readonly name = 'table'
    public readonly defaultParam = 'color'
    public readonly params = {
        'color': {
            default: null,
            validate: () => true,
            parse: (value) => value
        },
        'border': {
            default: false,
            validate: (value) => value === 'true' || value === 'false',
            parse: (value) => value === 'true'
        },
        'weight': {
            default: '1',
            validate: isFloatString,
            parse: (value) => value
        },
        'width': {
            default: null,
            validate: isCSSValueString,
            parse: (value) => value
        }
    } satisfies Element<TableElementParams>['params']

    private static getTokens(token: BodyToken): CommandToken[] | null {
        const tokens: CommandToken[] = []
        for (const subToken of token.children) {
            if (subToken instanceof CommandToken) {
                if (subToken.keyword === null || !TableElement.ValidSubElements.has(subToken.keyword)) {
                    return null
                }
                tokens.push(subToken)
            } else if (subToken instanceof VariableToken) {
                const content = subToken.getContent()
                if (content instanceof BodyToken) {
                    const containedTokens = this.getTokens(content)
                    if (containedTokens === null) {
                        return null
                    }
                    tokens.push(...containedTokens)
                } else if (content !== null) {
                    return null
                }
            } else {
                return null
            }
        }
        return tokens
    }

    public static getContent(token: CommandToken): { th: React.ReactNode[], tc: React.ReactNode[] } | null {
        const subTokens = token.body !== null ? this.getTokens(token.body) : null
        if (subTokens === null) {
            return null
        }

        const content: Exclude<ReturnType<typeof this.getContent>, null> = { th: [], tc: [] }
        for (let i = 0; i < subTokens.length; i++) {
            const subToken = subTokens[i]
            if (subToken.keyword !== null && TableElement.ValidHeaderElements.has(subToken.keyword)) {
                content.th.push(subToken.build(String(i)))
            } else {
                content.tc.push(subToken.build(String(i)))
            }
        }

        return content
    }

    public override parse(token: CommandToken, key?: string): React.ReactNode {
        const texts = token.params?.value ?? {}
        const params = this.getValidatedParams(texts)
        if (params === null) {
            return null
        }

        const content = TableElement.getContent(token)
        if (content === null) {
            return null
        }

        return this.create({ ...params, ...content }, key, token.body?.build())
    }
}

export default TableElement
