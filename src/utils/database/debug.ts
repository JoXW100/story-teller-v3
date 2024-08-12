import type { Collection, Db } from 'mongodb'
import Database, { success } from '.'
import type { IDBStory } from './story'
import type { IDBFile } from './files'
import { type CollectionName, Collections } from './constants'
import { asBoolean, asEnum, asNumber, asObjectId, asString, isDefined, isEnum, isObjectId, isRecord, isString, keysOf } from 'utils'
import Logger from 'utils/logger'
import { DieType } from 'structure/dice'
import { CalcMode, type CalcValue, DocumentFileType, FlagType } from 'structure/database'
import AbilityDataFactory from 'structure/database/files/ability/factory'
import { CreatureDataFactory, CreatureStorageFactory } from 'structure/database/files/creature/factory'
import { CharacterDataFactory, CharacterStorageFactory } from 'structure/database/files/character/factory'
import ClassDataFactory from 'structure/database/files/class/factory'
import TextDataFactory from 'structure/database/files/text/factory'
import { EncounterDataFactory } from 'structure/database/files/encounter/factory'
import ItemDataFactory from 'structure/database/files/item/factory'
import RaceDataFactory from 'structure/database/files/race/factory'
import SpellDataFactory from 'structure/database/files/spell/factory'
import NPCDataFactory from 'structure/database/files/npc/factory'
import { LevelModifyType } from 'structure/database/files/class/levelData'
import { EffectConditionType } from 'structure/database/effectCondition'
import { EffectCategory, EffectType } from 'structure/database/effect/common'
import { AbilityType } from 'structure/database/files/ability/common'
import { ActionType, AdvantageBinding, Alignment, AreaType, ArmorType, Attribute, CastingTime, ClassLevel, ConditionBinding, CreatureType, DamageBinding, Duration, ItemType, type Language, MagicSchool, MeleeWeaponType, MovementType, OptionalAttribute, ProficiencyLevel, ProficiencyLevelBasic, RangedWeaponType, Rarity, RestType, ScalingType, Sense, SizeType, Skill, SpellLevel, TargetType, ThrownWeaponType, ToolType, type WeaponTypeValue } from 'structure/dnd'
import type { ObjectId } from 'types'
import type { DBItem } from 'types/old'
import type { DBStory } from 'types/old/stories'
import type { DBResponse } from 'types/database'
import { DamageType, type DiceType, EffectCondition, AbilityType as OldAbilityType, type RestType as OldRestType, ScalingType as OldScalingType, ArmorType as OldArmorType, ItemType as OldItemType, TargetType as OldTargetType, Gender } from 'types/old/dnd'
import { CalculationMode, FileType, type IFileContent, type IOptionType } from 'types/old/files'
import type { ICreatureStorage as IOldCreatureStorage, ICreatureMetadata } from 'types/old/files/creature'
import type { ISourceBinding, ICreatureData, ICreatureStorage } from 'types/database/files/creature'
import type { ICharacterStorage as IOldCharacterStorage, ICharacterMetadata } from 'types/old/files/character'
import type { ICharacterStorage, IInventoryItemData, ICharacterData } from 'types/database/files/character'
import type { IClassMetadata } from 'types/old/files/class'
import type { IClassData, IClassLevelData } from 'types/database/files/class'
import type { ISpellMetadata } from 'types/old/files/spell'
import type { ISpellData, ISpellDataBase } from 'types/database/files/spell'
import type { IArea } from 'types/database/area'
import type { IRaceMetadata } from 'types/old/files/race'
import type { IRaceData } from 'types/database/files/race'
import type { IItemData, IItemDataBase } from 'types/database/files/item'
import type { IEncounterMetadata } from 'types/old/files/encounter'
import type { IEncounterData } from 'types/database/files/encounter'
import type { IItemMetadata } from 'types/old/files/item'
import type { IEffectCondition } from 'types/database/effectCondition'
import type { IEffect } from 'types/database/effect'
import type { IAbilityDataBase, IAbilityData } from 'types/database/files/ability'
import type { IAbilityMetadata } from 'types/old/files/ability'
import type { IChargesData } from 'types/database/charges'
import type { INPCData } from 'types/database/files/npc'
import type IOldEffect from 'types/old/files/iEffect'
import type ICreatureActionData from 'types/old/files/iConditionalHitEffect'

interface IDebugCollections {
    main: Collection
    temp: Collection
    backup: Collection
}

class DebugHandler {
    public readonly test: boolean
    private readonly collections: Record<CollectionName, IDebugCollections>

    private get currentFilesCollection(): Collection<IDBFile> { return Database.files!.collection }
    private get currentStoriesCollection(): Collection<IDBStory> { return Database.stories!.collection }

    constructor (database: Db, test: boolean) {
        this.test = test
        this.collections = {} as any
        for (const name of keysOf(Collections)) {
            this.collections[name] = {
                main: database.collection(Collections[name].main),
                temp: database.collection(Collections[name].temp),
                backup: database.collection(Collections[name].backup)
            }
        }
    }

    async run(data: Record<string, unknown>): Promise<DBResponse<boolean>> {
        if (process.env.NODE_ENV !== 'development') {
            return fail('Debug not enabled')
        }
        return success(false) // Prevent further calls
        /*
        // Move temp to main
        await this.move('files', 'files', 'temp', 'main')
        await this.move('stories', 'stories', 'temp', 'main')
        // Clear
        await this.clear('files', 'backup')
        await this.clear('stories', 'backup')
        await this.clear('files', 'temp')
        await this.clear('stories', 'temp')
        // Backup
        await this.backup('files')
        await this.backup('stories')
        // Move current into temp
        await this.move('_document', 'files', 'main', 'temp')
        await this.move('_story', 'stories', 'main', 'temp')
        // Convert previous into temp
        await this.convertFiles('files')
        await this.convertStories('stories')
        Logger.log('debug.done', true)
        return success(true)
        */
    }

    async clear(name: CollectionName, type: keyof IDebugCollections): Promise<DBResponse<boolean>> {
        const res = await this.collections[name][type].deleteMany({})
        Logger.log('debug.clear', name, type, res.deletedCount)
        return success(true)
    }

    async backup(name: CollectionName): Promise<DBResponse<boolean>> {
        const res = await this.collections[name].main.aggregate([
            { $out: this.collections[name].backup.collectionName }
        ]).toArray()
        Logger.log('debug.transfer', name, res.length)
        return success(true)
    }

    async deploy(name: CollectionName): Promise<DBResponse<boolean>> {
        const res = await this.collections[name].temp.aggregate([
            { $out: this.collections[name].main.collectionName }
        ]).toArray()
        Logger.log('debug.deploy', name, res.length)
        return success(true)
    }

    async move(from: CollectionName, target: CollectionName, fromType: keyof IDebugCollections, targetType: keyof IDebugCollections): Promise<DBResponse<boolean>> {
        const res = await this.collections[from][fromType].aggregate([
            { $out: this.collections[target][targetType].collectionName }
        ]).toArray()
        Logger.log('debug.move', from, target, fromType, targetType, res.length)
        return success(true)
    }

    async convertStories(name: CollectionName): Promise<DBResponse<boolean>> {
        const stories = await this.collections[name].backup.find().toArray() as DBStory[]
        const conversions: IDBStory[] = []
        for (const story of stories) {
            conversions.push({
                _id: story._id,
                _userId: story._userId,
                name: asString(story.name, ''),
                description: asString(story.desc, ''),
                image: null,
                sources: [],
                flags: [],
                dateCreated: story.dateCreated,
                dateUpdated: story.dateUpdated
            })
        }
        const response = await this.collections[name].temp.insertMany(conversions)
        return success(response.acknowledged)
    }

    async convertFiles(name: CollectionName): Promise<DBResponse<boolean>> {
        const files = await this.collections[name].backup.find().toArray() as DBItem[]
        const conversions: IDBFile[] = []
        for (const file of files) {
            if (!isDefined(file._id)) {
                continue
            }
            switch (file.type) {
                case FileType.Ability:
                    conversions.push({
                        _id: file._id,
                        _userId: file._userId,
                        _storyId: file._storyId,
                        _holderId: file._holderId ?? null,
                        type: DocumentFileType.Ability,
                        name: file.content.name,
                        flags: asBoolean(file.content.public) ? [FlagType.Public] : [],
                        data: AbilityDataFactory.simplify(this.toAbilityData(file.metadata)),
                        dateCreated: file.dateCreated,
                        dateUpdated: file.dateUpdated
                    })
                    continue
                case FileType.Character:
                    if ((file.metadata as ICharacterMetadata).simple === true) {
                        conversions.push({
                            _id: file._id,
                            _userId: file._userId,
                            _storyId: file._storyId,
                            _holderId: file._holderId ?? null,
                            type: DocumentFileType.NPC,
                            name: file.content.name,
                            flags: asBoolean(file.content.public) ? [FlagType.Public] : [],
                            data: NPCDataFactory.simplify(this.toNPCData(file.metadata, file.content)),
                            dateCreated: file.dateCreated,
                            dateUpdated: file.dateUpdated
                        })
                    } else {
                        conversions.push({
                            _id: file._id,
                            _userId: file._userId,
                            _storyId: file._storyId,
                            _holderId: file._holderId ?? null,
                            type: DocumentFileType.Character,
                            name: file.content.name,
                            flags: asBoolean(file.content.public) ? [FlagType.Public] : [],
                            data: CharacterDataFactory.simplify(this.toCharacterData(file.metadata, file.content)),
                            storage: CharacterStorageFactory.simplify(this.toCharacterStorage(file.storage)),
                            dateCreated: file.dateCreated,
                            dateUpdated: file.dateUpdated
                        })
                    }
                    continue
                case FileType.Class:
                    conversions.push({
                        _id: file._id,
                        _userId: file._userId,
                        _storyId: file._storyId,
                        _holderId: file._holderId ?? null,
                        type: DocumentFileType.Class,
                        name: file.content.name,
                        flags: asBoolean(file.content.public) ? [FlagType.Public] : [],
                        data: ClassDataFactory.simplify(this.toClassData(file.metadata, file.content)),
                        dateCreated: file.dateCreated,
                        dateUpdated: file.dateUpdated
                    })
                    continue
                case FileType.Creature:
                    conversions.push({
                        _id: file._id,
                        _userId: file._userId,
                        _storyId: file._storyId,
                        _holderId: file._holderId ?? null,
                        type: DocumentFileType.Creature,
                        name: file.content.name,
                        flags: asBoolean(file.content.public) ? [FlagType.Public] : [],
                        data: CreatureDataFactory.simplify(this.toCreatureData(file.metadata, file.content)),
                        storage: CreatureStorageFactory.simplify(this.toCreatureStorage(file.storage)),
                        dateCreated: file.dateCreated,
                        dateUpdated: file.dateUpdated
                    })
                    continue
                case FileType.Document:
                    conversions.push({
                        _id: file._id,
                        _userId: file._userId,
                        _storyId: file._storyId,
                        _holderId: file._holderId ?? null,
                        type: DocumentFileType.Text,
                        name: file.content.name,
                        flags: asBoolean(file.content.public) ? [FlagType.Public] : [],
                        data: TextDataFactory.simplify({
                            title: asString(file.metadata.name, ''),
                            description: asString(file.metadata.description, ''),
                            content: asString(file.content.text, '')
                        }),
                        dateCreated: file.dateCreated,
                        dateUpdated: file.dateUpdated
                    })
                    continue
                case FileType.Encounter:
                    conversions.push({
                        _id: file._id,
                        _userId: file._userId,
                        _storyId: file._storyId,
                        _holderId: file._holderId ?? null,
                        type: DocumentFileType.Encounter,
                        name: file.content.name,
                        flags: asBoolean(file.content.public) ? [FlagType.Public] : [],
                        data: EncounterDataFactory.simplify(this.toEncounterData(file.metadata, file.content)),
                        dateCreated: file.dateCreated,
                        dateUpdated: file.dateUpdated
                    })
                    continue
                case FileType.Folder:
                    conversions.push({
                        _id: file._id,
                        _userId: file._userId,
                        _storyId: file._storyId,
                        _holderId: file._holderId ?? null,
                        type: DocumentFileType.Folder,
                        name: file.content.name,
                        flags: [],
                        data: { open: file.content.open ?? false },
                        dateCreated: file.dateCreated,
                        dateUpdated: file.dateUpdated
                    })
                    continue
                case FileType.Item:
                    conversions.push({
                        _id: file._id,
                        _userId: file._userId,
                        _storyId: file._storyId,
                        _holderId: file._holderId ?? null,
                        type: DocumentFileType.Item,
                        name: file.content.name,
                        flags: asBoolean(file.content.public) ? [FlagType.Public] : [],
                        data: ItemDataFactory.simplify(this.toItemData(file.metadata, file.content)),
                        dateCreated: file.dateCreated,
                        dateUpdated: file.dateUpdated
                    })
                    continue
                case FileType.Race:
                    conversions.push({
                        _id: file._id,
                        _userId: file._userId,
                        _storyId: file._storyId,
                        _holderId: file._holderId ?? null,
                        type: DocumentFileType.Race,
                        name: file.content.name,
                        flags: asBoolean(file.content.public) ? [FlagType.Public] : [],
                        data: RaceDataFactory.simplify(this.toRaceData(file.metadata, file.content)),
                        dateCreated: file.dateCreated,
                        dateUpdated: file.dateUpdated
                    })
                    continue
                case FileType.Spell:
                    conversions.push({
                        _id: file._id,
                        _userId: file._userId,
                        _storyId: file._storyId,
                        _holderId: file._holderId ?? null,
                        type: DocumentFileType.Spell,
                        name: file.content.name,
                        flags: asBoolean(file.content.public) ? [FlagType.Public] : [],
                        data: SpellDataFactory.simplify(this.toSpell(file.metadata)),
                        dateCreated: file.dateCreated,
                        dateUpdated: file.dateUpdated
                    })
                    continue
                case FileType.Root:
                    conversions.push({
                        _id: file._id,
                        _userId: file._userId,
                        _storyId: file._storyId,
                        _holderId: file._holderId ?? null,
                        type: DocumentFileType.Root,
                        name: '',
                        flags: [],
                        dateCreated: file.dateCreated,
                        dateUpdated: file.dateUpdated
                    })
                    continue
                case FileType.Empty:
                case FileType.LocalFolder:
                case FileType.LocalImage:
                default:
                    continue
            }
        }
        const response = await this.collections[name].temp.insertMany(conversions)
        return success(response.acknowledged)
    }

    private toAbilityData(metadata: IAbilityMetadata): IAbilityData {
        const base: IAbilityDataBase = {
            type: AbilityType.Feature,
            name: asString(metadata.name, ''),
            description: asString(metadata.description, ''),
            notes: asString(metadata.notes, ''),
            action: asEnum(metadata.action, ActionType) ?? ActionType.Action,
            charges: this.toCharges(metadata.charges, metadata.chargesReset),
            modifiers: [] // TODO: Modifiers are not converted
        }
        switch (metadata.type ?? OldAbilityType.Feature) {
            case OldAbilityType.Feature:
                return {
                    ...base,
                    type: AbilityType.Feature
                }
            case OldAbilityType.MeleeAttack:
                return {
                    ...base,
                    type: AbilityType.MeleeAttack,
                    reach: asNumber(metadata.range, 5),
                    condition: this.toCondition(metadata),
                    effects: this.toEffects(metadata.effects)
                }
            case OldAbilityType.RangedAttack:
                return {
                    ...base,
                    type: AbilityType.RangedAttack,
                    range: asNumber(metadata.range, 0),
                    rangeLong: asNumber(metadata.rangeLong, 0),
                    condition: this.toCondition(metadata),
                    effects: this.toEffects(metadata.effects)
                }
            case OldAbilityType.MeleeWeapon:
                return {
                    ...base,
                    type: AbilityType.MeleeWeapon,
                    reach: asNumber(metadata.range, 5),
                    condition: this.toCondition(metadata),
                    effects: this.toEffects(metadata.effects)
                }
            case OldAbilityType.RangedWeapon:
                return {
                    ...base,
                    type: AbilityType.RangedWeapon,
                    range: asNumber(metadata.range, 0),
                    rangeLong: asNumber(metadata.rangeLong, 0),
                    condition: this.toCondition(metadata),
                    effects: this.toEffects(metadata.effects)
                }
            case OldAbilityType.ThrownWeapon:
                return {
                    ...base,
                    type: AbilityType.ThrownWeapon,
                    reach: asNumber(metadata.range, 5),
                    range: asNumber(metadata.rangeThrown, 0),
                    rangeLong: asNumber(metadata.rangeLong, 0),
                    condition: this.toCondition(metadata),
                    effects: this.toEffects(metadata.effects)
                }
        }
    }

    private toCreatureData(metadata: ICreatureMetadata, content: IFileContent): ICreatureData {
        const proficienciesSave: Partial<Record<Attribute, ProficiencyLevel>> = {}
        if (Array.isArray(metadata.proficienciesSave)) {
            for (const attr of metadata.proficienciesSave) {
                proficienciesSave[attr] = ProficiencyLevel.Proficient
            }
        }
        const proficienciesSkill: Partial<Record<Skill, ProficiencyLevel>> = {}
        if (isRecord(metadata.proficienciesSkill)) {
            for (const skill of keysOf(metadata.proficienciesSkill)) {
                const value = asEnum(metadata.proficienciesSkill[skill], ProficiencyLevel)
                if (value !== null && isEnum(skill, Skill)) {
                    proficienciesSkill[skill] = value
                }
            }
        }
        const proficienciesTool: Partial<Record<ToolType, ProficiencyLevel>> = {}
        if (isRecord(metadata.proficienciesTool)) {
            for (const tool of keysOf(metadata.proficienciesTool)) {
                const value = asEnum(metadata.proficienciesTool[tool], ProficiencyLevel)
                if (value !== null && isEnum(tool, ToolType)) {
                    proficienciesTool[tool as ToolType] = value
                }
            }
        }
        const proficienciesLanguage: Partial<Record<Language, ProficiencyLevelBasic>> = {}
        if (Array.isArray(metadata.proficienciesLanguage)) {
            for (const value of metadata.proficienciesLanguage) {
                proficienciesLanguage[value] = ProficiencyLevelBasic.Proficient
            }
        }
        const proficienciesArmor: Partial<Record<ArmorType, ProficiencyLevelBasic>> = {}
        if (Array.isArray(metadata.proficienciesArmor)) {
            for (const value of metadata.proficienciesArmor) {
                proficienciesArmor[this.convertArmorType(value)] = ProficiencyLevelBasic.Proficient
            }
        }
        const proficienciesWeapon: Partial<Record<WeaponTypeValue, ProficiencyLevelBasic>> = {}
        if (Array.isArray(metadata.proficienciesWeapon)) {
            for (const value of metadata.proficienciesWeapon) {
                proficienciesWeapon[value] = ProficiencyLevelBasic.Proficient
            }
        }
        const advantages: Partial<Record<AdvantageBinding, readonly ISourceBinding[]>> = {}
        if (isRecord(metadata.advantages)) {
            for (const binding of keysOf(metadata.advantages)) {
                advantages[asEnum(binding, AdvantageBinding) ?? AdvantageBinding.Generic] = [{
                    source: null,
                    description: asString(metadata.advantages[binding], '')
                }]
            }
        }
        const disadvantages: Partial<Record<AdvantageBinding, readonly ISourceBinding[]>> = {}
        if (isRecord(metadata.disadvantages)) {
            for (const binding of keysOf(metadata.disadvantages)) {
                disadvantages[asEnum(binding, AdvantageBinding) ?? AdvantageBinding.Generic] = [{
                    source: null,
                    description: asString(metadata.disadvantages[binding], '')
                }]
            }
        }
        const resistances: Partial<Record<DamageBinding, readonly ISourceBinding[]>> = {}
        if (isString(metadata.resistances)) {
            resistances[DamageBinding.Generic] = [{ source: null, description: metadata.resistances }]
        }
        const vulnerabilities: Partial<Record<DamageBinding, readonly ISourceBinding[]>> = {}
        if (isString(metadata.vulnerabilities)) {
            vulnerabilities[DamageBinding.Generic] = [{ source: null, description: metadata.vulnerabilities }]
        }
        const damageImmunities: Partial<Record<DamageBinding, readonly ISourceBinding[]>> = {}
        if (isString(metadata.dmgImmunities)) {
            damageImmunities[DamageBinding.Generic] = [{ source: null, description: metadata.dmgImmunities }]
        }
        const conditionImmunities: Partial<Record<ConditionBinding, readonly ISourceBinding[]>> = {}
        if (isString(metadata.conImmunities)) {
            conditionImmunities[ConditionBinding.Generic] = [{ source: null, description: metadata.conImmunities }]
        }
        const spellSlots: Partial<Record<SpellLevel, number>> = {}
        if (Array.isArray(metadata.spellSlots)) {
            for (let i = 0; i < metadata.spellSlots.length; i++) {
                spellSlots[String(i) as SpellLevel] = asNumber(metadata.spellSlots[i], 0)
            }
        }
        const spells: Record<ObjectId, OptionalAttribute> = {}
        if (metadata.spells !== undefined) {
            for (const id of metadata.spells) {
                if (isObjectId(id)) {
                    spells[id] = asEnum(metadata.spellAttribute, OptionalAttribute, OptionalAttribute.None)
                }
            }
        }
        const abilities: Array<ObjectId | string> = []
        if (metadata.abilities !== undefined) {
            for (const id of metadata.abilities) {
                abilities.push(id as ObjectId | string)
            }
        }
        const speed: Partial<Record<MovementType, number>> = {}
        if (metadata.speed !== undefined) {
            for (const key of keysOf(metadata.speed)) {
                if (isEnum(key, MovementType)) {
                    speed[key] = asNumber(metadata.speed[key], 0)
                }
            }
        }
        const senses: Partial<Record<Sense, number>> = {}
        if (metadata.senses !== undefined) {
            for (const key of keysOf(metadata.senses)) {
                if (isEnum(key, Sense)) {
                    senses[key] = asNumber(metadata.senses[key], 0)
                }
            }
        }
        return {
            name: asString(metadata.name, ''),
            description: asString(metadata.description, ''),
            content: asString(content.text, ''),
            portrait: asString(metadata.portrait, ''),
            type: asEnum(metadata.type, CreatureType, CreatureType.None),
            size: asEnum(metadata.size, SizeType, SizeType.Medium),
            alignment: asEnum(metadata.alignment, Alignment, Alignment.None),
            challenge: asNumber(metadata.challenge),
            xp: asNumber(metadata.xp, 0),
            level: asNumber(metadata.level, 0),
            hitDie: this.convertDiceType(metadata.hitDice),
            health: this.convertOptionType(metadata.health),
            ac: this.convertOptionType(metadata.ac),
            proficiency: this.convertOptionType(metadata.proficiency),
            initiative: this.convertOptionType(metadata.initiative),
            speed: speed,
            senses: senses,
            str: asNumber(metadata.str, 10),
            dex: asNumber(metadata.dex, 10),
            con: asNumber(metadata.con, 10),
            int: asNumber(metadata.int, 10),
            wis: asNumber(metadata.wis, 10),
            cha: asNumber(metadata.cha, 10),
            passivePerception: this.convertOptionType(metadata.passivePerception),
            passiveInvestigation: this.convertOptionType(metadata.passiveInvestigation),
            passiveInsight: this.convertOptionType(metadata.passiveInsight),
            proficienciesSave: proficienciesSave,
            proficienciesSkill: proficienciesSkill,
            proficienciesTool: proficienciesTool,
            proficienciesLanguage: proficienciesLanguage,
            proficienciesArmor: proficienciesArmor,
            proficienciesWeapon: proficienciesWeapon,
            advantages: advantages,
            disadvantages: disadvantages,
            resistances: resistances,
            vulnerabilities: vulnerabilities,
            damageImmunities: damageImmunities,
            conditionImmunities: conditionImmunities,
            spellAttribute: asEnum(metadata.spellAttribute, OptionalAttribute, OptionalAttribute.None),
            casterLevel: this.convertOptionType(metadata.casterLevel),
            spellSlots: spellSlots,
            spells: spells,
            ritualCaster: false,
            abilities: abilities
        }
    }

    private toCreatureStorage(storage: IOldCreatureStorage): ICreatureStorage {
        const spellsExpendedSlots: Partial<Record<SpellLevel, number>> = {}
        if (Array.isArray(storage.spellData)) {
            for (let i = 0; i < storage.spellData.length; i++) {
                const slots = asNumber(storage.spellData[i], 0)
                if (slots > 0) {
                    spellsExpendedSlots[String(i) as SpellLevel] = slots
                }
            }
        }
        return {
            health: null,
            healthTemp: null,
            abilitiesExpendedCharges: {},
            spellsExpendedSlots: spellsExpendedSlots,
            choices: {},
            conditions: []
        }
    }

    private toCharacterData(metadata: ICharacterMetadata, content: IFileContent): ICharacterData {
        const classes: Record<ObjectId, ClassLevel> = {}
        if (isObjectId(metadata.classFile)) {
            classes[metadata.classFile] = asEnum(String(metadata.level ?? 1), ClassLevel) ?? ClassLevel.Level1
        }
        let text = ''
        if (metadata.appearance !== undefined && metadata.appearance.length > 0) {
            text += `\\h2{Appearance}\n${metadata.appearance}\n`
        }
        if (metadata.history !== undefined && metadata.history.length > 0) {
            text += `\\h2{History}\n${metadata.history}\n`
        }
        if (metadata.notes !== undefined && metadata.notes.length > 0) {
            text += `\\h2{Notes}\n${metadata.notes}\n`
        }
        if (text.length > 0 && asString(content.text, '').length > 0) {
            text += `\\h2{Content}\n${content.text}`
        }
        return {
            ...this.toCreatureData(metadata, { ...content, text: text }),
            gender: this.convertGender(metadata.gender),
            age: asString(metadata.age, ''),
            height: asString(metadata.height, ''),
            weight: asString(metadata.weight, ''),
            race: asObjectId(metadata.raceFile),
            subrace: null,
            raceName: asString(metadata.raceName, ''),
            classes: classes,
            subclasses: {},
            attunementSlots: 3
        }
    }

    private toNPCData(metadata: ICharacterMetadata, content: IFileContent): INPCData {
        let text = ''
        if (metadata.appearance !== undefined && metadata.appearance.length > 0) {
            text += `\\h2{Appearance}\n${metadata.appearance}\n`
        }
        if (metadata.history !== undefined && metadata.history.length > 0) {
            text += `\\h2{History}\n${metadata.history}\n`
        }
        if (metadata.notes !== undefined && metadata.notes.length > 0) {
            text += `\\h2{Notes}\n${metadata.notes}\n`
        }
        if (text.length > 0 && asString(content.text, '').length > 0) {
            text += `\\h2{Content}\n${content.text}`
        }
        return {
            name: asString(metadata.name, ''),
            description: asString(metadata.description, ''),
            content: text,
            portrait: asString(metadata.portrait, ''),
            type: asEnum(metadata.type, CreatureType, CreatureType.None),
            size: asEnum(metadata.size, SizeType, SizeType.Medium),
            alignment: asEnum(metadata.alignment, Alignment, Alignment.None),
            race: asString(metadata.raceName, ''),
            gender: this.convertGender(metadata.gender),
            age: asString(metadata.age, ''),
            height: asString(metadata.height, ''),
            weight: asString(metadata.weight, '')
        }
    }

    private toCharacterStorage(storage: IOldCharacterStorage): ICharacterStorage {
        const inventory: Record<ObjectId, IInventoryItemData> = {}
        if (isRecord(storage.inventory)) {
            for (const key of keysOf(storage.inventory)) {
                if (isObjectId(key)) {
                    const value = storage.inventory[key]
                    inventory[key] = {
                        equipped: asBoolean(value.equipped, false),
                        quantity: asNumber(value.quantity, 1)
                    }
                }
            }
        }
        return {
            ...this.toCreatureStorage(storage as IOldCreatureStorage),
            health: asNumber(storage.health, null),
            healthTemp: asNumber(storage.tempHealth, null),
            spellPreparations: {},
            preparationsExpendedSlots: {},
            inventory: inventory,
            inventoryText: asString(storage.inventoryOther, ''),
            attunement: []
        }
    }

    private toClassData(metadata: IClassMetadata, content: IFileContent): IClassData {
        const levels: Record<ClassLevel, IClassLevelData> = {} as any
        for (let i = 1; i <= 20; i++) {
            const level = String(i) as ClassLevel
            const slots: Partial<Record<SpellLevel, number>> = {}
            const slotsNum = metadata.spellSlots?.[i - 1] ?? []
            for (let s = 0; s < slotsNum.length; s++) {
                const level = asEnum(String(s), SpellLevel)
                if (level !== null && slotsNum[s] > 0) {
                    slots[level] = asNumber(slotsNum[s], 0)
                }
            }
            levels[level] = {
                modifiers: [],
                type: LevelModifyType.Replace,
                spellAttribute: OptionalAttribute.None,
                spellSlots: {},
                preparationSlots: asNumber(metadata.preparationSlots?.[i - 1], 0),
                learnedSlots: asNumber(metadata.learnedSlots?.[i - 1], 0)
            }
        }
        return {
            name: asString(metadata.name, ''),
            description: asString(metadata.description, ''),
            content: asString(content.text, ''),
            hitDie: this.convertDiceType(metadata.hitDice),
            subclassLevel: asEnum(String(metadata.subclassLevel ?? 1), ClassLevel, ClassLevel.Level1),
            levels: levels,
            proficienciesSave: {},
            proficienciesTool: {},
            proficienciesArmor: {},
            proficienciesWeapon: {},
            spellAttribute: asEnum(metadata.spellAttribute, OptionalAttribute, OptionalAttribute.None),
            preparationAll: metadata.preparationAll ?? false,
            preparationSlotsScaling: asEnum(metadata.preparationSlotsScaling, OptionalAttribute, OptionalAttribute.None),
            learnedAll: metadata.learnedAll ?? false,
            learnedSlotsScaling: OptionalAttribute.None
        }
    }

    private toEncounterData(metadata: IEncounterMetadata, content: IFileContent): IEncounterData {
        const creatures: Record<ObjectId, number> = {}
        if (metadata.creatures !== undefined) {
            for (const id of metadata.creatures) {
                if (isObjectId(id)) {
                    creatures[id] = (creatures[id] ?? 0) + 1
                }
            }
        }
        return {
            name: asString(metadata.name, ''),
            description: asString(metadata.description, ''),
            content: asString(content.text, ''),
            challenge: metadata.challenge ?? 0,
            xp: metadata.xp ?? 0,
            creatures: creatures
        }
    }

    private toItemData(metadata: IItemMetadata, content: IFileContent): IItemData {
        const base: IItemDataBase = {
            name: asString(metadata.name, ''),
            description: asString(metadata.description, ''),
            content: asString(content.text, ''),
            type: ItemType.Armor,
            rarity: asEnum(metadata.rarity, Rarity) ?? Rarity.Mundane,
            attunement: metadata.requiresAttunement ?? false,
            weight: asNumber(metadata.weight, 0),
            cost: asNumber(metadata.value, 0),
            charges: {},
            modifiers: []
        }
        switch (metadata.type ?? OldItemType.Armor) {
            case OldItemType.Armor:
                return {
                    ...base,
                    type: ItemType.Armor,
                    subtype: asEnum(metadata.armorType, ArmorType) ?? ArmorType.Light,
                    ac: 10,
                    disadvantageStealth: false
                }
            case OldItemType.Consumable:
                return {
                    ...base,
                    type: ItemType.Consumable
                }
            case OldItemType.MeleeWeapon:
                return {
                    ...base,
                    type: ItemType.Weapon,
                    subtype: asEnum(metadata.meleeWeaponType, MeleeWeaponType) ?? MeleeWeaponType.Battleaxe,
                    notes: asString(metadata.notes, ''),
                    damageType: DamageType.None,
                    damageScaling: {},
                    damageDie: DieType.None,
                    damageDieCount: {},
                    hitScaling: {},
                    effects: {},
                    reach: 0
                }
            case OldItemType.RangedWeapon:
                return {
                    ...base,
                    type: ItemType.Weapon,
                    subtype: asEnum(metadata.rangedWeaponType, RangedWeaponType) ?? RangedWeaponType.Blowgun,
                    notes: asString(metadata.notes, ''),
                    damageType: DamageType.None,
                    damageScaling: {},
                    damageDie: DieType.None,
                    damageDieCount: {},
                    hitScaling: {},
                    effects: {},
                    range: 0,
                    rangeLong: 0
                }
            case OldItemType.ThrownWeapon: {
                return {
                    ...base,
                    type: ItemType.Weapon,
                    subtype: asEnum(metadata.thrownWeaponType, ThrownWeaponType) ?? ThrownWeaponType.Dagger,
                    notes: asString(metadata.notes, ''),
                    damageType: DamageType.None,
                    damageScaling: {},
                    damageDie: DieType.None,
                    damageDieCount: {},
                    hitScaling: {},
                    effects: {},
                    reach: 0,
                    range: 0
                }
            }
            case OldItemType.Trinket:
                return {
                    ...base,
                    type: ItemType.Other
                }
        }
    }

    private toRaceData(metadata: IRaceMetadata, content: IFileContent): IRaceData {
        const languages: Partial<Record<Language, ProficiencyLevelBasic>> = {}
        if (Array.isArray(metadata.proficienciesLanguage)) {
            for (const value of metadata.proficienciesLanguage) {
                languages[value] = ProficiencyLevelBasic.Proficient
            }
        }
        const speed: Partial<Record<MovementType, number>> = {}
        if (metadata.speed !== undefined) {
            for (const key of keysOf(metadata.speed)) {
                if (isEnum(key, MovementType)) {
                    speed[key] = asNumber(metadata.speed[key], 0)
                }
            }
        }
        const senses: Partial<Record<Sense, number>> = {}
        if (metadata.senses !== undefined) {
            for (const key of keysOf(metadata.senses)) {
                if (isEnum(key, Sense)) {
                    senses[key] = asNumber(metadata.senses[key], 0)
                }
            }
        }
        return {
            name: asString(metadata.name, ''),
            description: asString(metadata.description, ''),
            content: asString(content.text, ''),
            type: asEnum(metadata.type, CreatureType, CreatureType.Humanoid),
            size: asEnum(metadata.size, SizeType, SizeType.Medium),
            speed: speed,
            senses: senses,
            languages: languages,
            modifiers: []
        }
    }

    private toSpell(metadata: ISpellMetadata): ISpellData {
        const base: ISpellDataBase = {
            name: asString(metadata.name, ''),
            description: asString(metadata.description, ''),
            notes: asString(metadata.notes, ''),
            level: asEnum(String(metadata.level ?? 1), SpellLevel, SpellLevel.Cantrip),
            school: asEnum(metadata.school, MagicSchool, MagicSchool.Abjuration),
            time: asEnum(metadata.time, CastingTime, CastingTime.Action),
            timeCustom: asString(metadata.timeCustom, ''),
            timeValue: asNumber(metadata.timeValue, 1),
            duration: asEnum(metadata.duration, Duration, Duration.Instantaneous),
            durationCustom: '',
            durationValue: asNumber(metadata.durationValue, 1),
            target: asEnum(metadata.target, TargetType, TargetType.None),
            condition: this.toCondition(metadata),
            allowUpcast: (metadata.level ?? 1) > 0,
            ritual: asBoolean(metadata.ritual),
            concentration: asBoolean(metadata.concentration),
            componentVerbal: asBoolean(metadata.componentVerbal),
            componentSomatic: asBoolean(metadata.componentSomatic),
            componentMaterial: asBoolean(metadata.componentMaterial),
            materials: asString(metadata.materials, ''),
            effects: this.toEffects(metadata.effects)
        }
        switch (metadata.target ?? OldTargetType.None) {
            case OldTargetType.None:
                return {
                    ...base,
                    target: OldTargetType.None,
                    condition: { type: EffectConditionType.None }
                }
            case OldTargetType.Multiple:
                return {
                    ...base,
                    target: OldTargetType.Multiple,
                    range: metadata.range ?? 0,
                    count: 1
                }
            case OldTargetType.Point:
                return {
                    ...base,
                    target: OldTargetType.Point,
                    range: metadata.range ?? 0,
                    area: this.toArea(metadata.area, metadata.areaSize, metadata.areaHeight)
                }
            case OldTargetType.Self:
                return {
                    ...base,
                    target: OldTargetType.Self,
                    area: this.toArea(metadata.area, metadata.areaSize, metadata.areaHeight)
                }
            case OldTargetType.Single:
                return {
                    ...base,
                    target: OldTargetType.Single,
                    range: metadata.range ?? 0
                }
            case OldTargetType.Touch:
                return {
                    ...base,
                    target: OldTargetType.Touch
                }
        }
    }

    private toCharges(charges: number[] = [], chargesReset?: OldRestType): Record<string, IChargesData> {
        const result: Record<string, IChargesData> = {}
        if (charges.length > 1) {
            let prevIndex: number = -1
            for (let i = 0; i < charges.length; i++) {
                const charge = asNumber(charges[i], 0)
                if (charge === undefined || charge === 0) {
                    continue
                }

                if (prevIndex === 0) {
                    result[prevIndex] = { ...result[prevIndex], condition: { leq: [{ property: 'level' }, i] } }
                } else if (prevIndex !== -1) {
                    result[prevIndex] = { ...result[prevIndex], condition: { range: [prevIndex + 1, { property: 'level' }, i] } }
                }
                prevIndex = i
                result[i] = {
                    chargesReset: asEnum(chargesReset, RestType) ?? RestType.None,
                    charges: { [ScalingType.Constant]: charge },
                    condition: {}
                }
            }
            if (prevIndex > 0) {
                result[prevIndex] = { ...result[prevIndex], condition: { geq: [{ property: 'level' }, prevIndex + 1] } }
            }
        }
        return result
    }

    private toCondition(data: ICreatureActionData): IEffectCondition {
        switch (data.condition ?? EffectCondition.Hit) {
            case EffectCondition.Hit:
                return {
                    type: EffectConditionType.Hit,
                    scaling: this.toScaling(data.conditionScaling, data.conditionProficiency, data.conditionModifier)
                }
            case EffectCondition.Save:
                return {
                    type: EffectConditionType.Save,
                    attribute: asEnum(data.saveAttr, Attribute, Attribute.STR),
                    scaling: this.toScaling(data.conditionScaling, data.conditionProficiency, data.conditionModifier)
                }
            case EffectCondition.None:
                return { type: EffectConditionType.None }
        }
    }

    private toScaling(type: OldScalingType = OldScalingType.None, proficiency: boolean = false, modifier?: IOptionType<number>): Partial<Record<ScalingType, number>> {
        const result: Partial<Record<ScalingType, number>> = {}
        switch (modifier?.type) {
            case CalculationMode.Auto:
                break
            case CalculationMode.Modify:
                result.constant = asNumber(modifier.value, 0)
                break
            case CalculationMode.Override:
                return { constant: asNumber(modifier.value, 0) }
        }
        if (proficiency) {
            result.proficiency = 1
        }
        if (type !== OldScalingType.None) {
            const v = asEnum(type, ScalingType)
            if (v !== null) {
                result[v] = 1
            }
        }
        return result
    }

    private toEffects(effects: IOldEffect[] = []): Record<string, IEffect> {
        const result: Record<string, IEffect> = {}
        for (const effect of effects) {
            if (effect.damageType === undefined || effect.damageType === DamageType.None) {
                result[effect.id] = {
                    type: EffectType.Text,
                    label: asString(effect.label, ''),
                    text: asString(effect.text, ''),
                    condition: {}
                }
            } else {
                result[effect.id] = {
                    type: EffectType.Damage,
                    label: asString(effect.label, ''),
                    category: EffectCategory.Uncategorized,
                    damageType: effect.damageType,
                    scaling: this.toScaling(effect.scaling, effect.proficiency, effect.modifier), // TODO: scalingModifiers not converted
                    die: this.convertDiceType(effect.dice),
                    dieCount: { [ScalingType.Constant]: asNumber(effect.diceNum, 1) },
                    condition: {}
                }
            }
        }
        return result
    }

    private toArea(area: AreaType = AreaType.None, areaSize?: number, areaHeight?: number): IArea {
        switch (area) {
            case AreaType.None:
                return { type: AreaType.None }
            case AreaType.Line:
                return { type: AreaType.Line, length: asNumber(areaSize, 0) }
            case AreaType.Cone:
                return { type: AreaType.Cone, side: asNumber(areaSize, 0) }
            case AreaType.Square:
                return { type: AreaType.Square, side: asNumber(areaSize, 0) }
            case AreaType.Rectangle:
                return { type: AreaType.Rectangle, length: asNumber(areaSize, 0), width: asNumber(areaHeight, 0) }
            case AreaType.Cube:
                return { type: AreaType.Cube, side: asNumber(areaSize, 0) }
            case AreaType.Cuboid:
                return { type: AreaType.Cuboid, length: asNumber(areaSize, 0), width: asNumber(areaSize, 0), height: asNumber(areaHeight, 0) }
            case AreaType.Sphere:
                return { type: AreaType.Sphere, radius: asNumber(areaSize, 0) }
            case AreaType.Cylinder:
                return { type: AreaType.Cylinder, radius: asNumber(areaSize, 0), height: asNumber(areaHeight, 0) }
        }
    }

    private convertDiceType(type?: DiceType | number | string): DieType {
        switch (type) {
            case 0:
            case '0':
                return DieType.None
            case 4:
            case '4':
                return DieType.D4
            case 6:
            case '6':
                return DieType.D6
            case 8:
            case '8':
                return DieType.D8
            case 10:
            case '10':
                return DieType.D10
            case 12:
            case '12':
                return DieType.D12
            case 20:
            case '20':
                return DieType.D20
            case 100:
            case '100':
                return DieType.D100
            default:
                return DieType.DX
        }
    }

    private convertGender(type?: Gender): string {
        switch (type ?? Gender.Male) {
            case Gender.Female:
                return 'Female'
            case Gender.Male:
                return 'Male'
            default:
                return ''
        }
    }

    private convertOptionType(option?: IOptionType<number>): CalcValue {
        switch (option?.type) {
            case CalculationMode.Modify:
                return { mode: CalcMode.Modify, value: asNumber(option.value, 0) }
            case CalculationMode.Override:
                return { mode: CalcMode.Override, value: option.value ?? 0 }
            case CalculationMode.Auto:
            default:
                return { mode: CalcMode.Auto }
        }
    }

    private convertArmorType(type: OldArmorType): ArmorType {
        switch (type) {
            case OldArmorType.Heavy:
                return ArmorType.Heavy
            case OldArmorType.Light:
                return ArmorType.Light
            case OldArmorType.Medium:
                return ArmorType.Medium
            case OldArmorType.Shields:
                return ArmorType.Shield
        }
    }
}

export default DebugHandler
