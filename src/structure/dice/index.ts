import type Random from 'structure/random'

export enum DieType {
    None = 'none',
    D2 = 'd2',
    D3 = 'd3',
    D4 = 'd4',
    D6 = 'd6',
    D8 = 'd8',
    D10 = 'd10',
    D12 = 'd12',
    D20 = 'd20',
    D100 = 'd100',
    DX = 'dx'
}

export enum RollMethodType {
    Normal = 'normal',
    BestOfTwo = 'best2',
    BestOfThree = 'best3',
    WorstOfTwo = 'worst2',
    WorstOfThree = 'worst3',
    SumOfTwo = 'sum2',
    SumOfThree = 'sum3'
}

export enum RollType {
    Generic = 'generic',
    Attack = 'attack',
    Damage = 'damage',
    Save = 'save',
    Check = 'check',
    Attribute = 'attribute',
    Initiative = 'initiative',
    Health = 'health'
}

export const D20RollTypes = new Set<RollType>([RollType.Attack, RollType.Attribute, RollType.Check, RollType.Initiative, RollType.Save])

export interface IDiceTypeValuePair {
    type: DieType
    group: string
    value: number
}

export interface IDiceRollResult {
    dice: DiceBase
    selected: number
    method: RollMethodType
    rolls: IDiceRoll[]
}

export interface IDiceRoll {
    dice: DiceBase
    sum: number
    modifier: number
    rolls: IDiceTypeValuePair[]
}

export interface IRollContext {
    method: RollMethodType
    result: IDiceRollResult
    type: RollType
    critRange?: number
    description?: string
    details?: string | null
    source?: string
}

export abstract class DiceBase {
    public abstract readonly modifier: number

    public abstract roll(generator?: Random, count?: number, group?: string): IDiceRoll
    public abstract stringify(): string
}

export function isFail(result: IDiceRoll): boolean {
    return result.rolls.length === 1 && result.rolls[0].type === DieType.D20 && result.rolls[0].value === 1
}

export function isCritical(result: IDiceRoll, criticalRange: number = 20): boolean {
    return result.rolls.length === 1 && result.rolls[0].type === DieType.D20 && result.rolls[0].value >= criticalRange
}

export function parseDieType(num: number | string, other: DieType = DieType.DX): DieType {
    switch (Number(num)) {
        case 0:
            return DieType.None
        case 2:
            return DieType.D2
        case 3:
            return DieType.D3
        case 4:
            return DieType.D4
        case 6:
            return DieType.D6
        case 8:
            return DieType.D8
        case 10:
            return DieType.D10
        case 12:
            return DieType.D12
        case 20:
            return DieType.D20
        case 100:
            return DieType.D100
        default:
            return other
    }
}

export function numberFromDieType(type: DieType): number {
    switch (type) {
        case DieType.None:
            return 0
        case DieType.D2:
            return 2
        case DieType.D3:
            return 3
        case DieType.D4:
            return 4
        case DieType.D6:
            return 6
        case DieType.D8:
            return 8
        case DieType.D10:
            return 10
        case DieType.D12:
            return 12
        case DieType.D20:
            return 20
        case DieType.D100:
            return 100
        case DieType.DX:
        default:
            return 0
    }
}
