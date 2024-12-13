import type Modifier from '../modifier/modifier'
import type ConditionData from '../condition/data'
import type CreatureData from './data'
import type CreatureStorage from './storage'
import { asNumber, keysOf } from 'utils'
import { getProficiencyBonusFromLevel, getProficiencyLevelValue } from 'utils/calculations'
import { type Alignment, type ArmorType, Attribute, type CreatureType, type Language, MovementType, OptionalAttribute, ProficiencyLevel, Sense, type SizeType, type ToolType, type WeaponTypeValue, Skill, type AdvantageBinding, ProficiencyLevelBasic, type DamageBinding, type ConditionBinding, type SpellLevel } from 'structure/dnd'
import { CalcMode, EmptyProperties, type CalcValue } from 'structure/database'
import { type DieType } from 'structure/dice'
import { Die } from 'structure/dice/die'
import type { ObjectId } from 'types'
import type { TranslationHandler } from 'utils/hooks/localization'
import type { IBonusGroup, IProperties } from 'types/editor'
import type { ICreatureData, ISourceBinding } from 'types/database/files/creature'

class CreatureFacade implements ICreatureData {
    public readonly data: CreatureData
    public readonly storage: CreatureStorage
    public readonly modifier: Modifier
    public readonly properties: IProperties
    public readonly translator: TranslationHandler
    public readonly conditions: Record<ObjectId, ConditionData>

    // 0 - none / unarmored / clothing
    // 1 - light
    // 2 - medium
    // 3 - heavy
    protected armorLevel: number = 0
    // 0 - none
    // 1 - light
    // 2 - medium
    // 3 - heavy
    protected shieldLevel: number = 0
    protected armorAC: number = 10

    constructor(data: CreatureData, storage: CreatureStorage, modifier: Modifier, translator: TranslationHandler, properties: IProperties = EmptyProperties, conditions: Record<ObjectId, ConditionData> = {}) {
        this.data = data
        this.storage = storage
        this.modifier = modifier
        this.properties = properties
        this.translator = translator
        this.conditions = conditions
    }

    public get name(): string {
        return this.data.name
    }

    public get description(): string {
        return this.data.description
    }

    public get content(): string {
        return this.data.content
    }

    public get portrait(): string {
        return this.data.portrait
    }

    public get size(): SizeType {
        return this.modifier.size.call(this.data.size, this.properties, this.storage.choices)
    }

    public get sizeText(): string {
        return this.translator(`enum-size-${this.size}`)
    }

    public get type(): CreatureType {
        return this.data.type
    }

    public get typeText(): string {
        return this.translator(`enum-creatureType-${this.type}`)
    }

    public get alignment(): Alignment {
        return this.data.alignment
    }

    public get alignmentText(): string {
        return this.translator(`enum-alignment-${this.alignment}`)
    }

    public get ac(): CalcValue {
        return this.data.ac
    }

    public get acValue(): number {
        switch (this.ac.mode) {
            case CalcMode.Override:
                return this.ac.value ?? 0
            case CalcMode.Auto:
                return this.modifier.ac.call(this.getArmorClassBaseValue(), this.properties, this.storage.choices)
            case CalcMode.Modify:
                return this.modifier.ac.call(this.getArmorClassBaseValue(), this.properties, this.storage.choices) + (this.ac.value ?? 0)
        }
    }

    public get health(): CalcValue {
        return this.data.health
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
                return Math.floor(Die.average(this.hitDie) * this.level) + this.modifier.health.call(this.getAttributeModifier(Attribute.CON) * this.level, this.properties, this.storage.choices)
            case CalcMode.Modify:
                return Math.floor(Die.average(this.hitDie) * this.level) + this.modifier.health.call(this.getAttributeModifier(Attribute.CON) * this.level + (this.health.value ?? 0), this.properties, this.storage.choices)
        }
    }

    public get healthRoll(): string {
        switch (this.health.mode) {
            case CalcMode.Override:
                return String(this.health.value ?? 0)
            case CalcMode.Auto:
                return `${this.level}${this.hitDie}+${this.modifier.health.call(this.getAttributeModifier(Attribute.CON) * this.level, this.properties, this.storage.choices)}`
            case CalcMode.Modify:
                return `${this.level}${this.hitDie}+${this.modifier.health.call(this.getAttributeModifier(Attribute.CON) * this.level + (this.health.value ?? 0), this.properties, this.storage.choices)}`
        }
    }

    public get proficiency(): CalcValue {
        return this.data.proficiency
    }

    public get proficiencyValue(): number {
        switch (this.proficiency.mode) {
            case CalcMode.Override:
                return this.proficiency.value ?? 0
            case CalcMode.Auto:
                return getProficiencyBonusFromLevel(this.level)
            case CalcMode.Modify:
                return getProficiencyBonusFromLevel(this.level) + (this.proficiency.value ?? 0)
        }
    }

    public get initiative(): CalcValue {
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
        const result: Partial<Record<MovementType, number>> = {}
        for (const type of Object.values(MovementType)) {
            const value = this[type]
            if (value > 0) {
                result[type] = value
            }
        }
        return result
    }

    public get walk(): number {
        return this.modifier.speeds[MovementType.Walk].call(asNumber(this.data.speed[MovementType.Walk], 0), this.properties, this.storage.choices)
    }

    public get burrow(): number {
        return this.modifier.speeds[MovementType.Burrow].call(asNumber(this.data.speed[MovementType.Burrow], 0), this.properties, this.storage.choices)
    }

    public get climb(): number {
        return this.modifier.speeds[MovementType.Climb].call(asNumber(this.data.speed[MovementType.Climb], 0), this.properties, this.storage.choices)
    }

    public get fly(): number {
        return this.modifier.speeds[MovementType.Fly].call(asNumber(this.data.speed[MovementType.Fly], 0), this.properties, this.storage.choices)
    }

    public get hover(): number {
        return this.modifier.speeds[MovementType.Hover].call(asNumber(this.data.speed[MovementType.Hover], 0), this.properties, this.storage.choices)
    }

    public get swim(): number {
        return this.modifier.speeds[MovementType.Swim].call(asNumber(this.data.speed[MovementType.Swim], 0), this.properties, this.storage.choices)
    }

    public get speedAsText(): string {
        const speed = this.speed
        return keysOf(speed).map((type) => `${this.translator(`enum-movement-${type}`)} ${speed[type]}ft`).join(', ')
    }

    public get senses(): Partial<Record<Sense, number>> {
        const result: Partial<Record<Sense, number>> = {}
        for (const sense of Object.values(Sense)) {
            const value = this.modifier.senses[sense].call(asNumber(this.data.senses[sense], 0), this.properties, this.storage.choices)
            if (value > 0) {
                result[sense] = value
            }
        }
        return result
    }

    public get sensesAsText(): string {
        const senses = this.senses
        return keysOf(senses).map((type) => `${this.translator(`enum-sense-${type}`)} ${senses[type]}ft`).join(', ')
    }

    public get str(): number {
        return this.modifier.abilityScores.str.call(this.data.str, this.properties, this.storage.choices)
    }

    public get dex(): number {
        return this.modifier.abilityScores.dex.call(this.data.dex, this.properties, this.storage.choices)
    }

    public get con(): number {
        return this.modifier.abilityScores.con.call(this.data.con, this.properties, this.storage.choices)
    }

    public get int(): number {
        return this.modifier.abilityScores.int.call(this.data.int, this.properties, this.storage.choices)
    }

    public get wis(): number {
        return this.modifier.abilityScores.wis.call(this.data.wis, this.properties, this.storage.choices)
    }

    public get cha(): number {
        return this.modifier.abilityScores.cha.call(this.data.cha, this.properties, this.storage.choices)
    }

    public get passivePerception(): CalcValue {
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

    public get passiveInvestigation(): CalcValue {
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

    public get passiveInsight(): CalcValue {
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
        return this.data.spellAttribute
    }

    public getSpellAttributeValue(attribute?: OptionalAttribute): number {
        return this.getAttributeModifier(attribute ?? this.spellAttribute)
    }

    public getSpellAttackModifier(attribute?: OptionalAttribute): number {
        return this.getAttributeModifier(attribute ?? this.spellAttribute) + this.proficiencyValue
    }

    public getSpellSaveModifier(attribute?: OptionalAttribute): number {
        return this.getAttributeModifier(attribute ?? this.spellAttribute) + this.proficiencyValue + 8
    }

    public get spellSlots(): Partial<Record<SpellLevel, number>> {
        return this.data.spellSlots
    }

    public get casterLevel(): CalcValue {
        return this.data.casterLevel
    }

    public get casterLevelValue(): number {
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
            .map((type) => this.translator(`enum-tool-${type}`))
            .join(', ')
    }

    public get proficienciesLanguage(): Partial<Record<Language, ProficiencyLevelBasic>> {
        return this.modifier.proficienciesLanguage.call(this.data.proficienciesLanguage, this.properties, this.storage.choices)
    }

    public get proficienciesLanguageText(): string {
        const proficiencies = this.proficienciesLanguage
        return keysOf(proficiencies)
            .filter((type) => proficiencies[type] === ProficiencyLevelBasic.Proficient)
            .map((type) => this.translator(`enum-language-${type}`))
            .join(', ')
    }

    public get proficienciesArmor(): Partial<Record<ArmorType, ProficiencyLevelBasic>> {
        return this.modifier.proficienciesArmor.call(this.data.proficienciesArmor, this.properties, this.storage.choices)
    }

    public get proficienciesArmorText(): string {
        const proficiencies = this.proficienciesArmor
        return keysOf(proficiencies)
            .filter((type) => proficiencies[type] === ProficiencyLevelBasic.Proficient)
            .map((type) => this.translator(`enum-armor-${type}`))
            .join(', ')
    }

    public get proficienciesWeapon(): Partial<Record<WeaponTypeValue, ProficiencyLevelBasic>> {
        return this.modifier.proficienciesWeapon.call(this.data.proficienciesWeapon, this.properties, this.storage.choices)
    }

    public get proficienciesWeaponText(): string {
        const proficiencies = this.proficienciesWeapon
        return keysOf(proficiencies)
            .filter((type) => proficiencies[type] === ProficiencyLevelBasic.Proficient)
            .map((type) => this.translator(`enum-weaponTypeValue-${type}`))
            .join(', ')
    }

    public get spells(): Record<ObjectId, OptionalAttribute> {
        return this.modifier.spells.call({ ...this.data.spells }, this.properties, this.storage.choices)
    }

    public get abilities(): (ObjectId | string)[] {
        return this.data.abilities
    }

    public get multiAttack(): number {
        return this.modifier.multiAttack.call(1, this.properties, this.storage.choices)
    }

    public get armorLevelValue(): number {
        return this.armorLevel
    }

    public get shieldLevelValue(): number {
        return this.shieldLevel
    }

    public get armorACValue(): number {
        return this.armorAC
    }

    public get critRange(): number {
        return this.modifier.critRange.call(20, this.properties, this.storage.choices)
    }

    public get critDieCount(): number {
        return this.modifier.critDieCount.call(2, this.properties, this.storage.choices)
    }

    public get attunedItems(): number {
        return 0
    }

    public get ritualCaster(): boolean {
        return this.modifier.ritualCaster.call(false, this.properties, this.storage.choices)
    }

    public getArmorClassBaseValue(): number {
        switch (this.armorLevelValue) {
            case 0:
            case 1:
                return this.armorACValue + this.getAttributeModifier(OptionalAttribute.DEX)
            case 2:
                return this.armorACValue + Math.min(2, this.getAttributeModifier(OptionalAttribute.DEX))
            case 3:
            default:
                return this.armorACValue
        }
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

    public getSaveModifier(attribute: OptionalAttribute): number {
        const mod = attribute in this.proficienciesSave
            ? this.proficiencyValue
            : 0
        const result = this.getAttributeModifier(attribute) + mod
        if (attribute === OptionalAttribute.None) {
            return result
        }
        return this.modifier.saves[attribute].call(this.getAttributeModifier(attribute) + mod, this.properties, this.storage.choices)
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
        const result = this.getAttributeModifier(this.getSkillAttribute(skill)) +
            Math.ceil(this.proficiencyValue * getProficiencyLevelValue(this.proficienciesSkill[skill]))
        return this.modifier.skills[skill].call(result, this.properties, this.storage.choices)
    }

    public createProperties(): IProperties {
        return {
            level: this.level,
            casterLevel: this.casterLevelValue,
            classLevel: this.level,
            spellLevel: 0,
            str: this.str,
            dex: this.dex,
            con: this.con,
            int: this.int,
            wis: this.wis,
            cha: this.cha,
            spellAttribute: OptionalAttribute.None,
            proficiency: this.proficiencyValue,
            multiAttack: this.multiAttack,
            critRange: this.critRange,
            critDieCount: this.critDieCount,
            armorLevel: this.armorLevelValue,
            shieldLevel: this.shieldLevelValue,
            walkSpeed: this.walk,
            burrowSpeed: this.burrow,
            climbSpeed: this.climb,
            flySpeed: this.fly,
            hoverSpeed: this.hover,
            swimSpeed: this.swim,
            attunedItems: this.attunedItems
        }
    }

    public getAttackBonuses(): IBonusGroup {
        return {
            bonus: this.modifier.abilityAttackBonus.call(0, this.properties, this.storage.choices),
            meleeBonus: this.modifier.abilityMeleeWeaponAttackBonus.call(0, this.properties, this.storage.choices),
            rangedBonus: this.modifier.abilityRangedWeaponAttackBonus.call(0, this.properties, this.storage.choices),
            thrownBonus: this.modifier.abilityThrownWeaponAttackBonus.call(0, this.properties, this.storage.choices)
        } satisfies IBonusGroup
    }

    public getDamageBonuses(): IBonusGroup {
        return {
            bonus: this.modifier.abilityDamageBonus.call(0, this.properties, this.storage.choices),
            meleeBonus: this.modifier.abilityMeleeWeaponDamageBonus.call(0, this.properties, this.storage.choices),
            rangedBonus: this.modifier.abilityRangedWeaponDamageBonus.call(0, this.properties, this.storage.choices),
            thrownBonus: this.modifier.abilityThrownWeaponDamageBonus.call(0, this.properties, this.storage.choices)
        } satisfies IBonusGroup
    }

    public getClassLevel(_key: string): number {
        return this.level
    }
}

export default CreatureFacade
