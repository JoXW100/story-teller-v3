import type { IDatabaseFileData, IDatabaseFileStorage } from '..'
import type { IAbilityData, IAbilityStorage } from './ability'
import type { ICharacterData, ICharacterStorage } from './character'
import type { IClassData, IClassStorage } from './class'
import type { IConditionData, IConditionStorage } from './condition'
import type { ICreatureData, ICreatureStorage } from './creature'
import type { IEncounterData, IEncounterStorage } from './encounter'
import type { ISubclassData, ISubclassStorage } from './subclass'
import type { ISpellData, ISpellStorage } from './spell'
import type { IItemData, IItemStorage } from './item'
import type { IMapData, IMapStorage } from './map'
import type { IModifierData, IModifierStorage } from './modifier'
import type { INPCData, INPCStorage } from './npc'
import type { IRaceData, IRaceStorage } from './race'
import type { ISubraceData, ISubraceStorage } from './subrace'
import type { ITextData, ITextStorage } from './text'
import type { IFolderData, IFolderStorage } from './folder'
import type { DocumentFileType } from 'structure/database'

export interface DocumentIDataMap extends Record<DocumentFileType, IDatabaseFileData> {
    [DocumentFileType.Ability]: IAbilityData
    [DocumentFileType.Character]: ICharacterData
    [DocumentFileType.Class]: IClassData
    [DocumentFileType.Condition]: IConditionData
    [DocumentFileType.Creature]: ICreatureData
    [DocumentFileType.Encounter]: IEncounterData
    [DocumentFileType.Item]: IItemData
    [DocumentFileType.Map]: IMapData
    [DocumentFileType.Modifier]: IModifierData
    [DocumentFileType.NPC]: INPCData
    [DocumentFileType.Race]: IRaceData
    [DocumentFileType.Subrace]: ISubraceData
    [DocumentFileType.Spell]: ISpellData
    [DocumentFileType.Text]: ITextData
    [DocumentFileType.Subclass]: ISubclassData
    [DocumentFileType.Folder]: IFolderData
}

export interface DocumentIStorageMap extends Record<DocumentFileType, IDatabaseFileStorage> {
    [DocumentFileType.Ability]: IAbilityStorage
    [DocumentFileType.Character]: ICharacterStorage
    [DocumentFileType.Class]: IClassStorage
    [DocumentFileType.Condition]: IConditionStorage
    [DocumentFileType.Creature]: ICreatureStorage
    [DocumentFileType.Encounter]: IEncounterStorage
    [DocumentFileType.Item]: IItemStorage
    [DocumentFileType.Map]: IMapStorage
    [DocumentFileType.Modifier]: IModifierStorage
    [DocumentFileType.NPC]: INPCStorage
    [DocumentFileType.Race]: IRaceStorage
    [DocumentFileType.Subrace]: ISubraceStorage
    [DocumentFileType.Spell]: ISpellStorage
    [DocumentFileType.Subclass]: ISubclassStorage
    [DocumentFileType.Text]: ITextStorage
    [DocumentFileType.Folder]: IFolderStorage
}
