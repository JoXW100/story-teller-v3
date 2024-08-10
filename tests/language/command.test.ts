import { ElementDefinitionDictionary } from 'structure/elements/dictionary'
import CommandToken from 'structure/language/tokens/command'
import Tokenizer from 'structure/language/tokenizer'
import type AlignElement from 'structure/elements/align'
import { expectInstanceOf, expectNotToBeNull } from 'utils/tests'
import TextToken from 'structure/language/tokens/text'

describe('Command Token Tests', () => {
    test('Test simple incorrect parse', () => {
        const text = 'This is a non-tokenizable string'
        const token = new CommandToken(ElementDefinitionDictionary)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(1)
        expect(token.keyword).toBeNull()
        expect(token.params).toBeNull()
        expect(token.body).toBeNull()
    })

    test('Test simple correct parse', () => {
        const keyword: keyof typeof ElementDefinitionDictionary = 'align'
        const text = `${keyword} Other text`
        const token = new CommandToken(ElementDefinitionDictionary)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.keyword).toEqual(keyword)
        expect(token.params).toBeNull()
        expect(token.body).toBeNull()
    })

    test('Test simple correct parse with parameters', () => {
        const keyword: keyof typeof ElementDefinitionDictionary = 'align'
        const key: keyof AlignElement['params'] = 'weight'
        const value = '10'
        const text = `${keyword} [${key}: ${value}] Other text`
        const token = new CommandToken(ElementDefinitionDictionary)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.keyword).toEqual(keyword)
        expect(token.body).toBeNull()
        if (expectNotToBeNull(token.params)) {
            expect(token.params.value).toEqual({ [key]: value })
        }
    })

    test('Test simple correct parse with body', () => {
        const keyword: keyof typeof ElementDefinitionDictionary = 'align'
        const innerText = 'hello'
        const text = `${keyword} { ${innerText} }`
        const token = new CommandToken(ElementDefinitionDictionary)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.keyword).toEqual(keyword)
        expect(token.params).toBeNull()
        if (expectNotToBeNull(token.body)) {
            expect(token.body.children).toHaveLength(1)
            if (expectInstanceOf(token.body.children[0], TextToken)) {
                expect(token.body.children[0].value.trim()).toEqual(innerText)
            }
        }
    })

    test('Test simple correct parse with parameters and body', () => {
        const keyword: keyof typeof ElementDefinitionDictionary = 'align'
        const innerText = 'hello'
        const key: keyof AlignElement['params'] = 'weight'
        const value = '10'
        const text = `${keyword} [${key}: ${value}] { ${innerText} }`
        const token = new CommandToken(ElementDefinitionDictionary)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.keyword).toEqual(keyword)
        if (expectNotToBeNull(token.params)) {
            expect(token.params.value).toEqual({ [key]: value })
        }
        if (expectNotToBeNull(token.body)) {
            expect(token.body.children).toHaveLength(1)
            if (expectInstanceOf(token.body.children[0], TextToken)) {
                expect(token.body.children[0].value.trim()).toEqual(innerText)
            }
        }
    })

    test('Test simple correct parse with invalid command', () => {
        const keyword: string = '_invalid'
        const text = `${keyword} Other text`
        const token = new CommandToken(ElementDefinitionDictionary)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(1)
        expect(token.keyword).toBeNull()
        expect(token.params).toBeNull()
        expect(token.body).toBeNull()
    })
})
