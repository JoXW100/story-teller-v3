import { expectNotToBeNull } from 'utils/tests'
import DocumentFactory from 'structure/database/files/factory'
import TextDocument from 'structure/database/files/text'
import txtDocument1 from '../data/textDocument1.json'
import txtDocumentInvalid from '../data/textDocumentInvalid.json'

describe('Text document Validation', () => {
    test('Test document create text with faulty json', () => {
        const value = DocumentFactory.create(txtDocumentInvalid)
        expect(value).toBeNull()
    })

    test('Test validation of created text document', () => {
        const value = DocumentFactory.create(txtDocument1)
        if (expectNotToBeNull(value)) {
            expect(DocumentFactory.validate(value)).toBe(true)
        }
    })

    test('Test text document validation', () => {
        const value = DocumentFactory.create(txtDocument1)

        if (expectNotToBeNull(value)) {
            expect(value).toBeInstanceOf(TextDocument)
            expect(DocumentFactory.txt.validate(value)).toBe(true)
            expect(DocumentFactory.txt.is(value)).toBe(true)
            expect(DocumentFactory.cha.is(value)).toBe(false)
        }
    })
})

describe('Text document parsing', () => {
    test('Test character document json conversion', () => {
        const value = DocumentFactory.create(txtDocument1)
        if (expectNotToBeNull(value)) {
            const json = value.stringify()
            const result = DocumentFactory.parseJSON(json)
            expect(result).not.toBeNull()
        }
    })
})
