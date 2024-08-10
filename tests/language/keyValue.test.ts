import { expectInstanceOf } from 'utils/tests'
import { ElementDefinitionDictionary } from 'structure/elements/dictionary'
import KeyValueToken from 'structure/language/tokens/keyValue'
import Tokenizer from 'structure/language/tokenizer'
import EmptyToken from 'structure/language/tokens/empty'
import TextToken from 'structure/language/tokens/text'
import VariableToken from 'structure/language/tokens/variable'
import type AlignElement from 'structure/elements/align'
import type SaveElement from 'structure/elements/save'
import type { TokenContext } from 'types/language'

describe('KeyValue Token Tests', () => {
    test('Test simple incorrect parse', () => {
        const text = 'This is a non-tokenizable string'
        const token = new KeyValueToken(ElementDefinitionDictionary.align)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(1)
        expect(token.key).toEqual(ElementDefinitionDictionary.align.defaultParam)
        expect(token.value).toEqual('')
    })

    test('Test simple correct parse', () => {
        const key: keyof AlignElement['params'] = 'weight'
        const innerValue = '1'
        const text = `${key}: ${innerValue}]`
        const token = new KeyValueToken(ElementDefinitionDictionary.align)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.key).toEqual(key)
        expect(token.value).toEqual(innerValue)
    })

    test('Test correct parse with default key', () => {
        const innerValue = 'hc'
        const text = `${innerValue}]`
        const token = new KeyValueToken(ElementDefinitionDictionary.align)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.key).toEqual(ElementDefinitionDictionary.align.defaultParam)
        expect(token.value).toEqual(innerValue)
    })

    test('Test correct parse with variable and text', () => {
        const key: keyof SaveElement['params'] = 'tooltips'
        const variable = 'name'
        const value = 'Atmos'
        const context: TokenContext = {
            [variable]: new EmptyToken(value)
        }
        const innerText1 = 'Hello there'
        const innerText2 = 'is here'
        const text = ` ${key}: ${innerText1} $${variable}~${innerText2},`
        const token = new KeyValueToken(ElementDefinitionDictionary.save, undefined, undefined, context)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.key).toEqual(key)
        expect(token.children).toHaveLength(3)
        if (expectInstanceOf(token.children[0], TextToken)) {
            expect(token.children[0].value.trim()).toEqual(innerText1)
        }
        if (expectInstanceOf(token.children[1], VariableToken)) {
            expect(token.children[1].value.trim()).toEqual(variable)
        }
        if (expectInstanceOf(token.children[2], TextToken)) {
            expect(token.children[2].value.trim()).toEqual(innerText2)
        }
        expect(token.value).toEqual(`${innerText1} ${value} ${innerText2}`)
    })
})
