import type { Alignment, CreatureType, SizeType } from 'structure/dnd'

export interface INPCData {
    readonly name: string
    readonly description: string
    readonly content: string
    readonly portrait: string
    // Info
    readonly type: CreatureType
    readonly size: SizeType
    readonly alignment: Alignment
    // Appearance
    readonly race: string
    readonly gender: string
    readonly age: string
    readonly height: string
    readonly weight: string
}

export interface INPCStorage {

}
