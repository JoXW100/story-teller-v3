import type { OptionalAttribute } from 'structure/dnd'

export interface ICreatureStats {
    level: number
    casterLevel: number
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
    spellAttribute: OptionalAttribute
    proficiency: number
    critRange: number
    multiAttack: number
}
