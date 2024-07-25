import { DieType, DiceBase, numberFromDieType, parseDieType, type IDiceRoll } from '.'
import type Random from 'structure/random'

export class Die extends DiceBase {
    public static readonly None: Die = new Die(0)
    public override readonly modifier: number = 0
    public readonly type: DieType
    public readonly size: number

    constructor(size: number | DieType) {
        super()
        if (typeof size === 'number') {
            this.size = size
            this.type = parseDieType(this.size)
        } else {
            this.size = numberFromDieType(size)
            this.type = size
        }
    }

    public override rollOnce(generator?: Random, group: string = '0'): IDiceRoll {
        const value = this.rollOnceValue(generator)
        return {
            dice: this,
            sum: value,
            modifier: 0,
            rolls: [{ type: this.type, group: group, value: value }]
        }
    }

    public override rollOnceValue(generator?: Random): number {
        return Math.ceil((generator?.random() ?? Math.random()) * this.size)
    }

    public override stringify(): string {
        return String(this.type)
    }

    public static parse(value: DieType | string): Die {
        switch (value) {
            case DieType.None:
            case DieType.DX:
                break
            case DieType.D4:
            case DieType.D6:
            case DieType.D8:
            case DieType.D10:
            case DieType.D12:
            case DieType.D20:
            case DieType.D100:
                return new Die(value)
            default: {
                const match = /^d([0-9]+)$/.exec(value)
                if (match !== null) {
                    const number = Number(match[1])
                    return new Die(number)
                }
            } break
        }
        return new Die(0)
    }

    public static stringify(type: DieType): string {
        return type
    }

    public static average (type: DieType): number {
        const t = numberFromDieType(type)
        return t <= 0 ? 0 : (t + 1) / 2.0
    }
}
