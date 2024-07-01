import { expectNotToBeNull } from 'utils/tests'
import Condition, { type ICondition } from 'structure/condition/condition'
import condition1 from './data/condition1.json'
import condition2 from './data/condition2.json'
import conditionInvalid1 from './data/conditionInvalid1.json'
import conditionInvalid2 from './data/conditionInvalid2.json'
import conditionInvalid3 from './data/conditionInvalid3.json'
import conditionAndFalse from './data/conditionAndFalse.json'
import conditionAndTrue from './data/conditionAndTrue.json'
import conditionAndInvalid from './data/conditionAndInvalid.json'
import conditionNandFalse from './data/conditionNandFalse.json'
import conditionNandTrue from './data/conditionNandTrue.json'
import conditionNorFalse from './data/conditionNorFalse.json'
import conditionNorTrue from './data/conditionNorTrue.json'
import conditionNotFalse from './data/conditionNotFalse.json'
import conditionNotTrue from './data/conditionNotTrue.json'
import conditionOrFalse from './data/conditionOrFalse.json'
import conditionOrTrue from './data/conditionOrTrue.json'

const tests: Array<{ name: string, source: ICondition, cmp: boolean }> = [
    { name: 'conditionAndInvalid', source: conditionAndInvalid, cmp: false },
    { name: 'conditionAndFalse', source: conditionAndFalse, cmp: false },
    { name: 'conditionAndTrue', source: conditionAndTrue, cmp: true },
    { name: 'conditionNandFalse', source: conditionNandFalse, cmp: false },
    { name: 'conditionNandTrue', source: conditionNandTrue, cmp: true },
    { name: 'conditionNandFalse', source: conditionNandFalse, cmp: false },
    { name: 'conditionNorFalse', source: conditionNorFalse, cmp: false },
    { name: 'conditionNorTrue', source: conditionNorTrue, cmp: true },
    { name: 'conditionNotFalse', source: conditionNotFalse, cmp: false },
    { name: 'conditionNotTrue', source: conditionNotTrue, cmp: true },
    { name: 'conditionOrFalse', source: conditionOrFalse, cmp: false },
    { name: 'conditionOrTrue', source: conditionOrTrue, cmp: true }
]

describe('Condition validation', () => {
    test('Test validation of json condition', () => {
        const result1 = Condition.validate(condition1)
        const result2 = Condition.validate(null)
        expect(result1).toBe(true)
        expect(result2).toBe(false)
    })

    test('Test copying faulty json', () => {
        const value1 = Condition.copy({ })
        const value2 = Condition.copy({ eq: [undefined, null] })
        const value3 = Condition.copy(conditionInvalid1)
        const value4 = Condition.copy(conditionInvalid2)
        const value5 = Condition.copy(conditionInvalid3)
        expect(value1).toBeNull()
        expect(value2).toBeNull()
        expect(value3).toBeNull()
        expect(value4).toBeNull()
        expect(value5).toBeNull()
    })

    test('Test validation of created condition', () => {
        const value = Condition.copy(condition1)
        if (expectNotToBeNull(value)) {
            const result = Condition.validate(value)
            expect(result).toBe(true)
        }
    })
})

describe('Condition evaluation', () => {
    test('Test condition evaluation', () => {
        const value = Condition.copy(condition1)
        const data1 = { x: { z: true }, y: 'w' }
        const data2 = { x: { z: false }, y: 'w' }
        const data3 = { x: { z: false }, y: 't' }
        const data4 = { x: { z: true }, y: 't' }
        const data5 = { x: { z: null }, y: null }
        const data6 = { }
        if (expectNotToBeNull(value)) {
            const result1 = value.evaluate(data1)
            const result2 = value.evaluate(data2)
            const result3 = value.evaluate(data3)
            const result4 = value.evaluate(data4)
            const result5 = value.evaluate(data5)
            const result6 = value.evaluate(data6)
            expect(result1).toBe(true)
            expect(result2).toBe(false)
            expect(result3).toBe(false)
            expect(result4).toBe(false)
            expect(result5).toBe(false)
            expect(result6).toBe(false)
        }
    })

    test('Test condition evaluation with null', () => {
        const value = Condition.copy(condition2)
        const data1 = { x: null }
        const data2 = { x: true }
        if (expectNotToBeNull(value)) {
            const result1 = value.evaluate(data1)
            const result2 = value.evaluate(data2)
            expect(result1).toBe(true)
            expect(result2).toBe(false)
        }
    })

    for (const testData of tests) {
        test(`Test evaluating ${testData.name}`, () => {
            const condition = Condition.copy(testData.source)
            if (expectNotToBeNull(condition)) {
                const result = condition.evaluate({})
                expect(result).toBe(testData.cmp)
            }
        })
    }
})

describe('Condition parsing', () => {
    test('Test condition json conversion', () => {
        const value = Condition.copy(condition1)
        if (expectNotToBeNull(value)) {
            const json = value.stringify()
            const result = Condition.parseJSON(json)
            expect(result).not.toBeNull()
        }
    })
})
