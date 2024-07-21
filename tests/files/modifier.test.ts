import { expectTypeToBe } from 'utils/tests'
import ModifierExample1 from '../data/modifierExample1.json'
import ModifierDataFactory from 'structure/database/files/modifier/factory'
import ModifierDataBase from 'structure/database/files/modifier/data'

describe('Test Create Modifier', () => {
    test('create choice modifier with sub-choices', () => {
        const data: unknown = ModifierExample1
        if (expectTypeToBe(data, ModifierDataFactory.validate)) {
            const result = ModifierDataFactory.create(data)
            expect(result).toBeInstanceOf(ModifierDataBase)
        }
    })
})
