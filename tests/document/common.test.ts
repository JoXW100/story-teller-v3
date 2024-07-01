import DocumentFactory from 'structure/database/files/factory'

describe('Document Validation', () => {
    test('Test document create with faulty json', () => {
        const value1 = DocumentFactory.create({ })
        expect(value1).toBeNull()
    })

    test('Test validation of invalid documents', () => {
        expect(DocumentFactory.validate({})).toBe(false)
        expect(DocumentFactory.validate({ name: 'x', type: 'invalid' })).toBe(false)
    })
})
