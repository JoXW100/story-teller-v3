import { expectNotToBeNull } from 'utils/tests'
import DocumentFactory from 'structure/database/files/factory'
import ClassDocument from 'structure/database/files/class'
import claDocument1 from '../data/classDocument1.json'
import claDocument2 from '../data/classDocument2.json'
import claDocumentInvalid from '../data/classDocumentInvalid.json'
import claDocumentInvalidMod from '../data/classDocumentInvalidModifier.json'

describe('Class document validation', () => {
    test('Test document create creature with faulty json', () => {
        const value = DocumentFactory.create(claDocumentInvalid)
        expect(value).toBeNull()
    })

    test('Test validation of created class document', () => {
        const value = DocumentFactory.create(claDocument1)
        if (expectNotToBeNull(value)) {
            expect(DocumentFactory.validate(value)).toBe(true)
        }
    })

    test('Test class document validation', () => {
        const value = DocumentFactory.create(claDocument1)

        if (expectNotToBeNull(value)) {
            expect(value).toBeInstanceOf(ClassDocument)
            expect(DocumentFactory.cla.validate(value)).toBe(true)
            expect(DocumentFactory.cla.is(value)).toBe(false)
            expect(DocumentFactory.abi.is(value)).toBe(false)
        }
    })

    test('Test class document validation with modifiers', () => {
        const value = DocumentFactory.create(claDocument2)

        if (expectNotToBeNull(value)) {
            expect(value).toBeInstanceOf(ClassDocument)
            expect(DocumentFactory.cla.validate(value)).toBe(true)
            expect(DocumentFactory.cla.is(value)).toBe(true)
            expect(DocumentFactory.abi.is(value)).toBe(false)
        }
    })

    test('Test class document validation with invalid modifiers', () => {
        const value = DocumentFactory.create(claDocumentInvalidMod)
        expect(value).toBeNull()
    })
})

describe('Class document parsing', () => {
    test('Test character document json conversion', () => {
        const value = DocumentFactory.create(claDocument1)
        if (expectNotToBeNull(value)) {
            const json = value.stringify()
            const result = DocumentFactory.parseJSON(json)
            expect(result).not.toBeNull()
        }
    })
})
