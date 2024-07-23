import { type CalcValue, createCalcValue, simplifyCalcValue, simplifyNumberRecord } from 'structure/database'
import { Alignment, CreatureType, SizeType, MovementType, Sense, OptionalAttribute, AdvantageBinding, ConditionBinding, DamageBinding, SpellLevel, Attribute, ProficiencyLevel, Skill, ToolType, Language, ArmorType, WeaponTypeValue, ProficiencyLevelBasic } from 'structure/dnd'
import { DieType } from 'structure/dice'
import EmptyToken from 'structure/language/tokens/empty'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import { asEnum, asNumber, isCalcValue, isEnum, isNumber, isObjectId, isObjectIdOrNull, isRecord, isString, isURLString, keysOf } from 'utils'
import { isValidAbilityFormat } from 'utils/importers/stringFormatAbilityImporter'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ICreatureData, ISourceBinding } from 'types/database/files/creature'
import type { TokenContext } from 'types/language'

export function isSourceBinding(value: unknown): value is ISourceBinding {
    return isRecord(value) && isObjectIdOrNull(value.source) && isString(value.description)
}

class CreatureData implements ICreatureData {
    public readonly name: string
    public readonly description: string
    public readonly portrait: string
    // Info
    public readonly size: SizeType
    public readonly type: CreatureType
    public readonly alignment: Alignment
    public readonly challenge: number
    public readonly xp: number
    // Stats
    public readonly level: number
    public readonly hitDie: DieType
    public readonly health: CalcValue
    public readonly ac: CalcValue
    public readonly proficiency: CalcValue
    public readonly initiative: CalcValue
    public readonly speed: Partial<Record<MovementType, number>>
    public readonly senses: Partial<Record<Sense, number>>
    // Attributes
    public readonly str: number
    public readonly dex: number
    public readonly con: number
    public readonly int: number
    public readonly wis: number
    public readonly cha: number
    // Passives
    public readonly passivePerception: CalcValue
    public readonly passiveInvestigation: CalcValue
    public readonly passiveInsight: CalcValue
    // Proficiencies
    public readonly proficienciesSave: Partial<Record<Attribute, ProficiencyLevel>>
    public readonly proficienciesSkill: Partial<Record<Skill, ProficiencyLevel>>
    public readonly proficienciesTool: Partial<Record<ToolType, ProficiencyLevel>>
    public readonly proficienciesLanguage: Partial<Record<Language, ProficiencyLevelBasic>>
    public readonly proficienciesArmor: Partial<Record<ArmorType, ProficiencyLevelBasic>>
    public readonly proficienciesWeapon: Partial<Record<WeaponTypeValue, ProficiencyLevelBasic>>
    // Advantages
    public readonly advantages: Partial<Record<AdvantageBinding, ISourceBinding[]>>
    public readonly disadvantages: Partial<Record<AdvantageBinding, ISourceBinding[]>>
    // Resistances
    public readonly resistances: Partial<Record<DamageBinding, readonly ISourceBinding[]>>
    public readonly vulnerabilities: Partial<Record<DamageBinding, readonly ISourceBinding[]>>
    public readonly damageImmunities: Partial<Record<DamageBinding, readonly ISourceBinding[]>>
    public readonly conditionImmunities: Partial<Record<ConditionBinding, readonly ISourceBinding[]>>
    // Spells
    public readonly spellAttribute: OptionalAttribute
    public readonly casterLevel: CalcValue
    public readonly spellSlots: Partial<Record<SpellLevel, number>>
    public readonly spells: ObjectId[]
    // Other
    public readonly abilities: Array<ObjectId | string>

    public constructor(data: Simplify<ICreatureData>) {
        this.name = data.name ?? CreatureData.properties.name.value
        this.description = data.description ?? CreatureData.properties.description.value
        this.portrait = data.portrait ?? CreatureData.properties.portrait.value
        // Info
        this.size = asEnum(data.size, SizeType) ?? CreatureData.properties.size.value
        this.type = asEnum(data.type, CreatureType) ?? CreatureData.properties.type.value
        this.alignment = asEnum(data.alignment, Alignment) ?? CreatureData.properties.alignment.value
        this.challenge = data.challenge ?? CreatureData.properties.challenge.value
        this.xp = data.xp ?? CreatureData.properties.xp.value
        // Stats
        this.level = asNumber(data.level, CreatureData.properties.level.value)
        this.hitDie = asEnum(data.hitDie, DieType) ?? CreatureData.properties.hitDie.value
        this.health = createCalcValue(data.health)
        this.ac = createCalcValue(data.ac)
        this.proficiency = createCalcValue(data.proficiency)
        this.initiative = createCalcValue(data.initiative)
        this.speed = data.speed ?? CreatureData.properties.speed.value
        this.senses = data.senses ?? CreatureData.properties.senses.value
        // Attributes
        this.str = data.str ?? CreatureData.properties.str.value
        this.dex = data.dex ?? CreatureData.properties.dex.value
        this.con = data.con ?? CreatureData.properties.con.value
        this.int = data.int ?? CreatureData.properties.int.value
        this.wis = data.wis ?? CreatureData.properties.wis.value
        this.cha = data.cha ?? CreatureData.properties.cha.value
        // Passives
        this.passivePerception = createCalcValue(data.passivePerception)
        this.passiveInvestigation = createCalcValue(data.passiveInvestigation)
        this.passiveInsight = createCalcValue(data.passiveInsight)
        // Proficiencies
        this.proficienciesSave = data.proficienciesSave ?? CreatureData.properties.proficienciesSave.value
        this.proficienciesSkill = data.proficienciesSkill ?? CreatureData.properties.proficienciesSkill.value
        this.proficienciesTool = data.proficienciesTool ?? CreatureData.properties.proficienciesTool.value
        this.proficienciesLanguage = data.proficienciesLanguage ?? CreatureData.properties.proficienciesLanguage.value
        this.proficienciesArmor = CreatureData.properties.proficienciesArmor.value
        if (data.proficienciesArmor !== undefined) {
            for (const armorType of keysOf(data.proficienciesArmor)) {
                const value = data.proficienciesArmor[armorType]
                if (isEnum(armorType, ArmorType) && isEnum(value, ProficiencyLevelBasic)) {
                    this.proficienciesArmor[armorType] = value
                }
            }
        }
        this.proficienciesWeapon = data.proficienciesWeapon ?? CreatureData.properties.proficienciesWeapon.value
        // Advantages
        this.advantages = CreatureData.properties.advantages.value
        if (data.advantages !== undefined) {
            for (const key of keysOf(data.advantages)) {
                const bindings = data.advantages[key]
                if (bindings !== undefined) {
                    for (const value of bindings) {
                        if (isSourceBinding(value)) {
                            this.advantages[key] = [...this.advantages[key] ?? [], value]
                        }
                    }
                }
            }
        }
        this.disadvantages = CreatureData.properties.disadvantages.value
        if (data.disadvantages !== undefined) {
            for (const key of keysOf(data.disadvantages)) {
                const bindings = data.disadvantages[key]
                if (bindings !== undefined) {
                    for (const value of bindings) {
                        if (isSourceBinding(value)) {
                            this.disadvantages[key] = [...this.disadvantages[key] ?? [], value]
                        }
                    }
                }
            }
        }
        // Resistances
        this.resistances = CreatureData.properties.resistances.value
        if (data.disadvantages !== undefined) {
            for (const key of keysOf(data.disadvantages)) {
                const bindings = data.disadvantages[key]
                if (bindings !== undefined) {
                    for (const value of bindings) {
                        if (isSourceBinding(value)) {
                            this.disadvantages[key] = [...this.disadvantages[key] ?? [], value]
                        }
                    }
                }
            }
        }
        this.vulnerabilities = CreatureData.properties.vulnerabilities.value
        if (data.vulnerabilities !== undefined) {
            for (const key of keysOf(data.vulnerabilities)) {
                const bindings = data.vulnerabilities[key]
                if (bindings !== undefined) {
                    for (const value of bindings) {
                        if (isSourceBinding(value)) {
                            this.vulnerabilities[key] = [...this.vulnerabilities[key] ?? [], value]
                        }
                    }
                }
            }
        }
        this.damageImmunities = CreatureData.properties.damageImmunities.value
        if (data.damageImmunities !== undefined) {
            for (const key of keysOf(data.damageImmunities)) {
                const bindings = data.damageImmunities[key]
                if (bindings !== undefined) {
                    for (const value of bindings) {
                        if (isSourceBinding(value)) {
                            this.damageImmunities[key] = [...this.damageImmunities[key] ?? [], value]
                        }
                    }
                }
            }
        }
        this.conditionImmunities = CreatureData.properties.conditionImmunities.value
        if (data.conditionImmunities !== undefined) {
            for (const key of keysOf(data.conditionImmunities)) {
                const bindings = data.conditionImmunities[key]
                if (bindings !== undefined) {
                    for (const value of bindings) {
                        if (isSourceBinding(value)) {
                            this.conditionImmunities[key] = [...this.conditionImmunities[key] ?? [], value]
                        }
                    }
                }
            }
        }
        // Spells
        this.spellAttribute = data.spellAttribute ?? CreatureData.properties.spellAttribute.value
        if (this.spellAttribute !== OptionalAttribute.None) {
            this.casterLevel = createCalcValue(data.casterLevel)
            this.spellSlots = CreatureData.properties.spellSlots.value
            if (data.spellSlots !== undefined) {
                for (const level of keysOf(data.spellSlots)) {
                    this.spellSlots[level] = asNumber(data.spellSlots[level], 0)
                }
            }
            this.spells = CreatureData.properties.spells.value
            if (Array.isArray(data.spells)) {
                for (const id of data.spells) {
                    this.spells.push(id as ObjectId)
                }
            }
        } else {
            this.casterLevel = CreatureData.properties.casterLevel.value
            this.spellSlots = CreatureData.properties.spellSlots.value
            this.spells = CreatureData.properties.spells.value
        }
        // Other
        this.abilities = CreatureData.properties.abilities.value
        if (Array.isArray(data.abilities)) {
            for (const id of data.abilities) {
                this.abilities.push(id as string)
            }
        }
    }

    public static properties: DataPropertyMap<ICreatureData, CreatureData> = {
        name: {
            value: '',
            validate: isString
        },
        description: {
            value: '',
            validate: isString
        },
        portrait: {
            value: '',
            validate: (value) => value === null || (isString(value) && isURLString(value))
        },
        // Info
        size: {
            value: SizeType.Medium,
            validate: (value) => isEnum(value, SizeType)
        },
        type: {
            value: CreatureType.Humanoid,
            validate: (value) => isEnum(value, CreatureType)
        },
        alignment: {
            value: Alignment.None,
            validate: (value) => isEnum(value, Alignment)
        },
        challenge: {
            value: 0,
            validate: (value) => isNumber(value) && value >= 0
        },
        xp: {
            value: 0,
            validate: (value) => isNumber(value) && value >= 0
        },
        // Stats
        level: {
            value: 0,
            validate: (value) => isNumber(value) && value >= 0
        },
        hitDie: {
            value: DieType.D8,
            validate: (value) => isEnum(value, DieType)
        },
        health: {
            get value() { return createCalcValue() },
            validate: isCalcValue,
            simplify: simplifyCalcValue
        },
        ac: {
            get value() { return createCalcValue() },
            validate: isCalcValue,
            simplify: simplifyCalcValue
        },
        proficiency: {
            get value() { return createCalcValue() },
            validate: isCalcValue,
            simplify: simplifyCalcValue
        },
        initiative: {
            get value() { return createCalcValue() },
            validate: isCalcValue,
            simplify: simplifyCalcValue
        },
        speed: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, MovementType) && isNumber(value) && value >= 0),
            simplify: simplifyNumberRecord
        },
        senses: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, Sense) && isNumber(value) && value >= 0),
            simplify: simplifyNumberRecord
        },
        // Attributes
        str: {
            value: 10,
            validate: (value) => isNumber(value) && value >= 0
        },
        dex: {
            value: 10,
            validate: (value) => isNumber(value) && value >= 0
        },
        con: {
            value: 10,
            validate: (value) => isNumber(value) && value >= 0
        },
        int: {
            value: 10,
            validate: (value) => isNumber(value) && value >= 0
        },
        wis: {
            value: 10,
            validate: (value) => isNumber(value) && value >= 0
        },
        cha: {
            value: 10,
            validate: (value) => isNumber(value) && value >= 0
        },
        // Passives
        passivePerception: {
            get value() { return createCalcValue() },
            validate: isCalcValue,
            simplify: simplifyCalcValue
        },
        passiveInsight: {
            get value() { return createCalcValue() },
            validate: isCalcValue,
            simplify: simplifyCalcValue
        },
        passiveInvestigation: {
            get value() { return createCalcValue() },
            validate: isCalcValue,
            simplify: simplifyCalcValue
        },
        // Proficiencies
        proficienciesSave: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, Attribute) && isEnum(value, ProficiencyLevel)),
            simplify: (value) => Object.values(value).some((value) => value !== ProficiencyLevel.None) ? value : null
        },
        proficienciesSkill: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, Skill) && isEnum(value, ProficiencyLevel)),
            simplify: (value) => Object.values(value).some((value) => value !== ProficiencyLevel.None) ? value : null
        },
        proficienciesTool: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, ToolType) && isEnum(value, ProficiencyLevel)),
            simplify: (value) => Object.values(value).some((value) => value !== ProficiencyLevel.None) ? value : null
        },
        proficienciesLanguage: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, Language) && isEnum(value, ProficiencyLevelBasic)),
            simplify: (value) => Object.values(value).some((value) => value !== ProficiencyLevelBasic.None) ? value : null
        },
        proficienciesArmor: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, ArmorType) && isEnum(value, ProficiencyLevelBasic)),
            simplify: (value) => Object.values(value).some((value) => value !== ProficiencyLevelBasic.None) ? value : null
        },
        proficienciesWeapon: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, WeaponTypeValue) && isEnum(value, ProficiencyLevelBasic)),
            simplify: (value) => Object.values(value).some((value) => value !== ProficiencyLevelBasic.None) ? value : null
        },
        // Advantages
        advantages: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, AdvantageBinding) && Array.isArray(value) && value.every(isSourceBinding)),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        disadvantages: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, AdvantageBinding) && Array.isArray(value) && value.every(isSourceBinding)),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        // Resistances
        resistances: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, DamageBinding) && Array.isArray(value) && value.every(isSourceBinding)),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        vulnerabilities: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, DamageBinding) && Array.isArray(value) && value.every(isSourceBinding)),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        damageImmunities: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, DamageBinding) && Array.isArray(value) && value.every(isSourceBinding)),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        conditionImmunities: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, value) => isEnum(key, ConditionBinding) && Array.isArray(value) && value.every(isSourceBinding)),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        // Spells
        casterLevel: {
            get value() { return createCalcValue() },
            validate: isCalcValue,
            simplify: simplifyCalcValue
        },
        spellAttribute: {
            value: OptionalAttribute.None,
            validate: (value) => isEnum(value, OptionalAttribute)
        },
        spellSlots: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, SpellLevel) && isNumber(val))
        },
        spells: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every((value) => isObjectId(value) || isValidAbilityFormat(value)),
            simplify: (value) => value.length > 0 ? value : null
        },
        // Other
        abilities: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every((value) => isObjectId(value) || isValidAbilityFormat(value)),
            simplify: (value) => value.length > 0 ? value : null
        }
    }

    public createContexts(elements: ElementDefinitions): [TokenContext] {
        const descriptionContext: TokenContext = {
            title: new EmptyToken(elements, this.name),
            name: new EmptyToken(elements, this.name)
        }
        return [descriptionContext]
    }
}

export default CreatureData
