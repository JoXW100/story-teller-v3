import DatabaseFile from '.'
import AbilityDocument from './ability'
import CharacterDocument from './character'
import ClassDocument from './class'
import CreatureDocument from './creature'
import EncounterDocument from './encounter'
import EncounterDataFactory, { EncounterStorageFactory } from './encounter/factory'
import ItemDocument from './item'
import MapDocument from './map'
import ModifierDocument from './modifier'
import RaceDocument from './race'
import SubraceDocument from './subrace'
import SpellDocument from './spell'
import TextDocument from './text'
import FolderFile from './folder'
import type MapStorage from './map/storage'
import SubclassDocument from './subclass'
import type SubclassData from './subclass/data'
import SubclassDataFactory from './subclass/factory'
import AbilityDataFactory, { type AbilityData } from './ability/factory'
import CharacterDataFactory, { CharacterStorageFactory } from './character/factory'
import CreatureDataFactory, { CreatureStorageFactory } from './creature/factory'
import ClassDataFactory from './class/factory'
import SpellDataFactory, { type SpellData } from './spell/factory'
import RaceDataFactory from './race/factory'
import ItemDataFactory, { type ItemData } from './item/factory'
import SubraceDataFactory from './subrace/factory'
import MapDataFactory, { MapStorageFactory } from './map/factory'
import ModifierDataFactory from './modifier/factory'
import TextDataFactory from './text/factory'
import FolderDataFactory from './folder/factory'
import type ClassData from './class/data'
import type TextData from './text/data'
import type RaceData from './race/data'
import type SubraceData from './subrace/data'
import type MapData from './map/data'
import type { ModifierData } from './modifier/factory'
import type CharacterData from './character/data'
import type CreatureData from './creature/data'
import type FolderData from './folder/data'
import type CreatureStorage from './creature/storage'
import type CharacterStorage from './character/storage'
import type EncounterStorage from './encounter/storage'
import type EncounterData from './encounter/data'
import { isEnum, isObjectId, isRecord } from 'utils'
import { DocumentType, type DocumentFileType, FileType, validateObjectProperties, hasObjectProperties } from 'structure/database'
import type { DataPropertyMap, IDatabaseFactory, IDatabaseFile } from 'types/database'
import type { DocumentIDataMap, DocumentIStorageMap } from 'types/database/files/factory'

export interface DocumentDataMap {
    [DocumentType.Ability]: AbilityData
    [DocumentType.Creature]: CreatureData
    [DocumentType.Character]: CharacterData
    [DocumentType.Class]: ClassData
    [DocumentType.Subclass]: SubclassData
    [DocumentType.Encounter]: EncounterData
    [DocumentType.Item]: ItemData
    [DocumentType.Map]: MapData
    [DocumentType.Modifier]: ModifierData
    [DocumentType.Race]: RaceData
    [DocumentType.Subrace]: SubraceData
    [DocumentType.Spell]: SpellData
    [DocumentType.Text]: TextData
    [FileType.Folder]: FolderData
}

export interface DocumentStorageMap {
    [DocumentType.Ability]: DocumentIStorageMap[DocumentType.Ability]
    [DocumentType.Creature]: CreatureStorage
    [DocumentType.Character]: CharacterStorage
    [DocumentType.Class]: DocumentIStorageMap[DocumentType.Class]
    [DocumentType.Subclass]: DocumentIStorageMap[DocumentType.Subclass]
    [DocumentType.Encounter]: EncounterStorage
    [DocumentType.Item]: DocumentIStorageMap[DocumentType.Item]
    [DocumentType.Map]: MapStorage
    [DocumentType.Modifier]: DocumentIStorageMap[DocumentType.Modifier]
    [DocumentType.Race]: DocumentIStorageMap[DocumentType.Race]
    [DocumentType.Subrace]: DocumentIStorageMap[DocumentType.Subrace]
    [DocumentType.Spell]: DocumentIStorageMap[DocumentType.Spell]
    [DocumentType.Text]: DocumentIStorageMap[DocumentType.Text]
    [FileType.Folder]: DocumentIStorageMap[FileType.Folder]
}

export interface DocumentTypeMap {
    [DocumentType.Ability]: AbilityDocument
    [DocumentType.Creature]: CreatureDocument
    [DocumentType.Character]: CharacterDocument
    [DocumentType.Class]: ClassDocument
    [DocumentType.Encounter]: EncounterDocument
    [DocumentType.Subclass]: SubclassDocument
    [DocumentType.Item]: ItemDocument
    [DocumentType.Map]: MapDocument
    [DocumentType.Modifier]: ModifierDocument
    [DocumentType.Race]: RaceDocument
    [DocumentType.Subrace]: SubraceDocument
    [DocumentType.Spell]: SpellDocument
    [DocumentType.Text]: TextDocument
    [FileType.Folder]: FolderFile
}

type DocumentMap<P extends DocumentType> = IDatabaseFile<P, DocumentDataMap[P]>
type DocumentDataFactoryMap<P extends DocumentFileType> = P extends keyof DocumentIDataMap ? IDatabaseFactory<DocumentIDataMap[P], DocumentDataMap[P]> : null
type DocumentStorageFactoryMap<P extends DocumentFileType> = P extends keyof DocumentIDataMap ? IDatabaseFactory<DocumentIStorageMap[P], DocumentStorageMap[P]> : null

interface IDocumentFactory {
    readonly create: (data: IDatabaseFile) => DatabaseFile | null
    readonly createOfType: <T extends DocumentType>(data: IDatabaseFile, type: T) => DocumentTypeMap[T] | null
    readonly createOfTypes: <T extends readonly DocumentType[]>(data: IDatabaseFile, types: T) => DocumentTypeMap[T[number]] | null
    readonly is: (data: unknown) => data is IDatabaseFile
    readonly validate: (data: unknown) => data is Omit<IDatabaseFile, 'id' | 'isOwner'> & { id: unknown, isOwner: unknown }
    readonly dataFactory: (type: DocumentFileType) => DocumentDataFactoryMap<DocumentFileType>
    readonly storageFactory: (type: DocumentFileType) => DocumentStorageFactoryMap<DocumentFileType>
    readonly properties: (data: Record<string, unknown>, type: DocumentFileType) => DataPropertyMap<Record<string, unknown>> | null
    readonly isOfType: <T extends DocumentType>(data: IDatabaseFile, type: T) => data is DocumentMap<T>
    readonly isOfTypes: <T extends readonly DocumentType[]>(data: IDatabaseFile, types: T) => data is DocumentMap<T[number]>
}

const DocumentFactory: IDocumentFactory = {
    create: function (data: IDatabaseFile): DatabaseFile | null {
        switch (data.type) {
            case DocumentType.Ability:
                return new AbilityDocument({ ...data, type: data.type, data: AbilityDataFactory.create(data.data) })
            case DocumentType.Character:
                return new CharacterDocument({ ...data, type: data.type, data: CharacterDataFactory.create(data.data), storage: CharacterStorageFactory.create(data.storage) })
            case DocumentType.Creature:
                return new CreatureDocument({ ...data, type: data.type, data: CreatureDataFactory.create(data.data), storage: CreatureStorageFactory.create(data.storage) })
            case DocumentType.Class:
                return new ClassDocument({ ...data, type: data.type, data: ClassDataFactory.create(data.data) })
            case DocumentType.Subclass:
                return new SubclassDocument({ ...data, type: data.type, data: SubclassDataFactory.create(data.data) })
            case DocumentType.Encounter:
                return new EncounterDocument({ ...data, type: data.type, data: EncounterDataFactory.create(data.data), storage: EncounterStorageFactory.create(data.storage) })
            case DocumentType.Race:
                return new RaceDocument({ ...data, type: data.type, data: RaceDataFactory.create(data.data) })
            case DocumentType.Subrace:
                return new SubraceDocument({ ...data, type: data.type, data: SubraceDataFactory.create(data.data) })
            case DocumentType.Item:
                return new ItemDocument({ ...data, type: data.type, data: ItemDataFactory.create(data.data) })
            case DocumentType.Spell:
                return new SpellDocument({ ...data, type: data.type, data: SpellDataFactory.create(data.data) })
            case DocumentType.Map:
                return new MapDocument({ ...data, type: data.type, data: MapDataFactory.create(data.data), storage: MapStorageFactory.create(data.storage) })
            case DocumentType.Modifier:
                return new ModifierDocument({ ...data, type: data.type, data: ModifierDataFactory.create(data.data) })
            case DocumentType.Text:
                return new TextDocument({ ...data, type: data.type, data: TextDataFactory.create(data.data) })
            case FileType.Folder:
                return new FolderFile({ ...data, type: data.type, data: FolderDataFactory.create(data.data) })
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
    is: function (data: unknown): data is IDatabaseFile {
        if (!this.validate(data) || !isObjectId(data.id)) {
            return false
        }

        const properties = this.properties(data.data, data.type)
        return properties === null || hasObjectProperties(data.data, properties)
    },
    validate: function (data: unknown): data is Omit<IDatabaseFile, 'id'> & { id: unknown, isOwner: unknown } {
        return isRecord(data) && validateObjectProperties(data, DatabaseFile.properties)
    },
    dataFactory: function <T extends DocumentFileType>(type: T): DocumentDataFactoryMap<DocumentFileType> {
        switch (type) {
            case DocumentType.Ability:
                return AbilityDataFactory
            case DocumentType.Character:
                return CharacterDataFactory
            case DocumentType.Creature:
                return CreatureDataFactory
            case DocumentType.Class:
                return ClassDataFactory
            case DocumentType.Subclass:
                return SubclassDataFactory
            case DocumentType.Encounter:
                return EncounterDataFactory
            case DocumentType.Spell:
                return SpellDataFactory
            case DocumentType.Race:
                return RaceDataFactory
            case DocumentType.Subrace:
                return SubraceDataFactory
            case DocumentType.Map:
                return MapDataFactory
            case DocumentType.Item:
                return ItemDataFactory
            case DocumentType.Modifier:
                return ModifierDataFactory
            case DocumentType.Text:
                return TextDataFactory
            case FileType.Folder:
                return FolderDataFactory
            default:
                return null
        }
    },
    storageFactory: function <T extends DocumentFileType>(type: T): DocumentStorageFactoryMap<DocumentFileType> {
        switch (type) {
            case DocumentType.Character:
                return CharacterStorageFactory
            case DocumentType.Creature:
                return CreatureStorageFactory
            case DocumentType.Map:
                return MapStorageFactory
            case DocumentType.Encounter:
                return EncounterStorageFactory
            default:
                return null
        }
    },
    properties: function (data: Record<string, unknown>, type: DocumentFileType): DataPropertyMap<unknown> | null {
        return this.dataFactory(type)?.properties(data) ?? null
    },
    isOfType: function <T extends DocumentType>(data: IDatabaseFile, type: T): data is DocumentMap<T> {
        return data.type === type
    },
    isOfTypes: function <T extends readonly DocumentType[]>(data: IDatabaseFile, types: T): data is DocumentMap<T[number]> {
        return isEnum(data.type, DocumentType) && types.includes(data.type)
    }
}

export default DocumentFactory
