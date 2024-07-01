import { ElementDefinitionDictionary } from 'structure/elements/dictionary'
import TableElement from 'structure/elements/table'
import StoryScript from 'structure/language/storyscript'
import BodyToken from 'structure/language/tokens/body'
import CommandToken from 'structure/language/tokens/command'
import ParamsToken from 'structure/language/tokens/params'
import TextToken from 'structure/language/tokens/text'
import VariableToken from 'structure/language/tokens/variable'
import { expectInstanceOf, expectNotToBeNull } from 'utils/tests'

describe('Generic parsing', () => {
    test('Test simple text', () => {
        const text = 'This is a non-tokenizable string'
        const token = StoryScript.tokenize(ElementDefinitionDictionary, text)

        expect(token.root.subTokens).toHaveLength(1)
        const textToken = token.root.subTokens[0]
        if (expectInstanceOf(textToken, TextToken)) {
            expect(textToken.value).toEqual(text)
        }
    })
    test('Test simple command', () => {
        const text = 'This is a non-tokenizable string'
        const commandText = `\\box {${text}}`
        const token = StoryScript.tokenize(ElementDefinitionDictionary, commandText)

        expect(token.root.subTokens).toHaveLength(1)
        const commandToken = token.root.subTokens[0]
        if (expectInstanceOf(commandToken, CommandToken)) {
            expect(commandToken.value).toEqual('box')
            expect(commandToken.params).toBeNull()
            const bodyToken = commandToken.body
            if (expectInstanceOf(bodyToken, BodyToken)) {
                expect(bodyToken.subTokens).toHaveLength(1)
                const textToken = bodyToken.subTokens[0]
                if (expectInstanceOf(textToken, TextToken)) {
                    expect(textToken.value).toEqual(text)
                }
            }
        }
    })
    test('Test roll command params', () => {
        const text = '\\roll[-1, desc: Initiative]'
        const token = StoryScript.tokenize(ElementDefinitionDictionary, text)

        expect(token.root.subTokens).toHaveLength(1)
        const commandToken = token.root.subTokens[0]
        if (expectInstanceOf(commandToken, CommandToken)) {
            expect(commandToken.value).toEqual('roll')
            expect(commandToken.body).toBeNull()
            const paramsToken = commandToken.params
            if (expectInstanceOf(paramsToken, ParamsToken)) {
                const params = paramsToken.getKeyValues()
                expect(params).toEqual({ [ElementDefinitionDictionary.roll.defaultParam]: '-1', desc: 'Initiative' })
                const validated = ElementDefinitionDictionary.roll.getValidatedParams(params)
                expect(validated?.dice).not.toBeNull()
            }
        }
    })
    test('Test set command context and variable', () => {
        const text1 = 'hello'
        const text2 = 'there'
        const key = 'x'
        const commandText = `\\set[${key}] {${text1}} $x~${text2}`
        const token = StoryScript.tokenize(ElementDefinitionDictionary, commandText)

        expect(token.root.subTokens).toHaveLength(3)
        const commandToken = token.root.subTokens[0]
        if (expectInstanceOf(commandToken, CommandToken)) {
            expect(commandToken.value).toEqual('set')
        }
        const variableToken = token.root.subTokens[1]
        if (expectInstanceOf(variableToken, VariableToken)) {
            expect(variableToken.value).toEqual(key)
            expect(variableToken.context).toHaveProperty(variableToken.value)
            const bodyToken = variableToken.context[variableToken.value]
            if (expectInstanceOf(bodyToken, BodyToken)) {
                expect(bodyToken.subTokens).toHaveLength(1)
                const textToken = bodyToken.subTokens[0]
                if (expectInstanceOf(textToken, TextToken)) {
                    expect(textToken.value).toEqual(text1)
                }
            }
        }
        const textToken = token.root.subTokens[2]
        if (expectInstanceOf(textToken, TextToken)) {
            expect(textToken.value).toEqual(' ' + text2)
        }
    })
    test('Test table', () => {
        const header1 = 'Header1'
        const header2 = 'Header2'
        const text1 = 'Hello There'
        const text2 = 'Hello You'
        const text3 = 'Hello Me'
        const commandText = `\\table { 
                \\th {${header1}}
                \\th {${header2}}
                \\tc {${text1}}
                \\tc {${text2}}
                \\tc {${text3}}
            }`
        const token = StoryScript.tokenize(ElementDefinitionDictionary, commandText)

        expect(token.root.subTokens).toHaveLength(1)
        const commandToken = token.root.subTokens[0]
        if (expectInstanceOf(commandToken, CommandToken)) {
            const content = TableElement.getContent(commandToken)
            if (expectNotToBeNull(content)) {
                expect(content.th).toHaveLength(2)
                expect(content.tc).toHaveLength(3)
            }
        }
    })
})
