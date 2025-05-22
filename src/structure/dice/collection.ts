/* eslint-disable @typescript-eslint/array-type */
import { DiceBase, type IDiceRoll } from '.'
import type Random from 'structure/random'

export enum DiceOperator {
    Add = 'add',
    Subtract = 'subtract'
}

export class DiceCollection extends DiceBase {
    private readonly collection: Array<{ value: DiceBase, operator: DiceOperator }> = []

    public override get modifier(): number {
        return this.collection.reduce((prev, dice) => {
            return prev + dice.operator === DiceOperator.Add
                ? dice.value.modifier
                : -dice.value.modifier
        }, 0)
    }

    public get length(): number {
        return this.collection.length
    }

    public addDice(dice: DiceBase, operator: DiceOperator = DiceOperator.Add): void {
        this.collection.push({ value: dice, operator: operator })
    }

    public override roll(generator?: Random, count: number = 1, group: string = '0'): IDiceRoll {
        const result: IDiceRoll = {
            dice: this,
            sum: 0,
            modifier: 0,
            rolls: []
        }
        
        for (let i = 0; i < this.collection.length; i++) {
            const item = this.collection[i];
            const res = item.value.roll(generator, count, `${group}.${i}`)
            switch (item.operator) {
                case DiceOperator.Add:
                    result.sum += res.sum
                    break
                case DiceOperator.Subtract:
                    result.sum -= res.sum
                    break
                default:
                    break
            }
            result.rolls.push(...res.rolls)
        }
        
        result.sum = Math.max(result.sum, 0)
        return result
    }

    public override stringify(): string {
        let text = ''
        for (let i = 0; i < this.collection.length; i++) {
            const operator = this.collection[i].operator
            if (i > 0 || operator === DiceOperator.Subtract) {
                text += operator === DiceOperator.Add ? '+ ' : '- '
            }
            text += this.collection[i].value.stringify()
        }
        return text
    }
}
