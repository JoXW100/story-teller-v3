import { ElementDefinitionDictionary } from 'structure/elements/dictionary'
import VariableToken from 'structure/language/tokens/variable'
import Tokenizer from 'structure/language/tokenizer'
import EmptyToken from 'structure/language/tokens/empty'
import type { TokenContext } from 'types/language'

describe('Variable Token Tests', () => {
    test('Test simple incorrect parse', () => {
        const text = '//'
        const token = new VariableToken()
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(1)
        expect(token.value).toEqual('')
    })

    test('Test simple correct parse', () => {
        const key = 'name'
        const context: TokenContext = {
            [key]: new EmptyToken('value')
        }
        const text = `${key} other text` // $ should not be included
        const token = new VariableToken(undefined, undefined, context)
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.value).toEqual(key)
        expect(token.getContent()).toEqual(context[key])
    })

    test('Test simple correct parse without value in context', () => {
        const key = 'name'
        const text = `${key} other text` // $ should not be included
        const token = new VariableToken()
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(1)
        expect(token.value).toEqual('')
        expect(token.getContent()).toBeNull()
    })
})
