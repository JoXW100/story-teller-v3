import { expectNotToBeNull } from 'utils/tests'
import DocumentFactory from 'structure/database/files/factory'
import AbilityDocument from 'structure/database/files/ability'
import abiDocument1 from '../data/abilityDocument1.json'
import abiDocument2 from '../data/abilityDocument2.json'
import abiDocumentInvalid from '../data/abilityDocumentInvalid.json'
import abiDocumentInvalidMod from '../data/abilityDocumentInvalidModifier.json'

describe('Ability document validation', () => {
    test('Test document create ability with faulty json', () => {
        const value = DocumentFactory.create(abiDocumentInvalid)
        expect(value).toBeNull()
    })

    test('Test validation of created ability document', () => {
        const value = DocumentFactory.create(abiDocument1)
        if (expectNotToBeNull(value)) {
            expect(DocumentFactory.validate(value)).toBe(true)
        }
    })

    test('Test ability document validation', () => {
        if (!DocumentFactory.validate(abiDocument1)) {
            fail()
        }
        const value = DocumentFactory.create(abiDocument1)

        if (expectNotToBeNull(value)) {
            expect(value).toBeInstanceOf(AbilityDocument)
            expect(DocumentFactory.abi.validate(value.data)).toBe(abiDocument1.data)
            expect(DocumentFactory.abi.is(abiDocument1.data)).toBe(true)
            expect(DocumentFactory.cla.is(abiDocument1.data)).toBe(false)
        }
    })

    test('Test ability document validation with modifiers', () => {
        if (!DocumentFactory.validate(abiDocument2)) {
            fail()
        }
        const value = DocumentFactory.create(abiDocument2)

        if (expectNotToBeNull(value)) {
            expect(value).toBeInstanceOf(AbilityDocument)
            expect(DocumentFactory.abi.validate(abiDocument2.data)).toBe(true)
            expect(DocumentFactory.abi.is(abiDocument2.data)).toBe(true)
        }
    })

    test('Test ability document validation with invalid modifiers', () => {
        if (!DocumentFactory.validate(abiDocumentInvalidMod)) {
            fail()
        }
        const value = DocumentFactory.create(abiDocumentInvalidMod)
        expect(value).toBeNull()
    })
})

describe('Ability document parsing', () => {
    test('Test ability document json conversion', () => {
        const value = DocumentFactory.create(abiDocument1)
        if (expectNotToBeNull(value)) {
            const json = value.stringify()
            const result = DocumentFactory.parseJSON(json)
            expect(result).not.toBeNull()
        }
    })
})
