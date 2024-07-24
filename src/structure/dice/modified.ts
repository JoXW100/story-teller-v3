import { DiceBase, type IDiceRoll } from '.'
import type Random from 'structure/random'

export class ModifiedDice extends DiceBase {
    protected readonly dice: DiceBase
    public readonly modifier: number

    public static stringify(modifier: number): string {
        return modifier < 0
            ? `-${-modifier}`
            : `+${modifier}`
    }

    constructor(dice: DiceBase, modifier: number = 0) {
        super()
        this.dice = dice
        this.modifier = modifier
    }

    public override rollOnce(generator?: Random, group: string = '0'): IDiceRoll {
        const result = this.dice.rollOnce(generator, group)
        result.sum += this.modifier
        result.modifier = this.modifier
        return result
    }

    public override rollOnceValue(generator?: Random): number {
        return this.dice.rollOnceValue(generator) + this.modifier
    }

    public override stringify(): string {
        const diceText = this.dice.stringify()
        const modText = ModifiedDice.stringify(this.modifier)
        return diceText.length > 0
            ? diceText + modText
            : modText
    }
}
