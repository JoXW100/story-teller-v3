import { type DiceBase, typeFromNumber } from '.'
import { DiceGroup } from './group'
import { Die } from './die'
import { DiceCollection, DiceOperator } from './collection'
import { ModifiedDice } from './modified'

const dieMatcher = /^d([0-9]+)$/i
const diceTestMatcher = /(?:([\+\-])? *(?:([0-9]+)?d([0-9]+)|([0-9]+)))+/i
const diceMatcher = /([\+\-])? *(?:([0-9]+)?d([0-9]+)|([0-9]+))/ig

export default abstract class DiceFactory {
    public static test(text: string): boolean {
        return diceTestMatcher.test(text)
    }

    public static parse(text: string): DiceBase | null {
        let group = new DiceGroup()
        let match: RegExpExecArray | null = dieMatcher.exec(text)
        if (match !== null) {
            const type = Number(match[1])
            return new Die(type)
        }

        const collection = new DiceCollection()
        collection.addDice(group, DiceOperator.Add)
        let modifierSum = 0
        let prevOperator: string = '+'
        while ((match = diceMatcher.exec(text)) !== null) {
            const operator = match[1] ?? '+'
            const type = typeFromNumber(Number(match[3]))

            const modifier = Number(match[4])
            if (!isNaN(modifier)) {
                modifierSum += operator === '+' ? modifier : -modifier
                continue
            }

            const quantity = Number(match[2] ?? 1)
            if (isNaN(quantity) || quantity < 1) {
                continue
            }

            if (operator !== prevOperator) {
                prevOperator = operator
                group = new DiceGroup()
                collection.addDice(group, operator === '+'
                    ? DiceOperator.Add
                    : DiceOperator.Subtract
                )
            }

            group.addDiceOfType(type, quantity)
        }

        if (modifierSum !== 0) {
            return new ModifiedDice(group, modifierSum)
        }

        if (collection.length === 1) {
            if (group.isEmpty()) {
                return null
            }

            return group
        }

        return collection
    }
}
