import type Random from 'structure/random'
import { DiceBase, IDiceRollResult, RollMethodType } from ".";


function numRollsForRollMethod(method: RollMethodType): number {
    switch (method) {
        case RollMethodType.BestOfTwo:
        case RollMethodType.WorstOfTwo:
            return 2
        case RollMethodType.BestOfThree:
        case RollMethodType.WorstOfThree:
            return 3
        default:
            return 1
    }
}

function getRollCountForMethod(method: RollMethodType): number {
    switch (method) {
        case RollMethodType.SumOfTwo:
            return 2
        case RollMethodType.SumOfThree:
            return 3
        default:
            return 1
    }
}

export function createDiceRollResult(dice: DiceBase, method: RollMethodType = RollMethodType.Normal, generator?: Random): IDiceRollResult {
    const numRolls = numRollsForRollMethod(method)
    const count = getRollCountForMethod(method)
    
    const rolls = Array.from({ length: numRolls }).map(() => (
        dice.roll(generator, count, '0')
    ))

    let sum: number = 0
    let selected: number = 0
    for (let i = 0; i < numRolls; i++) {
        const roll = rolls[i]
        switch (method) {
            case RollMethodType.BestOfTwo:
            case RollMethodType.BestOfThree:
                if (roll.sum > sum) {
                    sum = roll.sum
                    selected = i
                }
                break
            case RollMethodType.WorstOfTwo:
            case RollMethodType.WorstOfThree:
                if (roll.sum < sum) {
                    sum = roll.sum
                    selected = i
                }
                break
            case RollMethodType.SumOfTwo:
            case RollMethodType.SumOfThree:
                sum += roll.sum
                break
            case RollMethodType.Normal:
            default:
                sum = roll.sum
                selected = i
                break
        }
    }
    return {
        dice: dice,
        selected: selected,
        method: method,
        rolls: rolls
    }
}