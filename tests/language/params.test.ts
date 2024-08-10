import { ElementDefinitionDictionary } from 'structure/elements/dictionary'
import KeyValueToken from 'structure/language/tokens/keyValue'
import ParamsToken from 'structure/language/tokens/params'
import Tokenizer from 'structure/language/tokenizer'
import type AlignElement from 'structure/elements/align'
import { expectInstanceOf } from 'utils/tests'

describe('Params Token Tests', () => {
    test('Test simple incorrect parse', () => {
        const text = 'This is a non-tokenizable string'
        const token = new ParamsToken(ElementDefinitionDictionary.align)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(2) // One error from the KeyValueToken, and one from the ParamsToken
        expect(token.children).toHaveLength(1)
        expect(token.value).toEqual({ [ElementDefinitionDictionary.align.defaultParam]: '' })
    })

    test('Test simple correct parse', () => {
        const key: keyof AlignElement['params'] = 'weight'
        const innerValue = '1'
        const text = `${key}: ${innerValue}]`
        const token = new ParamsToken(ElementDefinitionDictionary.align)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.children).toHaveLength(1)
        if (expectInstanceOf(token.children[0], KeyValueToken)) {
            expect(token.children[0].key).toEqual(key)
            expect(token.children[0].value).toEqual(innerValue)
        }
        expect(token.value).toEqual({ [key]: innerValue })
    })

    test('Test correct parse with default key', () => {
        const innerValue = 'hc'
        const text = `${innerValue}]`
        const token = new ParamsToken(ElementDefinitionDictionary.align)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.children).toHaveLength(1)
        expect(token.value).toEqual({ [ElementDefinitionDictionary.align.defaultParam]: innerValue })
    })

    test('Test multiple parameters', () => {
        const innerDefaultValue = 'hc'
        const innerKey1: keyof AlignElement['params'] = 'weight'
        const innerKey2: keyof AlignElement['params'] = 'width'
        const innerValue1 = '1.5'
        const innerValue2 = '100%'
        const text = `${innerDefaultValue}, ${innerKey1}: ${innerValue1}, ${innerKey2}: ${innerValue2}]`
        const token = new ParamsToken(ElementDefinitionDictionary.align)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.children).toHaveLength(3)
        expect(token.value).toEqual({
            [ElementDefinitionDictionary.align.defaultParam]: innerDefaultValue,
            [innerKey1]: innerValue1,
            [innerKey2]: innerValue2
        })
    })
})
