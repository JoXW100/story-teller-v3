import { expectNotToBeNull } from 'utils/tests'
import { DieType, RollMethodType } from 'structure/dice'
import { Die } from 'structure/dice/die'
import DiceFactory from 'structure/dice/factory'

function setupDeterministicRandom(value: number = 1e-5): void {
    if (value <= 0) {
        value = 1e-8
    } else if (value >= 1) {
        value = 1 - 1e-8
    }

    const replacer = Object.create(global.Math)
    replacer.random = () => value
    global.Math = replacer
}

describe('Dice parsing', () => {
    test('Test valid die parsing', () => {
        const die1 = Die.parse('d4')
        const die2 = Die.parse('d6')
        const die3 = Die.parse('d8')
        const die4 = Die.parse('d10')
        const die5 = Die.parse('d12')
        const die6 = Die.parse('d20')
        const die7 = Die.parse('d100')
        const die8 = Die.parse('d1')

        expect(die1.type).toBe(DieType.D4)
        expect(die2.type).toBe(DieType.D6)
        expect(die3.type).toBe(DieType.D8)
        expect(die4.type).toBe(DieType.D10)
        expect(die5.type).toBe(DieType.D12)
        expect(die6.type).toBe(DieType.D20)
        expect(die7.type).toBe(DieType.D100)
        expect(die8.type).toBe(DieType.DX)
    })

    test('Test invalid die parsing', () => {
        const die1 = Die.parse('x')
        const die2 = Die.parse('1d6')

        expect(die1.size).toBe(0)
        expect(die2.size).toBe(0)
        expect(die1.type).toBe(DieType.None)
        expect(die2.type).toBe(DieType.None)
    })

    test('Test dX parsing', () => {
        const die = Die.parse('d3')

        expect(die.size).toBe(3)
        expect(die.type).toBe(DieType.DX)
    })
})

describe('Dice rolling', () => {
    test('Test die rollOnceValue', () => {
        const die1 = Die.parse(DieType.D20)
        const value = die1.rollOnceValue()
        expect(value).toBeGreaterThanOrEqual(1)
        expect(value).toBeLessThanOrEqual(20)
    })

    test('Test die rollOnce', () => {
        const die1 = Die.parse(DieType.D20)
        const value = die1.rollOnce()

        expect(value.rolls.length).toBe(1)
        expect(value.rolls[0].type).toBe(DieType.D20)
        expect(value.rolls[0].value).toBeGreaterThanOrEqual(1)
        expect(value.rolls[0].value).toBeLessThanOrEqual(20)
    })

    test('Test die roll', () => {
        const die1 = Die.parse(DieType.D20)
        const value = die1.roll()

        expect(value.method).toBe(RollMethodType.Normal)
        expect(value.selected).toBe(0)
        expect(value.rolls.length).toBe(1)
        expect(value.rolls[0].rolls.length).toBe(1)
        expect(value.rolls[0].rolls[0].type).toBe(DieType.D20)

        const sum = value.rolls[value.selected].rolls.reduce((prev, cur) => prev + cur.value, 0)
        expect(value.rolls[value.selected].sum).toBe(sum)
    })
})

describe('Dice parsing', () => {
    test('Test Factory parsing string one match', () => {
        const input = '2d4'
        const dice = DiceFactory.parse(input)
        if (expectNotToBeNull(dice)) {
            const result = dice.rollOnce()
            expect(result.rolls.length).toBe(2)
            for (const res of result.rolls) {
                expect(res.type).toBe(DieType.D4)
                expect(res.value).toBeGreaterThanOrEqual(1)
                expect(res.value).toBeLessThanOrEqual(4)
            }
        }
    })

    test('Test Factory parsing string one match without quantity', () => {
        const input = 'd4'
        const dice = DiceFactory.parse(input)
        if (expectNotToBeNull(dice)) {
            const result = dice.rollOnce()
            expect(result.rolls.length).toBe(1)
            expect(result.rolls[0].type).toBe(DieType.D4)
            expect(result.rolls[0].value).toBeGreaterThanOrEqual(1)
            expect(result.rolls[0].value).toBeLessThanOrEqual(4)
        }
    })

    test('Test Factory parsing string one match multiple', () => {
        const input = '1d8 + 1d6 + 4d6'
        const dice = DiceFactory.parse(input)
        if (expectNotToBeNull(dice)) {
            const result = dice.rollOnce()
            expect(result.rolls.length).toBe(6)
            expect(result.rolls[0].type).toBe(DieType.D8)
            expect(result.rolls[0].value).toBeGreaterThanOrEqual(1)
            expect(result.rolls[0].value).toBeLessThanOrEqual(8)
            for (let i = 1; i < result.rolls.length; i++) {
                const res = result.rolls[i]
                expect(res.type).toBe(DieType.D6)
                expect(res.value).toBeGreaterThanOrEqual(1)
                expect(res.value).toBeLessThanOrEqual(6)
            }
        }
    })

    test('Test Factory parsing string one match multiple with subtraction', () => {
        const input = '1d4 + 1d6 + 1d8  - 2d10'
        const dice = DiceFactory.parse(input)
        if (expectNotToBeNull(dice)) {
            const result = dice.rollOnce()
            expect(result.rolls.length).toBe(5)
            expect(result.rolls[0].type).toBe(DieType.D4)
            expect(result.rolls[1].type).toBe(DieType.D6)
            expect(result.rolls[2].type).toBe(DieType.D8)
            expect(result.rolls[3].type).toBe(DieType.D10)
            expect(result.rolls[4].type).toBe(DieType.D10)
        }
    })
})

describe('Dice evaluation', () => {
    test('Test collection value', () => {
        const input = '1d4 + 1d6 + 1d8 - 1d10'
        const dice = DiceFactory.parse(input)
        if (expectNotToBeNull(dice)) {
            setupDeterministicRandom(1)
            const result1 = dice.rollOnceValue()
            setupDeterministicRandom(0)
            const result2 = dice.rollOnceValue()
            expect(result1).toBe(4 + 6 + 8 - 10)
            expect(result2).toBe(1 + 1 + 1 - 1)
        }
    })
})
