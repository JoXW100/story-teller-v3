import type CharacterData from './data'
import type CharacterStorage from './storage'
import type RaceData from '../race/data'
import type SubraceData from '../subrace/data'
import type ClassData from '../class/data'
import type SubclassData from '../subclass/data'
import type Modifier from '../modifier/modifier'
import type { ItemData } from '../item/factory'
import CreatureFacade from '../creature/facade'
import { LevelModifyType, resolveAggregateClassDataSpellInfo } from '../class/levelData'
import type ClassLevelData from '../class/levelData'
import { SourceType } from '../modifier/modifier'
import ItemArmorData from '../item/armor'
import { asNumber, isKeyOf, keysOf } from 'utils'
import { getMaxProficiencyLevel, getPreviousClassLevels } from 'utils/calculations'
import type { TranslationHandler } from 'utils/hooks/localization'
import { type ClassLevel, type CreatureType, type Language, type SizeType, ArmorType, MovementType, Sense, SpellLevel, type Attribute, type ProficiencyLevel, type ToolType, type WeaponTypeValue, OptionalAttribute, AdvantageBinding, ProficiencyLevelBasic, type SpellPreparationType } from 'structure/dnd'
import type { ObjectId } from 'types'
import type { ICharacterData } from 'types/database/files/character'
import type { IProperties } from 'types/editor'
import type { ISourceBinding } from 'types/database/files/creature'

class CharacterFacade extends CreatureFacade implements ICharacterData {
    public override readonly data: CharacterData
    public override readonly storage: CharacterStorage
    public readonly raceData: RaceData | null
    public readonly subraceData: SubraceData | null
    public readonly classesData: Record<ObjectId, ClassData>
    public readonly subclassesData: Record<ObjectId, SubclassData>
    public readonly itemsData: Record<ObjectId, ItemData>

    constructor(data: CharacterData, storage: CharacterStorage, modifier: Modifier, translator: TranslationHandler, properties?: IProperties, raceData: RaceData | null = null, subraceData: SubraceData | null = null, classesData: Record<ObjectId, ClassData> = {}, subclassesData: Record<ObjectId, SubclassData> = {}, itemsData: Record<ObjectId, ItemData> = {}) {
        super(data, storage, modifier, translator, properties)
        this.data = data
        this.storage = storage
        this.raceData = raceData
        this.subraceData = subraceData
        this.classesData = classesData
        this.subclassesData = subclassesData
        this.itemsData = itemsData

        let bonus = 0
        for (const key of keysOf(this.storage.inventory)) {
            const data = this.storage.inventory[key]
            if (!data.equipped) {
                continue
            }
            const item = this.itemsData[key]
            if (item instanceof ItemArmorData) {
                switch (item.subtype) {
                    case ArmorType.Light:
                        this.armorLevel = 1
                        this.armorAC = item.ac
                        break
                    case ArmorType.Medium:
                        this.armorLevel = 2
                        this.armorAC = item.ac
                        break
                    case ArmorType.Heavy:
                        this.armorLevel = 3
                        this.armorAC = item.ac
                        break
                    case ArmorType.Shield:
                        this.shieldLevel = 1
                        bonus += item.ac
                        break
                }
            }
        }
        this.armorAC += bonus
    }

    public get hasClass(): boolean {
        return Object.keys(this.data.classes).length > 0
    }

    public override get type(): CreatureType {
        return this.raceData !== null ? this.raceData.type : super.type
    }

    public override get size(): SizeType {
        if (this.raceData === null) {
            return this.modifier.size.call(this.data.size, this.properties, this.storage.choices)
        } else {
            return this.modifier.size.call(this.raceData.size, this.properties, this.storage.choices)
        }
    }

    public override get level(): number {
        if (this.hasClass) {
            let sum: number = 0
            for (const level of Object.values(this.classes)) {
                sum += Number(level)
            }
            return sum
        } else {
            return this.data.level
        }
    }

    public get speed(): Partial<Record<MovementType, number>> {
        const result: Partial<Record<MovementType, number>> = {}
        for (const type of Object.values(MovementType)) {
            const value = this.modifier.speeds[type].call(asNumber(this.data.speed[type], 0) + asNumber(this.raceData?.speed[type], 0), this.properties, this.storage.choices)
            if (value > 0) {
                result[type] = value
            }
        }
        return result
    }

    public override get senses(): Partial<Record<Sense, number>> {
        const result: Partial<Record<Sense, number>> = {}
        for (const sense of Object.values(Sense)) {
            const value = this.modifier.senses[sense].call(asNumber(this.data.senses[sense], 0) + asNumber(this.raceData?.senses[sense], 0), this.properties, this.storage.choices)
            if (value > 0) {
                result[sense] = value
            }
        }
        return result
    }

    public get gender(): string {
        return this.data.gender
    }

    public get age(): string {
        return this.data.age
    }

    public get height(): string {
        return this.data.height
    }

    public get weight(): string {
        return this.data.weight
    }

    public get race(): ObjectId | null {
        return this.data.race
    }

    public get subrace(): ObjectId | null {
        return this.data.subrace
    }

    public get raceName(): string {
        if (this.subraceData !== null) {
            return this.subraceData.name
        } else if (this.raceData !== null) {
            return this.raceData.name
        } else {
            return this.data.raceName
        }
    }

    public get className(): string {
        return keysOf(this.classesData).map((key) => `${this.classesData[key].name} (${this.classes[key] ?? 0})`).join(', ')
    }

    public get namePlateText(): string {
        const texts: string[] = []
        const gender = this.gender
        const raceName = this.raceName
        if (gender.length > 0) {
            texts.push(gender)
        }
        if (raceName.length > 0) {
            texts.push(raceName)
        }
        return texts.join(' ')
    }

    public override get proficienciesLanguage(): Partial<Record<Language, ProficiencyLevelBasic>> {
        if (this.raceData === null) {
            return this.modifier.proficienciesLanguage.call({ ...this.data.proficienciesLanguage }, this.properties, this.storage.choices)
        } else {
            return this.modifier.proficienciesLanguage.call({ ...this.raceData.languages, ...this.data.proficienciesLanguage }, this.properties, this.storage.choices)
        }
    }

    public get isNotProficientInEquippedArmor(): boolean {
        return (this.armorLevel === 1 && this.proficienciesArmor[ArmorType.Light] !== ProficiencyLevelBasic.Proficient) ||
        (this.armorLevel === 2 && this.proficienciesArmor[ArmorType.Medium] !== ProficiencyLevelBasic.Proficient) ||
        (this.armorLevel === 3 && this.proficienciesArmor[ArmorType.Heavy] !== ProficiencyLevelBasic.Proficient) ||
        (this.shieldLevel > 0 && this.proficienciesArmor[ArmorType.Shield] !== ProficiencyLevelBasic.Proficient)
    }

    public override get disadvantages(): Partial<Record<AdvantageBinding, readonly ISourceBinding[]>> {
        const value = { ...this.data.disadvantages }
        if (this.isNotProficientInEquippedArmor) {
            const source = { source: null, description: 'Not proficient in Equipped Armor' }
            value[AdvantageBinding.Checks] = [...(value[AdvantageBinding.Checks] ?? []), source]
            value[AdvantageBinding.Saves] = [...(value[AdvantageBinding.Saves] ?? []), source]
            value[AdvantageBinding.Attack] = [...(value[AdvantageBinding.Attack] ?? []), source]
        }
        return this.modifier.disadvantages.call(value, this.properties, this.storage.choices)
    }

    public override get proficienciesSave(): Partial<Record<Attribute, ProficiencyLevel>> {
        const proficiencies = { ...this.data.proficienciesSave }
        for (const id of keysOf(this.data.classes)) {
            if (id in this.classesData) {
                const classData = this.classesData[id]
                for (const key of keysOf(classData.proficienciesSave)) {
                    proficiencies[key] = getMaxProficiencyLevel(proficiencies[key], classData.proficienciesSave[key])
                }
            }
        }
        return this.modifier.proficienciesSave.call(proficiencies, this.properties, this.storage.choices)
    }

    public override get proficienciesTool(): Partial<Record<ToolType, ProficiencyLevel>> {
        const proficiencies = { ...this.data.proficienciesTool }
        for (const id of keysOf(this.data.classes)) {
            if (id in this.classesData) {
                const classData = this.classesData[id]
                for (const key of keysOf(classData.proficienciesTool)) {
                    proficiencies[key] = getMaxProficiencyLevel(proficiencies[key], classData.proficienciesTool[key])
                }
            }
        }
        return this.modifier.proficienciesTool.call(proficiencies, this.properties, this.storage.choices)
    }

    public override get proficienciesArmor(): Partial<Record<ArmorType, ProficiencyLevelBasic>> {
        const proficiencies = { ...this.data.proficienciesArmor }
        for (const id of keysOf(this.data.classes)) {
            if (id in this.classesData) {
                const classData = this.classesData[id]
                for (const key of keysOf(classData.proficienciesArmor)) {
                    proficiencies[key] = getMaxProficiencyLevel(proficiencies[key], classData.proficienciesArmor[key]) as ProficiencyLevelBasic
                }
            }
        }
        return this.modifier.proficienciesArmor.call(proficiencies, this.properties, this.storage.choices)
    }

    public override get proficienciesWeapon(): Partial<Record<WeaponTypeValue, ProficiencyLevelBasic>> {
        const proficiencies = { ...this.data.proficienciesWeapon }
        for (const id of keysOf(this.data.classes)) {
            if (id in this.classesData) {
                const classData = this.classesData[id]
                for (const key of keysOf(classData.proficienciesWeapon)) {
                    proficiencies[key] = getMaxProficiencyLevel(proficiencies[key], classData.proficienciesWeapon[key]) as ProficiencyLevelBasic
                }
            }
        }
        return this.modifier.proficienciesWeapon.call(proficiencies, this.properties, this.storage.choices)
    }

    public get classes(): Record<ObjectId, ClassLevel> {
        return this.data.classes
    }

    public get subclasses(): Record<ObjectId, ObjectId> {
        return this.data.subclasses
    }

    public get cantripSlots(): number {
        return this.spellSlots[SpellLevel.Cantrip] ?? 0
    }

    /*
    public override get abilities(): Array<ObjectId | string> {
        const abilities: Array<ObjectId | string> = [...this.data.abilities]
        if (this.raceData !== null) {
            for (const ability of this.raceData.abilities) {
                abilities.push(ability)
            }
        }
        if (this.subraceData !== null) {
            for (const ability of this.subraceData.abilities) {
                abilities.push(ability)
            }
        }
        for (const id of keysOf(this.data.classes)) {
            const classLevel = this.data.classes[id]
            const classData = this.classesData[id]
            for (const level of getPreviousClassLevels(classLevel)) {
                for (const ability of classData.levels[level].abilities) {
                    abilities.push(ability)
                }
            }
        }
        for (const id of keysOf(this.subclasses)) {
            const subclassData = this.subclassesData[id]
            const subclassLevel = this.data.classes[subclassData.parentFile!]
            for (const level of getPreviousClassLevels(subclassLevel)) {
                for (const ability of subclassData.levels[level].abilities) {
                    abilities.push(ability)
                }
            }
        }
        return abilities
    }

    public get spells(): Record<ObjectId, OptionalAttribute> {
        return this.modifier.spells.call({ ...this.data.spells }, this.properties, this.storage.choices)
    }
    */

    public get attunementSlots(): number {
        return this.modifier.attunementSlots.call(this.data.attunementSlots, this.properties, this.storage.choices)
    }

    public override get attunedItems(): number {
        return this.storage.attunement.length
    }

    public getClassSpellAttribute(classId: ObjectId): OptionalAttribute {
        if (this.isNotProficientInEquippedArmor) {
            return OptionalAttribute.None
        }
        let result: OptionalAttribute = OptionalAttribute.None
        for (const levelData of this.getClassLevelData(classId)) {
            if (levelData.spellAttribute !== OptionalAttribute.None) {
                result = levelData.spellAttribute
            }
        }
        return result
    }

    public getClassSpellSlots(classId: ObjectId): Partial<Record<SpellLevel, number>> {
        let result: Partial<Record<SpellLevel, number>> = {}
        for (const levelData of this.getClassLevelData(classId)) {
            switch (levelData.type) {
                case LevelModifyType.Add: {
                    for (const spellLevel of keysOf(levelData.spellSlots)) {
                        result[spellLevel] = (result[spellLevel] ?? 0) + (levelData.spellSlots[spellLevel] ?? 0)
                    }
                    break
                }
                case LevelModifyType.Replace: {
                    result = { ...levelData.spellSlots }
                    break
                }
            }
        }
        return result
    }

    public getClassSpellSlotInfo(classId: ObjectId): [learnedSlots: number, preparationSlots: number, spellSlots: Partial<Record<SpellLevel, number>>, maxSpellLevel: SpellLevel] {
        let [learnedSlots, preparationSlots, spellSlots, maxSpellLevel] = resolveAggregateClassDataSpellInfo(this.getClassLevelData(classId))
        if (classId in this.classesData) {
            const classData = this.classesData[classId]
            learnedSlots += this.getAttributeModifier(classData.learnedSlotsScaling)
            preparationSlots += this.getAttributeModifier(classData.preparationSlotsScaling)
        }
        return [learnedSlots, preparationSlots, spellSlots, maxSpellLevel]
    }

    public override getClassLevel(key: string): number {
        const source = this.modifier.findSourceOfType(key, SourceType.Class)
        if (source !== null && isKeyOf(source.key, this.data.classes)) {
            return asNumber(this.data.classes[source.key], 0)
        }
        return 0
    }

    protected getClassLevelData(classId: ObjectId): ClassLevelData[] {
        if (!(classId in this.classesData)) {
            return []
        }
        const classLevel = this.classes[classId]
        const classData = this.classesData[classId]
        const levels = getPreviousClassLevels(classLevel)
        const subclassData = classId in this.subclasses && asNumber(classLevel, 0) >= asNumber(classData.subclassLevel, 0)
            ? this.subclassesData[this.subclasses[classId]] ?? null
            : null
        const result: ClassLevelData[] = []
        for (const level of levels) {
            result.push(classData.levels[level])
            if (subclassData !== null) {
                result.push(subclassData.levels[level])
            }
        }
        return result
    }

    public getSpellPreparations(): Record<ObjectId, Record<ObjectId, SpellPreparationType>> {
        return this.modifier.classSpells.call({ ...this.storage.spellPreparations }, this.properties, this.storage.choices)
    }
}

export default CharacterFacade
