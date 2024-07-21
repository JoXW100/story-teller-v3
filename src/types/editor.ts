import type { OptionalAttribute } from 'structure/dnd'

export interface ICreatureStats {
    level: number
    classLevel: number
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
    critDieCount: number
    multiAttack: number
    armorLevel: number // 0 = None, 1 = Light, 2 = Medium, 3 = Heavy
    shieldLevel: number
    walkSpeed: number
    burrowSpeed: number
    climbSpeed: number
    flySpeed: number
    hoverSpeed: number
    swimSpeed: number
}

export interface IBonusGroup {
    readonly bonus: number
    readonly areaBonus: number
    readonly singleBonus: number
    readonly meleeBonus: number
    readonly rangedBonus: number
    readonly thrownBonus: number
}
