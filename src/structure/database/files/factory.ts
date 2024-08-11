import DatabaseFile from '.'
import AbilityDocument from './ability'
import CharacterDocument from './character'
import ClassDocument from './class'
import ConditionDocument from './condition'
import CreatureDocument from './creature'
import EncounterDocument from './encounter'
import ItemDocument from './item'
import MapDocument from './map'
import ModifierDocument from './modifier'
import NPCDocument from './npc'
import RaceDocument from './race'
import SubraceDocument from './subrace'
import SpellDocument from './spell'
import TextDocument from './text'
import FolderFile from './folder'
import SubclassDocument from './subclass'
import { type AbilityData } from './ability/factory'
import { type SpellData } from './spell/factory'
import { type ItemData } from './item/factory'
import type TextData from './text/data'
import type RaceData from './race/data'
import type SubraceData from './subrace/data'
import type MapData from './map/data'
import type { ModifierData } from './modifier/factory'
import type NPCData from './npc/data'
import type MapStorage from './map/storage'
import type CharacterData from './character/data'
import type ClassData from './class/data'
import type ConditionData from './condition/data'
import type CreatureData from './creature/data'
import type FolderData from './folder/data'
import type SubclassData from './subclass/data'
import type EncounterData from './encounter/data'
import type CreatureStorage from './creature/storage'
import type CharacterStorage from './character/storage'
import type EncounterStorage from './encounter/storage'
import { isEnum, isRecord } from 'utils'
import { DocumentFileType, type DocumentType, EmptyDatabaseFactory, type FileType, validateObjectProperties } from 'structure/database'
import type { ValueOf } from 'types'
import type { IDatabaseFactory, IDatabaseFile } from 'types/database'
import type { DocumentIDataMap, DocumentIStorageMap } from 'types/database/files/factory'

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

type DocumentIMap<P extends DocumentFileType> = IDatabaseFile<P, DocumentDataMap[P], DocumentStorageMap[P]>
type DocumentDataFactory<P extends DocumentFileType = DocumentFileType> = IDatabaseFactory<DocumentIDataMap[P], DocumentDataMap[P]>
type DocumentStorageFactory<P extends DocumentFileType = DocumentFileType> = IDatabaseFactory<DocumentIStorageMap[P], DocumentStorageMap[P]>

interface IDocumentFactory {
    readonly create: (data: IDatabaseFile) => ValueOf<DocumentTypeMap> | null
    readonly createOfType: <T extends DocumentType>(data: IDatabaseFile, type: T) => DocumentTypeMap[T] | null
    readonly createOfTypes: <T extends readonly DocumentType[]>(data: IDatabaseFile, types: T) => DocumentTypeMap[T[number]] | null
    readonly validate: (data: unknown) => data is Omit<IDatabaseFile, 'id' | 'isOwner'> & { id: unknown, isOwner: unknown }
    readonly dataFactory: (type: DocumentFileType) => DocumentDataFactory
    readonly storageFactory: (type: DocumentFileType) => DocumentStorageFactory
    readonly isOfType: <T extends DocumentType>(data: IDatabaseFile, type: T) => data is DocumentIMap<T>
    readonly isOfTypes: <T extends readonly DocumentType[]>(data: IDatabaseFile, types: T) => data is DocumentIMap<T[number]>
}

const DocumentFactory: IDocumentFactory = {
    create: function (data: IDatabaseFile): ValueOf<DocumentTypeMap> | null {
        switch (data.type) {
            case DocumentFileType.Ability:
                return new AbilityDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Character:
                return new CharacterDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Creature:
                return new CreatureDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Class:
                return new ClassDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Condition:
                return new ConditionDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Subclass:
                return new SubclassDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Encounter:
                return new EncounterDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Race:
                return new RaceDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Subrace:
                return new SubraceDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Item:
                return new ItemDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Spell:
                return new SpellDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Map:
                return new MapDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Modifier:
                return new ModifierDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.NPC:
                return new NPCDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Text:
                return new TextDocument(data as DocumentIMap<typeof data.type>)
            case DocumentFileType.Folder:
                return new FolderFile(data as DocumentIMap<typeof data.type>)
            default:
                return null
        }
    },
    createOfType: function <T extends DocumentType>(data: IDatabaseFile, type: T): DocumentTypeMap[T] | null {
        if (!this.isOfType(data, type)) {
            return null
        }
        return this.create(data) as DocumentTypeMap[T] | null
    },
    createOfTypes: function <T extends readonly DocumentType[]>(data: IDatabaseFile, types: T): DocumentTypeMap[T[number]] | null {
        if (!this.isOfTypes(data, types)) {
            return null
        }
        return this.create(data) as DocumentTypeMap[T[number]] | null
    },
    validate: function (data: unknown): data is Omit<IDatabaseFile, 'id'> & { id: unknown, isOwner: unknown } {
        return isRecord(data) && validateObjectProperties(data, DatabaseFile.properties)
    },
    dataFactory: function (type: DocumentFileType): DocumentDataFactory {
        switch (type) {
            case DocumentFileType.Ability:
                return AbilityDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Character:
                return CharacterDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Creature:
                return CreatureDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Class:
                return ClassDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Condition:
                return ConditionDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Subclass:
                return SubclassDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Encounter:
                return EncounterDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Spell:
                return SpellDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Race:
                return RaceDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Subrace:
                return SubraceDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Map:
                return MapDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Item:
                return ItemDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Modifier:
                return ModifierDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.NPC:
                return NPCDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Text:
                return TextDocument.DataFactory as DocumentDataFactory
            case DocumentFileType.Folder:
                return FolderFile.DataFactory as DocumentDataFactory
            default:
                return EmptyDatabaseFactory
        }
    },
    storageFactory: function (type: DocumentFileType): DocumentStorageFactory {
        switch (type) {
            case DocumentFileType.Ability:
                return AbilityDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.Character:
                return CharacterDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.Creature:
                return CreatureDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.Class:
                return ClassDocument.StorageFactory as DocumentDataFactory
            case DocumentFileType.Condition:
                return ConditionDocument.StorageFactory as DocumentDataFactory
            case DocumentFileType.Subclass:
                return SubclassDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.Encounter:
                return EncounterDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.Spell:
                return SpellDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.Race:
                return RaceDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.Subrace:
                return SubraceDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.Map:
                return MapDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.Item:
                return ItemDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.Modifier:
                return ModifierDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.NPC:
                return NPCDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.Text:
                return TextDocument.StorageFactory as DocumentStorageFactory
            case DocumentFileType.Folder:
                return FolderFile.StorageFactory as DocumentStorageFactory
            default:
                return EmptyDatabaseFactory
        }
    },
    isOfType: function <T extends DocumentFileType>(data: IDatabaseFile, type: T): data is DocumentIMap<T> {
        return data.type === type
    },
    isOfTypes: function <T extends readonly DocumentFileType[]>(data: IDatabaseFile, types: T): data is DocumentIMap<T[number]> {
        return isEnum(data.type, DocumentFileType) && types.includes(data.type)
    }
}

export default DocumentFactory
