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
import { isEnum, isRecord } from 'utils'
import { DocumentFileType, type DocumentType, EmptyDatabaseFactory, validateObjectProperties } from 'structure/database'
import type { IDatabaseFile } from 'types/database'
import type { Document, DocumentDataFactory, DocumentIMap, DocumentStorageFactory, DocumentTypeMap, IDocumentFactory } from 'types/database/files/factory'

const DocumentFactory: IDocumentFactory = {
    create: function (data: IDatabaseFile): Document | null {
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
