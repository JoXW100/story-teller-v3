import type CreatureData from './data'
import type CreatureStorage from './storage'
import type Modifier from '../modifier/modifier'
import { keysOf } from 'utils'
import { getProficiencyLevelValue } from 'utils/calculations'
import { getOptionType } from 'structure/optionData'
import { type Alignment, type ArmorType, Attribute, type CreatureType, type Language, type MovementType, OptionalAttribute, ProficiencyLevel, type Sense, type SizeType, type ToolType, type WeaponType, Skill, type AdvantageBinding, ProficiencyLevelBasic, type DamageBinding, type ConditionBinding, type SpellLevel } from 'structure/dnd'
import { CalcMode, type ICalcValue } from 'structure/database'
import { type DieType } from 'structure/dice'
import { Die } from 'structure/dice/die'
import type { ObjectId } from 'types'
import type { ICreatureStats } from 'types/editor'
import type { ICreatureData, ISourceBinding } from 'types/database/files/creature'
import type { IConditionProperties } from 'types/database/condition'

class CreatureFacade implements ICreatureData {
    public readonly data: CreatureData
    public readonly storage: CreatureStorage
    public readonly modifier: Modifier
    public readonly properties: Partial<IConditionProperties>

    constructor(data: CreatureData, storage: CreatureStorage, modifier: Modifier, properties: Partial<IConditionProperties> = {}) {
        this.data = data
        this.storage = storage
        this.modifier = modifier
        this.properties = properties
    }

    public get name(): string {
        return this.data.name
    }

    public get description(): string {
        return this.data.description
    }

    public get portrait(): string {
        return this.data.portrait
    }

    public get size(): SizeType {
        return this.modifier.size.call(this.data.size, this.properties, this.storage.choices)
    }

    public get sizeText(): string {
        return getOptionType('size').options[this.size]
    }

    public get type(): CreatureType {
        return this.data.type
    }

    public get typeText(): string {
        return getOptionType('creatureType').options[this.type]
    }

    public get alignment(): Alignment {
        return this.data.alignment
    }

    public get alignmentText(): string {
        return getOptionType('alignment').options[this.alignment]
    }

    public get ac(): ICalcValue {
        return this.data.ac
    }

    public get acValue(): number {
        switch (this.ac.mode) {
            case CalcMode.Override:
                return this.ac.value ?? 0
            case CalcMode.Auto:
                return this.modifier.ac.call(10 + this.getAttributeModifier(Attribute.DEX), this.properties, this.storage.choices)
            case CalcMode.Modify:
                return this.modifier.ac.call(10 + this.getAttributeModifier(Attribute.DEX) + (this.ac.value ?? 0), this.properties, this.storage.choices)
        }
    }

    public get health(): ICalcValue {
        return this.data.ac
    }

    public get hitDie(): DieType {
        return this.data.hitDie
    }

    public get level(): number {
        return this.data.level
    }

    public get healthValue(): number {
        switch (this.health.mode) {
            case CalcMode.Override:
                return this.health.value ?? 0
            case CalcMode.Auto:
                return Math.floor(Die.average(this.hitDie) * this.level) + this.getAttributeModifier(Attribute.CON) * this.level
            case CalcMode.Modify:
                return Math.floor(Die.average(this.hitDie) * this.level) + this.getAttributeModifier(Attribute.CON) * this.level + (this.health.value ?? 0)
        }
    }

    public get healthRoll(): string {
        switch (this.health.mode) {
            case CalcMode.Override:
                return String(this.health.value ?? 0)
            case CalcMode.Auto:
                return `${this.level}${this.hitDie}+${this.getAttributeModifier(Attribute.CON) * this.level}`
            case CalcMode.Modify:
                return `${this.level}${this.hitDie}+${this.getAttributeModifier(Attribute.CON) * this.level + (this.health.value ?? 0)}`
        }
    }

    public get proficiency(): ICalcValue {
        return this.data.proficiency
    }

    public get proficiencyValue(): number {
        switch (this.proficiency.mode) {
            case CalcMode.Override:
                return this.proficiency.value ?? 0
            case CalcMode.Auto:
                return Math.floor((this.level + 7) / 4)
            case CalcMode.Modify:
                return Math.floor((this.level + 7) / 4) + (this.proficiency.value ?? 0)
        }
    }

    public get initiative(): ICalcValue {
        return this.data.initiative
    }

    public get initiativeValue(): number {
        switch (this.initiative.mode) {
            case CalcMode.Override:
                return this.initiative.value ?? 0
            case CalcMode.Auto:
                return this.getAttributeModifier(Attribute.DEX)
            case CalcMode.Modify:
                return this.getAttributeModifier(Attribute.DEX) + (this.initiative.value ?? 0)
        }
    }

    public get challenge(): number {
        return this.data.challenge
    }

    public get xp(): number {
        return this.data.xp
    }

    public get challengeText(): string {
        const fraction: string = this.challenge > 0
            ? (this.challenge < 1
                ? `1/${Math.floor(1 / this.challenge)}`
                : String(this.challenge))
            : '0'
        return `${fraction} (${this.xp} XP)`
    }

    public get speed(): Partial<Record<MovementType, number>> {
        return this.data.speed
    }

    public get speedAsText(): string {
        const options = getOptionType('movement').options
        const speed = this.speed
        const types = keysOf(speed)
        let text = ''
        for (let i = 0; i < types.length; i++) {
            text += `${options[types[i]]} ${speed[types[i]]}ft`
            if (i < types.length - 1) {
                text += ', '
            }
        }
        return text
    }

    public get senses(): Partial<Record<Sense, number>> {
        return this.modifier.senses.call(this.data.senses, this.properties, this.storage.choices)
    }

    public get sensesAsText(): string {
        const options = getOptionType('sense').options
        const senses = this.senses
        const types = keysOf(senses)
        let text = ''
        for (let i = 0; i < types.length; i++) {
            text += `${options[types[i]]} ${senses[types[i]]}ft`
            if (i < types.length - 1) {
                text += ', '
            }
        }
        return text
    }

    public get str(): number {
        return this.modifier.str.call(this.data.str, this.properties, this.storage.choices)
    }

    public get dex(): number {
        return this.modifier.dex.call(this.data.dex, this.properties, this.storage.choices)
    }

    public get con(): number {
        return this.modifier.con.call(this.data.con, this.properties, this.storage.choices)
    }

    public get int(): number {
        return this.modifier.int.call(this.data.int, this.properties, this.storage.choices)
    }

    public get wis(): number {
        return this.modifier.wis.call(this.data.wis, this.properties, this.storage.choices)
    }

    public get cha(): number {
        return this.modifier.cha.call(this.data.cha, this.properties, this.storage.choices)
    }

    public get passivePerception(): ICalcValue {
        return this.data.passivePerception
    }

    public get passivePerceptionValue(): number {
        const proficiency = getProficiencyLevelValue(ProficiencyLevel.None)
        switch (this.passivePerception.mode) {
            case CalcMode.Override:
                return this.passivePerception.value ?? 0
            case CalcMode.Auto:
                return 10 + this.getAttributeModifier(Attribute.WIS) + proficiency * this.proficiencyValue
            case CalcMode.Modify:
                return 10 + this.getAttributeModifier(Attribute.WIS) + proficiency * this.proficiencyValue + (this.passivePerception.value ?? 0)
        }
    }

    public get passiveInvestigation(): ICalcValue {
        return this.data.passiveInvestigation
    }

    public get passiveInvestigationValue(): number {
        const proficiency = getProficiencyLevelValue(ProficiencyLevel.None)
        switch (this.passiveInvestigation.mode) {
            case CalcMode.Override:
                return this.passiveInvestigation.value ?? 0
            case CalcMode.Auto:
                return 10 + this.getAttributeModifier(Attribute.INT) + proficiency * this.proficiencyValue
            case CalcMode.Modify:
                return 10 + this.getAttributeModifier(Attribute.INT) + proficiency * this.proficiencyValue + (this.passiveInvestigation.value ?? 0)
        }
    }

    public get passiveInsight(): ICalcValue {
        return this.data.passiveInsight
    }

    public get passiveInsightValue(): number {
        const proficiency = getProficiencyLevelValue(ProficiencyLevel.None)
        switch (this.passiveInsight.mode) {
            case CalcMode.Override:
                return this.passiveInsight.value ?? 0
            case CalcMode.Auto:
                return 10 + this.getAttributeModifier(Attribute.WIS) + proficiency * this.proficiencyValue
            case CalcMode.Modify:
                return 10 + this.getAttributeModifier(Attribute.WIS) + proficiency * this.proficiencyValue + (this.passiveInsight.value ?? 0)
        }
    }

    public get advantages(): Partial<Record<AdvantageBinding, readonly ISourceBinding[]>> {
        return this.modifier.advantages.call(this.data.advantages, this.properties, this.storage.choices)
    }

    public get disadvantages(): Partial<Record<AdvantageBinding, readonly ISourceBinding[]>> {
        return this.modifier.disadvantages.call(this.data.disadvantages, this.properties, this.storage.choices)
    }

    public get resistances(): Partial<Record<DamageBinding, readonly ISourceBinding[]>> {
        return this.modifier.resistances.call(this.data.resistances, this.properties, this.storage.choices)
    }

    public get vulnerabilities(): Partial<Record<DamageBinding, readonly ISourceBinding[]>> {
        return this.modifier.vulnerabilities.call(this.data.vulnerabilities, this.properties, this.storage.choices)
    }

    public get damageImmunities(): Partial<Record<DamageBinding, readonly ISourceBinding[]>> {
        return this.modifier.damageImmunities.call(this.data.damageImmunities, this.properties, this.storage.choices)
    }

    public get conditionImmunities(): Partial<Record<ConditionBinding, readonly ISourceBinding[]>> {
        return this.modifier.conditionImmunities.call(this.data.conditionImmunities, this.properties, this.storage.choices)
    }

    public get spellAttribute(): OptionalAttribute {
        return this.modifier.spellAttribute.call(this.data.spellAttribute, this.properties, this.storage.choices)
    }

    public get spellAttributeValue(): number {
        return this.getAttributeModifier(this.spellAttribute)
    }

    public get spellAttackModifier(): number {
        return this.getAttributeModifier(this.spellAttribute) + this.proficiencyValue
    }

    public get spellSaveModifier(): number {
        return this.getAttributeModifier(this.spellAttribute) + this.proficiencyValue + 8
    }

    public get spellSlots(): Partial<Record<SpellLevel, number>> {
        return this.data.spellSlots
    }

    public get casterLevel(): ICalcValue {
        return this.data.casterLevel
    }

    public get casterLevelValue (): number {
        switch (this.casterLevel.mode) {
            case CalcMode.Override:
                return this.casterLevel.value ?? 0
            case CalcMode.Auto:
                return this.level
            case CalcMode.Modify:
                return this.level + (this.casterLevel.value ?? 0)
        }
    }

    public get proficienciesSkill(): Partial<Record<Skill, ProficiencyLevel>> {
        return this.modifier.proficienciesSkill.call(this.data.proficienciesSkill, this.properties, this.storage.choices)
    }

    public get proficienciesSave(): Partial<Record<Attribute, ProficiencyLevel>> {
        return this.modifier.proficienciesSave.call(this.data.proficienciesSave, this.properties, this.storage.choices)
    }

    public get proficienciesTool(): Partial<Record<ToolType, ProficiencyLevel>> {
        return this.modifier.proficienciesTool.call(this.data.proficienciesTool, this.properties, this.storage.choices)
    }

    public get proficienciesToolText(): string {
        const proficiencies = this.proficienciesTool
        return keysOf(proficiencies)
            .filter((type) => proficiencies[type] !== ProficiencyLevelBasic.None)
            .map((type) => getOptionType('tool').options[type])
            .join(', ')
    }

    public get proficienciesLanguage(): Partial<Record<Language, ProficiencyLevelBasic>> {
        return this.modifier.proficienciesLanguage.call(this.data.proficienciesLanguage, this.properties, this.storage.choices)
    }

    public get proficienciesLanguageText(): string {
        const proficiencies = this.proficienciesLanguage
        return keysOf(proficiencies)
            .filter((type) => proficiencies[type] === ProficiencyLevelBasic.Proficient)
            .map((type) => getOptionType('language').options[type])
            .join(', ')
    }

    public get proficienciesArmor(): Partial<Record<ArmorType, ProficiencyLevelBasic>> {
        return this.modifier.proficienciesArmor.call(this.data.proficienciesArmor, this.properties, this.storage.choices)
    }

    public get proficienciesArmorText(): string {
        const proficiencies = this.proficienciesArmor
        return keysOf(proficiencies)
            .filter((type) => proficiencies[type] === ProficiencyLevelBasic.Proficient)
            .map((type) => getOptionType('armor').options[type])
            .join(', ')
    }

    public get proficienciesWeapon(): Partial<Record<WeaponType, ProficiencyLevelBasic>> {
        return this.modifier.proficienciesWeapon.call(this.data.proficienciesWeapon, this.properties, this.storage.choices)
    }

    public get proficienciesWeaponText(): string {
        const proficiencies = this.proficienciesWeapon
        return keysOf(proficiencies)
            .filter((type) => proficiencies[type] === ProficiencyLevelBasic.Proficient)
            .map((type) => getOptionType('weaponType').options[type])
            .join(', ')
    }

    public get spells(): ObjectId[] {
        return this.modifier.spells.call(this.data.spells, this.properties, this.storage.choices)
    }

    public get abilities(): Array<ObjectId | string> {
        return this.modifier.abilities.call(this.data.abilities, this.properties, this.storage.choices)
    }

    public getAttributeModifier(attribute: OptionalAttribute): number {
        let value: number = 10
        switch (attribute) {
            case OptionalAttribute.STR:
                value = this.str
                break
            case OptionalAttribute.DEX:
                value = this.dex
                break
            case OptionalAttribute.CON:
                value = this.con
                break
            case OptionalAttribute.INT:
                value = this.int
                break
            case OptionalAttribute.WIS:
                value = this.wis
                break
            case OptionalAttribute.CHA:
                value = this.cha
                break
            case OptionalAttribute.None:
            default:
                return 0
        }
        return Math.ceil((value - 11) / 2.0)
    }

    public getSaveModifier (attribute: Attribute | OptionalAttribute): number {
        const mod = attribute in this.proficienciesSave
            ? this.proficiencyValue
            : 0
        return this.getAttributeModifier(attribute) + mod
    }

    public getSkillAttribute(skill: Skill): Attribute {
        switch (skill) {
            case Skill.Athletics:
                return Attribute.STR
            case Skill.Acrobatics:
            case Skill.SleightOfHand:
            case Skill.Stealth:
                return Attribute.DEX
            case Skill.Arcana:
            case Skill.History:
            case Skill.Investigation:
            case Skill.Nature:
            case Skill.Religion:
                return Attribute.INT
            case Skill.AnimalHandling:
            case Skill.Insight:
            case Skill.Medicine:
            case Skill.Perception:
            case Skill.Survival:
                return Attribute.WIS
            case Skill.Deception:
            case Skill.Intimidation:
            case Skill.Performance:
            case Skill.Persuasion:
                return Attribute.CHA
        }
    }

    public getSkillModifier(skill: Skill): number {
        return this.getAttributeModifier(this.getSkillAttribute(skill)) +
            Math.ceil(this.proficiencyValue * getProficiencyLevelValue(this.proficienciesSkill[skill]))
    }

    public getStats(): ICreatureStats {
        return {
            str: this.str,
            dex: this.dex,
            con: this.con,
            int: this.int,
            wis: this.wis,
            cha: this.cha,
            spellAttribute: this.spellAttribute,
            proficiency: this.proficiencyValue,
            level: this.level,
            casterLevel: this.casterLevelValue,
            multiAttack: 1, // this.multiAttack,
            critRange: 20 // this.critRange
        }
    }

    public createProperties(): IConditionProperties {
        return {
            ...this.getStats(),
            spellLevel: NaN
        }
    }
}

export default CreatureFacade
