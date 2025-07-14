import { AdvantageBinding, ConditionBinding, DamageBinding } from "structure/dnd"
import { createAdvantageBindingSourceDescription, createConditionBindingSourceDescription, createDamageBindingSourceDescription } from "utils/sourceDescriptionHelpers"

describe('Binding Description Tests', () => {
    const note = "-Included-"

    test('Test createAdvantageBindingSourceDescription', () => {
        for (const value of Object.values(AdvantageBinding)) {
            const description = createAdvantageBindingSourceDescription(value, note)
            expect(description.includes(note)).toEqual(true)
        }
    })

    test('Test createDamageBindingSourceDescription', () => {
        for (const value of Object.values(DamageBinding)) {
            const description = createDamageBindingSourceDescription(value, note)
            expect(description.includes(note)).toEqual(true)
        }
    })

    test('Test createConditionBindingSourceDescription', () => {
        for (const value of Object.values(ConditionBinding)) {
            const description = createConditionBindingSourceDescription(value, note)
            expect(description.includes(note)).toEqual(true)
        }
    })
})
