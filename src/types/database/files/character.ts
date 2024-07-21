import type { ICreatureData, ICreatureStorage } from './creature'
import type { ClassLevel, SpellLevel, SpellPreparationType } from 'structure/dnd'
import type { ObjectId } from 'types'

export interface ICharacterData extends ICreatureData {
    // Appearance
    readonly gender: string
    readonly age: string
    readonly height: string
    readonly weight: string
    // Race
    readonly race: ObjectId | null
    readonly raceName: string
    // Class
    readonly classes: Record<ObjectId, ClassLevel>
    // Other
    readonly attunementSlots: number
}

export interface IInventoryItemData {
    equipped: boolean
    quantity: number
}

export interface ICharacterStorage extends ICreatureStorage {
    readonly subclasses: Record<ObjectId, ObjectId>
    // the preparation type for each spell for each class
    readonly spellPreparations: Record<ObjectId, Record<ObjectId, SpellPreparationType>>
    readonly preparationsExpendedSlots: Record<ObjectId, Partial<Record<SpellLevel, number>>>
    readonly inventory: Record<ObjectId, IInventoryItemData>
    readonly inventoryText: string
    readonly attunement: ObjectId[]
}
