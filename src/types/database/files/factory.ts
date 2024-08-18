import type { IDatabaseFile, IDatabaseFactory } from '..'
import type { DocumentIStorageMap, DocumentIDataMap } from '.'
import type { DocumentFileType, DocumentType, FileType } from 'structure/database'
import type DatabaseFile from 'structure/database/files'
import type AbilityDocument from 'structure/database/files/ability'
import type { AbilityData } from 'structure/database/files/ability/factory'
import type CharacterDocument from 'structure/database/files/character'
import type CharacterData from 'structure/database/files/character/data'
import type CharacterStorage from 'structure/database/files/character/storage'
import type ClassDocument from 'structure/database/files/class'
import type ClassData from 'structure/database/files/class/data'
import type ConditionDocument from 'structure/database/files/condition'
import type ConditionData from 'structure/database/files/condition/data'
import type CreatureDocument from 'structure/database/files/creature'
import type CreatureData from 'structure/database/files/creature/data'
import type CreatureStorage from 'structure/database/files/creature/storage'
import type EncounterDocument from 'structure/database/files/encounter'
import type EncounterData from 'structure/database/files/encounter/data'
import type EncounterStorage from 'structure/database/files/encounter/storage'
import type FolderFile from 'structure/database/files/folder'
import type FolderData from 'structure/database/files/folder/data'
import type ItemDocument from 'structure/database/files/item'
import type { ItemData } from 'structure/database/files/item/factory'
import type MapDocument from 'structure/database/files/map'
import type MapData from 'structure/database/files/map/data'
import type MapStorage from 'structure/database/files/map/storage'
import type ModifierDocument from 'structure/database/files/modifier'
import type { ModifierData } from 'structure/database/files/modifier/factory'
import type NPCDocument from 'structure/database/files/npc'
import type NPCData from 'structure/database/files/npc/data'
import type RaceDocument from 'structure/database/files/race'
import type RaceData from 'structure/database/files/race/data'
import type SpellDocument from 'structure/database/files/spell'
import type { SpellData } from 'structure/database/files/spell/factory'
import type SubclassDocument from 'structure/database/files/subclass'
import type SubclassData from 'structure/database/files/subclass/data'
import type SubraceDocument from 'structure/database/files/subrace'
import type SubraceData from 'structure/database/files/subrace/data'
import type TextDocument from 'structure/database/files/text'
import type TextData from 'structure/database/files/text/data'
import type { ValueOf } from 'types'

export interface DocumentDataMap extends Record<DocumentFileType, object> {
    [DocumentFileType.Ability]: AbilityData
    [DocumentFileType.Creature]: CreatureData
    [DocumentFileType.Character]: CharacterData
    [DocumentFileType.Class]: ClassData
    [DocumentFileType.Condition]: ConditionData
    [DocumentFileType.Subclass]: SubclassData
    [DocumentFileType.Encounter]: EncounterData
    [DocumentFileType.Item]: ItemData
    [DocumentFileType.Map]: MapData
    [DocumentFileType.Modifier]: ModifierData
    [DocumentFileType.NPC]: NPCData
    [DocumentFileType.Race]: RaceData
    [DocumentFileType.Subrace]: SubraceData
    [DocumentFileType.Spell]: SpellData
    [DocumentFileType.Text]: TextData
    [DocumentFileType.Folder]: FolderData
}

export interface DocumentStorageMap extends Record<DocumentFileType, object> {
    [DocumentFileType.Ability]: DocumentIStorageMap[DocumentType.Ability]
    [DocumentFileType.Creature]: CreatureStorage
    [DocumentFileType.Character]: CharacterStorage
    [DocumentFileType.Class]: DocumentIStorageMap[DocumentType.Class]
    [DocumentFileType.Condition]: DocumentIStorageMap[DocumentType.Condition]
    [DocumentFileType.Subclass]: DocumentIStorageMap[DocumentType.Subclass]
    [DocumentFileType.Encounter]: EncounterStorage
    [DocumentFileType.Item]: DocumentIStorageMap[DocumentType.Item]
    [DocumentFileType.Map]: MapStorage
    [DocumentFileType.Modifier]: DocumentIStorageMap[DocumentType.Modifier]
    [DocumentFileType.NPC]: DocumentIStorageMap[DocumentType.NPC]
    [DocumentFileType.Race]: DocumentIStorageMap[DocumentType.Race]
    [DocumentFileType.Subrace]: DocumentIStorageMap[DocumentType.Subrace]
    [DocumentFileType.Spell]: DocumentIStorageMap[DocumentType.Spell]
    [DocumentFileType.Text]: DocumentIStorageMap[DocumentType.Text]
    [DocumentFileType.Folder]: DocumentIStorageMap[FileType.Folder]
}

type DocumentTypeMapHelper<K extends DocumentFileType> = { [P in K]: DatabaseFile<P> }
export interface DocumentTypeMap extends DocumentTypeMapHelper<DocumentFileType> {
    [DocumentFileType.Ability]: AbilityDocument
    [DocumentFileType.Creature]: CreatureDocument
    [DocumentFileType.Character]: CharacterDocument
    [DocumentFileType.Class]: ClassDocument
    [DocumentFileType.Condition]: ConditionDocument
    [DocumentFileType.Encounter]: EncounterDocument
    [DocumentFileType.Subclass]: SubclassDocument
    [DocumentFileType.Item]: ItemDocument
    [DocumentFileType.Map]: MapDocument
    [DocumentFileType.Modifier]: ModifierDocument
    [DocumentFileType.NPC]: NPCDocument
    [DocumentFileType.Race]: RaceDocument
    [DocumentFileType.Subrace]: SubraceDocument
    [DocumentFileType.Spell]: SpellDocument
    [DocumentFileType.Text]: TextDocument
    [DocumentFileType.Folder]: FolderFile
}

export type Document = ValueOf<DocumentTypeMap>
export type DocumentIMap<P extends DocumentFileType> = IDatabaseFile<P, DocumentDataMap[P], DocumentStorageMap[P]>
export type DocumentDataFactory<P extends DocumentFileType = DocumentFileType> = IDatabaseFactory<DocumentIDataMap[P], DocumentDataMap[P]>
export type DocumentStorageFactory<P extends DocumentFileType = DocumentFileType> = IDatabaseFactory<DocumentIStorageMap[P], DocumentStorageMap[P]>

export interface IDocumentFactory {
    readonly create: (data: IDatabaseFile) => Document | null
    readonly createOfType: <T extends DocumentType>(data: IDatabaseFile, type: T) => DocumentTypeMap[T] | null
    readonly createOfTypes: <T extends readonly DocumentType[]>(data: IDatabaseFile, types: T) => DocumentTypeMap[T[number]] | null
    readonly validate: (data: unknown) => data is Omit<IDatabaseFile, 'id' | 'isOwner'> & { id: unknown, isOwner: unknown }
    readonly dataFactory: (type: DocumentFileType) => DocumentDataFactory
    readonly storageFactory: (type: DocumentFileType) => DocumentStorageFactory
    readonly isOfType: <T extends DocumentType>(data: IDatabaseFile, type: T) => data is DocumentIMap<T>
    readonly isOfTypes: <T extends readonly DocumentType[]>(data: IDatabaseFile, types: T) => data is DocumentIMap<T[number]>
}
