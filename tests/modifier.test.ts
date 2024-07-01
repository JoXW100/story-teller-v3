import { expectNotToBeNull } from 'utils/tests'
import DocumentFactory from 'structure/database/files/factory'
import ModifierAddDataBase, { AddAbilityModifier } from 'structure/database/files/modifier/add'
import __ModifierData from 'structure/database/files/modifier/data'
import ModifierDataFactory from 'structure/database/files/modifier/factory'
import creature1 from './data/creatureDocument1.json'
import modifier1 from './data/modifier1.json'
import modifier2 from './data/modifier2.json'
import modifier3 from './data/modifier3.json'
import modifierChoice from './data/modifierChoice.json'
import modifierCondition from './data/modifierCondition.json'
import type { ObjectId } from 'types'
import ModifierAbilityDataBase from 'structure/database/files/modifier/ability'
import ModifierBonusDataBase from 'structure/database/files/modifier/bonus'

const id1: ObjectId = '000000000000000000000000' as any
const id2: ObjectId = '000000000000000000000001' as any

describe('Modifier validation', () => {
    test('Test modifier create with faulty json', () => {
        const value = ModifierDataFactory.create({ })
        expect(value).toBeNull()
    })

    test('Test validation of created add modifier', () => {
        const value = ModifierDataFactory.create(modifier1)
        if (expectNotToBeNull(value)) {
            expect(ModifierDataFactory.validate(value)).toBe(true)
            expect(value instanceof ModifierAddDataBase).toBe(true)
        }
    })

    test('Test validation of created ability modifier', () => {
        const value = ModifierDataFactory.create(modifier2)
        if (expectNotToBeNull(value)) {
            expect(ModifierDataFactory.validate(value)).toBe(true)
            expect(value instanceof ModifierAbilityDataBase).toBe(true)
        }
    })

    test('Test validation of created bonus modifier', () => {
        const value = ModifierDataFactory.create(modifier3)
        if (expectNotToBeNull(value)) {
            expect(ModifierDataFactory.validate(value)).toBe(true)
            expect(value instanceof ModifierBonusDataBase).toBe(true)
        }
    })

    test('Test add modifier validation', () => {
        const value = ModifierDataFactory.create(modifier1)
        if (expectNotToBeNull(value)) {
            expect(value instanceof ModifierAddDataBase).toBe(true)
            expect(ModifierAddDataBase.validate(value)).toBe(true)
        }
    })

    test('Test add ability modifier validation', () => {
        const value = ModifierDataFactory.create(modifier1)
        if (expectNotToBeNull(value) && value instanceof ModifierAddDataBase) {
            expect(value instanceof AddAbilityModifier).toBe(true)
            expect(AddAbilityModifier.validate(value)).toBe(true)
        }
    })
})

describe('Modifier apply', () => {
    test('Test add ability modifier', () => {
        const caller = DocumentFactory.create(creature1)
        const value = ModifierDataFactory.create(modifier1)
        if (expectNotToBeNull(value) && expectNotToBeNull(caller) &&
            value instanceof ModifierAddDataBase && value instanceof AddAbilityModifier) {
            const data: __ModifierData = new __ModifierData()
            value.apply(data)

            const result1 = data.abilities.call([id1], caller, { })
            const result2 = data.abilities.call([id2], caller, { })
            expect(result1).toStrictEqual([id1, id2])
            expect(result2).toStrictEqual([id2])
        }
    })

    test('Test add ability modifier with choice', () => {
        const caller = DocumentFactory.create(creature1)
        const value = ModifierDataFactory.create(modifierChoice)
        if (expectNotToBeNull(value) && expectNotToBeNull(caller) &&
            value.isAddModifier() && value.isAddAbilityModifier()) {
            const data: __ModifierData = new __ModifierData()
            data.subscribe(value)

            const result1 = data.abilities.call([id1], caller, { })
            const result2 = data.abilities.call([id2], caller, { })
            const result3 = data.abilities.call([id1], caller, { [value.key]: [0] })
            const result4 = data.abilities.call([id2], caller, { [value.key]: [0] })
            expect(result1).toStrictEqual([id1])
            expect(result2).toStrictEqual([id2])
            expect(result3).toStrictEqual([id1])
            expect(result4).toStrictEqual([id2, id1])
        }
    })

    test('Test add ability modifier with condition', () => {
        const caller = DocumentFactory.create(creature1)
        const value = ModifierDataFactory.create(modifierCondition)
        if (expectNotToBeNull(value) && expectNotToBeNull(caller) &&
            value.isAddModifier() && value.isAddAbilityModifier()) {
            const data: __ModifierData = new __ModifierData()
            data.subscribe(value)

            const result1 = data.abilities.call([id2 as any], caller, { })
            const result2 = data.abilities.call([id1 as any], caller, { })
            expect(result1).toStrictEqual([id2])
            expect(result2).toStrictEqual([id1])
        }
    })
})

describe('Modifier parsing', () => {
    test('Test modifier json conversion', () => {
        const value = ModifierDataFactory.create(modifier1)
        if (expectNotToBeNull(value)) {
            const json = value.stringify()
            const result = ModifierDataFactory.parseJSON(json)
            expect(result).not.toBeNull()
        }
    })
})
