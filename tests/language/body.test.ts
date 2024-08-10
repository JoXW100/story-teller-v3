import { ElementDefinitionDictionary } from 'structure/elements/dictionary'
import BodyToken from 'structure/language/tokens/body'
import Tokenizer from 'structure/language/tokenizer'
import TextToken from 'structure/language/tokens/text'
import CommandToken from 'structure/language/tokens/command'
import { expectInstanceOf } from 'utils/tests'

describe('Body Token Tests', () => {
    test('Test simple incorrect parse', () => {
        const text = 'This is a non-tokenizable string'
        const token = new BodyToken()
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(1)
        expect(token.children).toHaveLength(1)
    })

    test('Test simple correct parse', () => {
        const keyword: keyof typeof ElementDefinitionDictionary = 'align'
        const innerText = 'Initial text'
        const text = `${innerText} \\${keyword}}`
        const token = new BodyToken()
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.children).toHaveLength(2)
        if (expectInstanceOf(token.children[0], TextToken)) {
            expect(token.children[0].value.trim()).toEqual(innerText)
        }
        if (expectInstanceOf(token.children[1], CommandToken)) {
            expect(token.children[1].keyword).toEqual(keyword)
        }
    })
})
