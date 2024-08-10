import { ElementDefinitionDictionary } from 'structure/elements/dictionary'
import EquationToken from 'structure/language/tokens/equation'
import Tokenizer from 'structure/language/tokenizer'

describe('Variable Token Tests', () => {
    test('Test simple incorrect parse', () => {
        const text = 'Hello there'
        const token = new EquationToken()
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(1)
        expect(token.equation).toBeNull()
        expect(token.value).toEqual(NaN)
    })

    test('Test simple correct parse', () => {
        const text = '10 + 3 - 1' // initial % should not be included
        const token = new EquationToken()
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.equation).not.toBeNull()
        expect(token.value).toEqual(12)
    })

    test('Test correct parse with parenthesis', () => {
        const text = '10 + (3 * -1) / 3' // initial % should not be included
        const token = new EquationToken()
        const tokenizer = new Tokenizer(ElementDefinitionDictionary, text)
        token.parse(tokenizer)

        expect(tokenizer.markers).toHaveLength(0)
        expect(token.equation).not.toBeNull()
        expect(token.value).toEqual(9)
    })
})
