import type { OptionalAttribute } from 'structure/dnd'

export interface IProperties {
    readonly level: number
    readonly classLevel: number
    readonly casterLevel: number
    readonly spellLevel: number
    readonly str: number
    readonly dex: number
    readonly con: number
    readonly int: number
    readonly wis: number
    readonly cha: number
    readonly spellAttribute: OptionalAttribute
    readonly proficiency: number
    readonly critRange: number
    readonly critDieCount: number
    readonly multiAttack: number
    readonly armorLevel: number // 0 = None, 1 = Light, 2 = Medium, 3 = Heavy
    readonly shieldLevel: number
    readonly walkSpeed: number
    readonly burrowSpeed: number
    readonly climbSpeed: number
    readonly flySpeed: number
    readonly hoverSpeed: number
    readonly swimSpeed: number
    readonly attunedItems: number
}

export interface IBonusGroup {
    readonly bonus: number
    readonly meleeBonus: number
    readonly rangedBonus: number
    readonly thrownBonus: number
}
