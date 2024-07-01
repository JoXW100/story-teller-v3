import { DiceBase, type IDiceRoll } from '.'

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

    public override rollOnce(group: string = '0'): IDiceRoll {
        const result: IDiceRoll = {
            dice: this,
            sum: 0,
            modifier: 0,
            rolls: []
        }
        for (let i = 0; i < this.collection.length; i++) {
            const res = this.collection[i].value.rollOnce(`${group}.${i}`)
            result.sum += res.sum
            result.rolls.push(...res.rolls)
        }
        return result
    }

    public override rollOnceValue(): number {
        let sum = 0
        for (let i = 0; i < this.collection.length; i++) {
            switch (this.collection[i].operator) {
                case DiceOperator.Add:
                    sum += this.collection[i].value.rollOnceValue()
                    break
                case DiceOperator.Subtract:
                    sum -= this.collection[i].value.rollOnceValue()
                    break
                default:
                    break
            }
        }
        return Math.max(sum, 0)
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
