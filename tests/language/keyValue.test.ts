import { ElementDefinitionDictionary } from 'structure/elements/dictionary'
import KeyValueToken from 'structure/language/tokens/keyValue'
import Tokenizer from 'structure/language/tokenizer'
import type AlignElement from 'structure/elements/align'

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
})
