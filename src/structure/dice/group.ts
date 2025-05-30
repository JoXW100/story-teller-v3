import { type DieType, type IDiceRoll, DiceBase } from '.'
import { Die } from './die'
import { keysOf } from 'utils/index'
import type Random from 'structure/random'

export class DiceGroup extends DiceBase {
    protected readonly collection: Partial<Record<DieType, number>> = {}

    public override readonly modifier: number = 0

    public constructor(...dice: Die[]) {
        super()
        for (const die of dice) {
            this.addDice(die)
        }
    }

    public isEmpty(): boolean {
        return !Object.values(this.collection).some(x => x > 0)
    }

    public addDice(dice: Die, num: number = 1): void {
        this.collection[dice.type] = (this.collection[dice.type] ?? 0) + num
    }

    public addDiceOfType(type: DieType, num: number = 1): void {
        this.collection[type] = (this.collection[type] ?? 0) + num
    }

    public addCollection(collection: DiceGroup): void {
        for (const type of keysOf(collection.collection)) {
            this.addDiceOfType(type, collection.collection[type])
        }
    }

    public override roll(generator?: Random, count: number = 1, group: string = '0'): IDiceRoll {
        const result: IDiceRoll = {
            dice: this,
            sum: 0,
            modifier: 0,
            rolls: []
        }
        const types = keysOf(this.collection)
        for (const type of types) {
            const rollCount: number = (this.collection[type] ?? 0) * count;
            const dice = Die.parse(type)
            for (let i = 0; i < rollCount; i++) {
                const value = dice.roll(generator,).sum
                result.sum += value
                result.rolls.push({ type: type, group: group, value: value })
            }
        }
        return result
    }

    public override stringify(): string {
        return keysOf(this.collection).map(type => `${this.collection[type]}${Die.stringify(type)}`).join(' + ')
    }
}
