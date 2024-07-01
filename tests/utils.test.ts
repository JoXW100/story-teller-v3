import { excludeArray, isEnum, isObjectId, isObjectIdOrNull, uniqueArray } from 'utils'

enum TestEnum {
    Value1 = 'v1',
    Value2 = 'v2'
}

describe('Test Array Utils', () => {
    test('uniqueArray with single duplicate number', () => {
        const data = [1, 1, 2, 3]
        const result = uniqueArray(data)
        expect(result).toStrictEqual([1, 2, 3])
        expect(result).not.toStrictEqual(data)
    })
    test('uniqueArray with multiple duplicate strings', () => {
        const data = ['1', 'hello', 'dis', '2', 'dis', 'some', '1']
        const result = uniqueArray(data)
        expect(result).toStrictEqual(['1', 'hello', 'dis', '2', 'some'])
        expect(result).not.toStrictEqual(data)
    })
    test('excludeArray with single duplicate number', () => {
        const data = [1, 1, 2, 3]
        const result1 = excludeArray(data, [1])
        const result2 = excludeArray(data, [2])
        expect(result1).toStrictEqual([2, 3])
        expect(result2).toStrictEqual([1, 1, 3])
        expect(result1).not.toStrictEqual(data)
        expect(result2).not.toStrictEqual(data)
    })
    test('excludeArray with multiple duplicate strings', () => {
        const data = ['1', 'hello', 'dis', '2', 'dis', 'some', '1']
        const result1 = excludeArray(data, ['1'])
        const result2 = excludeArray(data, ['1', 'dis'])
        const result3 = excludeArray(data, ['hello'])
        expect(result1).toStrictEqual(['hello', 'dis', '2', 'dis', 'some'])
        expect(result2).toStrictEqual(['hello', '2', 'some'])
        expect(result3).toStrictEqual(['1', 'dis', '2', 'dis', 'some', '1'])
        expect(result1).not.toStrictEqual(data)
        expect(result2).not.toStrictEqual(data)
        expect(result3).not.toStrictEqual(data)
    })
})

describe('Test Type Checks', () => {
    test('isEnum with test enum', () => {
        const value = TestEnum.Value1
        const result = isEnum(value, TestEnum)
        expect(result).toBe(true)
    })
    test('isEnum with string', () => {
        const value1 = 'v2'
        const value2 = 'v3'
        const result1 = isEnum(value1, TestEnum)
        const result2 = isEnum(value2, TestEnum)
        expect(result1).toBe(true)
        expect(result2).toBe(false)
    })
    test('isObjectId with values', () => {
        const value1 = '65cb792a11a8489e9a41799e'
        const value2 = 1
        const result1 = isObjectId(value1)
        const result2 = isObjectId(value2)
        const result3 = isObjectId(null)
        expect(result1).toBe(true)
        expect(result2).toBe(false)
        expect(result3).toBe(false)
    })
    test('isObjectIdOrNull with values', () => {
        const value1 = '65cb792a11a8489e9a41799e'
        const value2 = 1
        const result1 = isObjectIdOrNull(value1)
        const result2 = isObjectIdOrNull(value2)
        const result3 = isObjectIdOrNull(null)
        expect(result1).toBe(true)
        expect(result2).toBe(false)
        expect(result3).toBe(true)
    })
})
