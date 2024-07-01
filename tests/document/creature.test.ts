import { expectNotToBeNull } from 'utils/tests'
import DocumentFactory from 'structure/database/files/factory'
import CreatureDocument from 'structure/database/files/creature'
import creDocument1 from '../data/creatureDocument1.json'
import creDocumentInvalid from '../data/creatureDocumentInvalid.json'

describe('Creature document validation', () => {
    test('Test document create creature with faulty json', () => {
        const value = DocumentFactory.create(creDocumentInvalid)
        expect(value).toBeNull()
    })

    test('Test validation of created creature document', () => {
        const value = DocumentFactory.create(creDocument1)
        if (expectNotToBeNull(value)) {
            expect(DocumentFactory.validate(value)).toBe(true)
        }
    })

    test('Test creature document validation', () => {
        const value = DocumentFactory.create(creDocument1)

        if (expectNotToBeNull(value)) {
            expect(value).toBeInstanceOf(CreatureDocument)
            expect(DocumentFactory.cre.validate(value)).toBe(true)
            expect(DocumentFactory.cre.is(value)).toBe(true)
            expect(DocumentFactory.cla.is(value)).toBe(false)
        }
    })
})

describe('Creature document parsing', () => {
    test('Test character document json conversion', () => {
        const value = DocumentFactory.create(creDocument1)
        if (expectNotToBeNull(value)) {
            const json = value.stringify()
            const result = DocumentFactory.parseJSON(json)
            expect(result).not.toBeNull()
        }
    })
})
