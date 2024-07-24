import type { DocumentType, FileType } from 'structure/database'
import type { IAbilityData, IAbilityStorage } from './ability'
import type { ICreatureData, ICreatureStorage } from './creature'
import type { ICharacterData, ICharacterStorage } from './character'
import type { IClassData, IClassStorage } from './class'
import type { IEncounterData, IEncounterStorage } from './encounter'
import type { ISubclassData, ISubclassStorage } from './subclass'
import type { ISpellData, ISpellStorage } from './spell'
import type { IItemData, IItemStorage } from './item'
import type { IMapData, IMapStorage } from './map'
import type { IModifierData, IModifierStorage } from './modifier'
import type { IRaceData, IRaceStorage } from './race'
import type { ISubraceData, ISubraceStorage } from './subrace'
import type { ITextData, ITextStorage } from './text'
import type { IFolderData, IFolderStorage } from './folder'

export interface DocumentIDataMap {
    [DocumentType.Ability]: IAbilityData
    [DocumentType.Character]: ICharacterData
    [DocumentType.Class]: IClassData
    [DocumentType.Creature]: ICreatureData
    [DocumentType.Encounter]: IEncounterData
    [DocumentType.Item]: IItemData
    [DocumentType.Map]: IMapData
    [DocumentType.Modifier]: IModifierData
    [DocumentType.Race]: IRaceData
    [DocumentType.Subrace]: ISubraceData
    [DocumentType.Spell]: ISpellData
    [DocumentType.Text]: ITextData
    [DocumentType.Subclass]: ISubclassData
    [FileType.Folder]: IFolderData
}

export interface DocumentIStorageMap {
    [DocumentType.Ability]: IAbilityStorage
    [DocumentType.Character]: ICharacterStorage
    [DocumentType.Class]: IClassStorage
    [DocumentType.Creature]: ICreatureStorage
    [DocumentType.Encounter]: IEncounterStorage
    [DocumentType.Item]: IItemStorage
    [DocumentType.Map]: IMapStorage
    [DocumentType.Modifier]: IModifierStorage
    [DocumentType.Race]: IRaceStorage
    [DocumentType.Subrace]: ISubraceStorage
    [DocumentType.Spell]: ISpellStorage
    [DocumentType.Subclass]: ISubclassStorage
    [DocumentType.Text]: ITextStorage
    [FileType.Folder]: IFolderStorage
}
