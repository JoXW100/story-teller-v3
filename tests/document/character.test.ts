import { expectNotToBeNull } from 'utils/tests'
import DocumentFactory from 'structure/database/files/factory'
import CharacterDocument from 'structure/database/files/character'
import chaDocument1 from '../data/characterDocument1.json'
import chaDocumentInvalid from '../data/characterDocumentInvalid.json'

describe('Character document validation', () => {
    test('Test document create creature with faulty json', () => {
        const value = DocumentFactory.create(chaDocumentInvalid)
        expect(value).toBeNull()
    })

    test('Test validation of created character document', () => {
        const value = DocumentFactory.create(chaDocument1)
        if (expectNotToBeNull(value)) {
            expect(DocumentFactory.validate(value)).toBe(true)
        }
    })

    test('Test character document validation', () => {
        const value = DocumentFactory.create(chaDocument1)

        if (expectNotToBeNull(value)) {
            expect(value).toBeInstanceOf(CharacterDocument)
            expect(DocumentFactory.cha.validate(value)).toBe(true)
            expect(DocumentFactory.cha.is(value)).toBe(true)
            expect(DocumentFactory.abi.is(value)).toBe(false)
        }
    })
})

describe('Character document parsing', () => {
    test('Test character document json conversion', () => {
        const value = DocumentFactory.create(chaDocument1)
        if (expectNotToBeNull(value)) {
            const json = value.stringify()
            const result = DocumentFactory.parseJSON(json)
            expect(result).not.toBeNull()
        }
    })
})
