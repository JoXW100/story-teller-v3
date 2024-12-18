import { toRichText } from './stringFormatAbilityImporter'
import { asEnum, asNumber, capitalizeFirstLetter, isEnum, isString, keysOf } from 'utils'
import Communication from 'utils/communication'
import Logger from 'utils/logger'
import { getSpellLevelFromValue } from 'utils/calculations'
import { DieType, parseDieType } from 'structure/dice'
import { CalcMode, createCalcValue } from 'structure/database'
import { ActionType, Alignment, AreaType, Attribute, CastingTime, CreatureType, DamageBinding, DamageType, Duration, Language, MagicSchool, MovementType, OptionalAttribute, ProficiencyLevel, ProficiencyLevelBasic, ScalingType, Sense, SizeType, Skill, SpellLevel, TargetType } from 'structure/dnd'
import { EffectConditionType } from 'structure/database/effectCondition'
import type { ICreatureData, ISourceBinding } from 'types/database/files/creature'
import type { ISpellAreaData, ISpellData, ISpellDataBase, ISpellMultipleData, ISpellNoneData, ISpellSelfData, ISpellSingleData, ISpellTouchData } from 'types/database/files/spell'
import type { IOpen5eCreature, IOpen5eCreatureAction } from 'types/open5eCompendium'
import { EffectCategory, EffectType } from 'structure/database/effect/common'
import { type IEffectCondition } from 'types/database/effectCondition'
import { type IArea, type IAreaCone, type IAreaCube, type IAreaCuboid, type IAreaCylinder, type IAreaLine, type IAreaNone, type IAreaRectangle, type IAreaSphere, type IAreaSquare } from 'types/database/area'
import { type IDamageEffect, type IEffect, type ITextEffect } from 'types/database/effect'

const castTimeExpr = /([0-9]+)? *([a-z-]+)/i
const durationMatchExpr = /([0-9]+)? *([a-z]+)/ig
const areaMatchExpr = /([0-9]+)[- ]*(?:foot|feet)[- ]*([A-z]+)[- ]*(sphere|centered|cylinder)?/ig
const damageMatchExpr = /([0-9]+)d([0-9]+)[ -]+([A-z]+) *damage/i
const multipleMatchExpr = /([a-z]+) creatures?/i
const conditionMatchExpr = /(?:([a-z]+)? *(saving[- ]*throw|spell[- ]*attack))/i
const higherLevelIncreaseMatchExpr = /([a-z]+) *\([^)]+\) *increases by ([0-9]+)d([0-9]+)/i
const higherLevelMatchExpr = /([0-9]+)th level \(([0-9]+)d([0-9]+)\)/ig
const hpSplitExpr = /([0-9]+)(d[0-9]+)([+-][0-9]+)?/
const sensesExpr = /([a-z]+) +([0-9]+)/i;

interface Open5eSpell {
    archetype: string
    casting_time: string
    circles: string
    components: string
    concentration: string
    desc: string
    dnd_class: string
    duration: string
    higher_level: string
    level: string
    level_int: number
    spell_level: number
    spell_lists: string[]
    material: string
    name: string
    page: string
    range: string
    ritual: string
    school: string
    slug: string
    // Ignore
    document__license_url: string
    document__slug: string
    document__title: string
}

const getCastingTime = (time: string): { time: CastingTime, timeCustom: string, timeValue: number } => {
    const res = castTimeExpr.exec(time.toLowerCase()) ?? []
    const type = asEnum(res[2], CastingTime, CastingTime.Custom)
    return {
        time: type,
        timeCustom: time,
        timeValue: asNumber(res[1], 1)
    }
}

const getDuration = (duration: string): { duration: Duration, durationCustom: string, durationValue: number } => {
    const expr = new RegExp(durationMatchExpr)
    let value: number = 0
    let type: Duration = Duration.Custom

    let hit: RegExpExecArray | null
    while ((hit = expr.exec(duration?.toLowerCase() ?? '')) != null) {
        if (type === Duration.Custom) {
            value = asNumber(hit[1], value)
        }
        switch (hit[2]) {
            case 'instantaneous':
                type = Duration.Instantaneous
                break
            case 'round':
            case 'rounds':
                type = Duration.Round
                break
            case 'minute':
            case 'minutes':
                type = Duration.Minute
                break
            case 'hour':
            case 'hours':
                type = Duration.Hour
                break
            case 'day':
            case 'days':
                type = Duration.Day
                break
            default:
                break
        }
    }

    return {
        duration: type,
        durationCustom: duration,
        durationValue: value
    }
}

const getRange = (range: string): number => {
    if (range.includes('touch')) {
        return 5
    }

    const res = /([0-9]+)/.exec(range) ?? []
    return asNumber(res[1], 0)
}

const getAttribute = (attribute: string): Attribute => {
    switch (attribute) {
        case 'charisma':
        case 'cha':
            return Attribute.CHA
        case 'constitution':
        case 'con':
            return Attribute.CON
        case 'dexterity':
        case 'dex':
            return Attribute.DEX
        case 'intelligence':
        case 'int':
            return Attribute.INT
        case 'strength':
        case 'str':
            return Attribute.STR
        case 'wisdom':
        case 'wis':
            return Attribute.WIS
        default:
            Logger.warn('getAttribute', 'Missed attribute, ...defaulting')
            return Attribute.CHA
    }
}

const getCondition = (desc: string): { condition: EffectConditionType, saveAttr?: Attribute } => {
    const res = conditionMatchExpr.exec(desc)
    switch (res?.[2]?.toLowerCase()) {
        case 'saving throw':
        case 'saving-throw':
            return {
                condition: EffectConditionType.Save,
                saveAttr: getAttribute(res[1])
            }
        case 'spell attack':
        case 'spell-attack':
            return { condition: EffectConditionType.Hit }
        default:
            return { condition: EffectConditionType.None }
    }
}

const getDamage = (desc: string): { damageType: DamageType, effectDie: DieType, effectDieNum: number } => {
    let effectDieNum: number = 1
    let effectDie: DieType = DieType.None
    let damageType: DamageType = DamageType.None

    const res = damageMatchExpr.exec(desc)
    if (res !== null) {
        effectDieNum = asNumber(res[1], effectDieNum)
        effectDie = parseDieType(res[2], DieType.None)
        damageType = asEnum(res[3], DamageType, DamageType.None)
    }

    return {
        effectDieNum: effectDieNum,
        effectDie: effectDie,
        damageType: damageType
    }
}

const getArea = (content: string): { area: AreaType, areaSize: number, areaHeight?: number } => {
    let area: AreaType = AreaType.None
    let size: number = 0
    let height: number = 0
    let hit: RegExpExecArray | null
    const expr = new RegExp(areaMatchExpr)
    while ((hit = expr.exec(content?.toLowerCase() ?? '')) != null) {
        switch (hit[3]) {
            case 'centered':
            case 'sphere':
                area = AreaType.Sphere
                break
            case 'cylinder':
                area = AreaType.Cylinder
                break
            default:
                break
        }
        switch (hit[2]) {
            case 'radius':
                if (area === AreaType.None) { area = AreaType.Sphere }
                size = asNumber(hit[1], size)
                break
            case 'square':
                area = AreaType.Square
                size = asNumber(hit[1], size)
                break
            case 'cube':
                area = AreaType.Cuboid
                size = asNumber(hit[1], size)
                break
            case 'cone':
                area = AreaType.Cone
                size = asNumber(hit[1], size)
                break
            case 'long':
                if (area === AreaType.None) { area = AreaType.Line }
                size = asNumber(hit[1], size)
                break
            case 'wide':
                if (area === AreaType.None) { area = AreaType.Line }
                height = asNumber(hit[1], height)
                break
            case 'tall':
                if (area === AreaType.None) { area = AreaType.Cylinder }
                height = asNumber(hit[1], height)
                break
            default:
                break
        }
        if (size !== 0 && height !== 0 && area !== AreaType.None) { break }
    }

    return { area: area, areaSize: size, areaHeight: height }
}

const getTarget = (area: AreaType, range: string): TargetType => {
    if (range.toLowerCase() === 'touch') {
        return TargetType.Touch
    }

    if (range.toLowerCase() === 'self' || Number(range) === 0) {
        return TargetType.Self
    }

    switch (area) {
        case AreaType.Cone:
        case AreaType.Cuboid:
        case AreaType.Cylinder:
        case AreaType.Line:
        case AreaType.Sphere:
        case AreaType.Square:
            return TargetType.Point
        case AreaType.None:
        default:
            return TargetType.Single
    }
}

const getAlignment = (value: IOpen5eCreature): Alignment => {
    const alignment = value.alignment?.toLowerCase() ?? ''
    switch (true) {
        case alignment.includes('unaligned'): return Alignment.Unaligned
        case alignment.includes('any'): return Alignment.Any
        case alignment.includes('chaotic evil'): return Alignment.ChaoticEvil
        case alignment.includes('chaotic good'): return Alignment.ChaoticGood
        case alignment.includes('non-lawful'):
        case alignment.includes('chaotic neutral'): return Alignment.ChaoticNeutral
        case alignment.includes('lawful evil'): return Alignment.LawfulEvil
        case alignment.includes('lawful good'): return Alignment.LawfulGood
        case alignment.includes('non-chaotic'):
        case alignment.includes('lawful neutral'): return Alignment.LawfulNeutral
        case alignment.includes('non-good'):
        case alignment.includes('neutral evil'): return Alignment.NeutralEvil
        case alignment.includes('non-evil'):
        case alignment.includes('neutral good'): return Alignment.NeutralGood
        case alignment.includes('true neutral'):
        case alignment.includes('neutral'): return Alignment.TrueNeutral
        default: return Alignment.None
    }
}

const getHitDie = (value: IOpen5eCreature): { level: number, hitDie: DieType } => {
    let level = 0
    let hitDie = DieType.None
    if (value.hit_dice !== null) {
        const res = hpSplitExpr.exec(value.hit_dice) ?? []
        level = asNumber(res[1])
        hitDie = asEnum(res[2], DieType, DieType.None)
    }
    return { level, hitDie }
}

const getSpeed = (value: IOpen5eCreature): Partial<Record<MovementType, number>> => {
    const speedData = value.speed ?? {}
    return Object.keys(speedData).reduce((prev, val) =>
        isEnum(val.toLowerCase(), MovementType)
            ? { ...prev, [val]: speedData[val] }
            : { ...prev }
    , {})
}

const getSenses = (value: IOpen5eCreature): Partial<Record<Sense, number>> => {
    const senseData = value.senses ?? ''
    const res: Partial<Record<Sense, number>> = {}
    const parts = senseData.toLowerCase().split(/\.,?/g)
    for (const part of parts) {
        const match = sensesExpr.exec(part)
        if (match?.[0] !== undefined) {
            const num = parseInt(match[2])
            Logger.log('Open5eCreatureData.senses', match)
            switch (match[1]?.toLowerCase()) {
                case 'blindsight':
                    res[Sense.BlindSight] = isNaN(num) ? num : 0
                    break
                case 'darkvission':
                    res[Sense.DarkVision] = isNaN(num) ? num : 0
                    break
                case 'tremorsense':
                    res[Sense.TremorSense] = isNaN(num) ? num : 0
                    break
                case 'truesight':
                    res[Sense.TrueSight] = isNaN(num) ? num : 0
                    break
                default:
                    break
            }
        }
    }
    return res
}

const getProficienciesSave  = (value: IOpen5eCreature): Partial<Record<Attribute, ProficiencyLevel>> => {
    const saves: Partial<Record<Attribute, ProficiencyLevel>> = {}
    if (value.strength_save !== null) {
        saves[Attribute.STR] = ProficiencyLevel.Proficient
    }
    if (value.dexterity_save !== null) {
        saves[Attribute.DEX] = ProficiencyLevel.Proficient
    }
    if (value.constitution_save !== null) {
        saves[Attribute.CON] = ProficiencyLevel.Proficient
    }
    if (value.intelligence_save !== null) {
        saves[Attribute.INT] = ProficiencyLevel.Proficient
    }
    if (value.wisdom_save !== null) {
        saves[Attribute.WIS] = ProficiencyLevel.Proficient
    }
    if (value.charisma_save !== null) {
        saves[Attribute.CHA] = ProficiencyLevel.Proficient
    }
    return saves
}

const proficienciesSkill  = (value: IOpen5eCreature): Partial<Record<Skill, ProficiencyLevel>> => {
    const skills = value.skills ?? {}
    const res: Partial<Record<Skill, ProficiencyLevel>> = {}
    for (const key of Object.keys(skills)) {
        switch (key.toLowerCase()) {
            case 'acrobatics': // TODO: Verify
                res[Skill.Acrobatics] = ProficiencyLevel.Proficient
                break
            case 'animal_handling': // TODO: Verify
                res[Skill.AnimalHandling] = ProficiencyLevel.Proficient
                break
            case 'arcana': // TODO: Verify
                res[Skill.Arcana] = ProficiencyLevel.Proficient
                break
            case 'athletics': // TODO: Verify
                res[Skill.Athletics] = ProficiencyLevel.Proficient
                break
            case 'deception': // TODO: Verify
                res[Skill.Deception] = ProficiencyLevel.Proficient
                break
            case 'history':
                res[Skill.History] = ProficiencyLevel.Proficient
                break
            case 'insight': // TODO: Verify
                res[Skill.Insight] = ProficiencyLevel.Proficient
                break
            case 'intimidation': // TODO: Verify
                res[Skill.Intimidation] = ProficiencyLevel.Proficient
                break
            case 'investigation': // TODO: Verify
                res[Skill.Investigation] = ProficiencyLevel.Proficient
                break
            case 'medicine': // TODO: Verify
                res[Skill.Medicine] = ProficiencyLevel.Proficient
                break
            case 'nature': // TODO: Verify
                res[Skill.Nature] = ProficiencyLevel.Proficient
                break
            case 'perception':
                res[Skill.Perception] = ProficiencyLevel.Proficient
                break
            case 'performance': // TODO: Verify
                res[Skill.Performance] = ProficiencyLevel.Proficient
                break
            case 'persuasion': // TODO: Verify
                res[Skill.Persuasion] = ProficiencyLevel.Proficient
                break
            case 'religion': // TODO: Verify
                res[Skill.Religion] = ProficiencyLevel.Proficient
                break
            case 'sleightOfHand': // TODO: Verify
                res[Skill.SleightOfHand] = ProficiencyLevel.Proficient
                break
            case 'stealth':
                res[Skill.Stealth] = ProficiencyLevel.Proficient
                break
            case 'survival': // TODO: Verify
                res[Skill.Survival] = ProficiencyLevel.Proficient
                break
            default:
                Logger.warn('Open5eCreatureData.proficienciesSkill', `Unknown Skill: '${key}'`)
                break
        }
    }
    return res
}

const proficienciesLanguage = (value: IOpen5eCreature): Partial<Record<Language, ProficiencyLevelBasic>> => {
    const languages = value.languages?.toLowerCase().split(/, */g) ?? []
    const res: Partial<Record<Language, ProficiencyLevelBasic>> = {}
    for (const language of languages) {
        if (isEnum(language, Language)) {
            res[language] = ProficiencyLevelBasic.Proficient
        } else {
            Logger.warn('Open5eCreatureData.proficienciesLanguage', `Unknown Language: '${language}'`)
        }
    }
    return res
}

const getResistances = (value: IOpen5eCreature): Partial<Record<DamageBinding, readonly ISourceBinding[]>> => {
    // TODO: Implement
    if (value.damage_resistances !== null && value.damage_resistances.length > 0) {
        Logger.warn('Open5eCreatureData.getResistances', `Creature had unrecognized damage resistances ${value.damage_resistances}.`)
    }
    return {}
}

const getVulnerabilities = (value: IOpen5eCreature): Partial<Record<DamageBinding, readonly ISourceBinding[]>> => {
    // TODO: Implement
    if (value.damage_vulnerabilities !== null && value.damage_vulnerabilities.length > 0) {
        Logger.warn('Open5eCreatureData.getVulnerabilities', `Creature had unrecognized damage vulnerabilities ${value.damage_vulnerabilities}.`)
    }
    return {}
}

const getDamageImmunities = (value: IOpen5eCreature): Partial<Record<DamageBinding, readonly ISourceBinding[]>> => {
    // TODO: Implement
    if (value.damage_immunities !== null && value.damage_immunities.length > 0) {
        Logger.warn('Open5eCreatureData.getDamageImmunities', `Creature had unrecognized damage immunities ${value.damage_immunities}.`)
    }
    return {}
}

const getConditionImmunities = (value: IOpen5eCreature): Partial<Record<DamageBinding, readonly ISourceBinding[]>> => {
    // TODO: Implement
    if (value.condition_immunities !== null && value.condition_immunities.length > 0) {
        Logger.warn('Open5eCreatureData.getConditionImmunities', `Creature had unrecognized condition immunities ${value.condition_immunities}.`)
    }
    return {}
}

const getSpellAttribute = (value: IOpen5eCreature): OptionalAttribute => {
    if (!Array.isArray(value.spell_list) || value.spell_list.length <= 0) {
        return OptionalAttribute.None
    }

    let maxValue = -99
    let res: OptionalAttribute = OptionalAttribute.None
    const collection = {
        [OptionalAttribute.INT]: asNumber(value.intelligence),
        [OptionalAttribute.WIS]: asNumber(value.wisdom),
        [OptionalAttribute.CHA]: asNumber(value.charisma),
    }
    for (const attr of keysOf(collection)) {
        const value = collection[attr]
        if (value > maxValue) {
            maxValue = value
            res = attr
        }
    }
    return res
}

const getAbilities = (value: IOpen5eCreature): string[] => {
    let actions: IOpen5eCreatureAction[] = []
    if (Array.isArray(value.actions)) {
        actions = [...actions, ...value.actions]
    }
    if (Array.isArray(value.special_abilities)) {
        actions = [...actions, ...value.special_abilities]
    }
    if (Array.isArray(value.legendary_actions)) {
        actions = [...actions, ...value.legendary_actions
            .map(val => ({ ...val, name: `${ActionType.Legendary}: ${val.name}` }))
        ]
    }
    if (Array.isArray(value.reactions)) {
        actions = [...actions, ...value.reactions
            .map(val => ({ ...val, name: `${ActionType.Reaction}: ${val.name}` }))
        ]
    }
    return actions.map((x) => `${x.name}. ${x.desc}`)
}

export const open5eCreatureImporter = async (id: string): Promise<ICreatureData | null> => {
    const res = await Communication.open5eFetchOne<IOpen5eCreature>('monsters', id)
    if (res === null) {
        return null
    }

    const { level, hitDie } = getHitDie(res)

    const data: ICreatureData = {
        name: res.name,
        description: res.desc,
        content: "",
        portrait: res.img_main ?? "",
        // Info
        type: asEnum(res.type.toLowerCase(), CreatureType, CreatureType.None),
        size: asEnum(res.size.toLowerCase(), SizeType, SizeType.Medium),
        alignment: getAlignment(res),
        challenge: asNumber(res.cr, 0),
        xp: 0,
        // Stats
        level: level,
        hitDie: hitDie,
        health: { mode: CalcMode.Override, value: asNumber(res.hit_points, 0) },
        ac: { mode: CalcMode.Override, value: asNumber(res.armor_class, 0) },
        proficiency: createCalcValue(),
        initiative: createCalcValue(),
        speed: getSpeed(res),
        senses: getSenses(res),
        // Attributes
        str: asNumber(res.strength, 0),
        dex: asNumber(res.dexterity, 0),
        con: asNumber(res.constitution, 0),
        int: asNumber(res.intelligence, 0),
        cha: asNumber(res.charisma, 0),
        wis: asNumber(res.wisdom, 0),
        // Passives
        passivePerception: createCalcValue(),
        passiveInvestigation: createCalcValue(),
        passiveInsight: createCalcValue(),
        // Proficiencies
        proficienciesSave: getProficienciesSave(res),
        proficienciesSkill: proficienciesSkill(res),
        proficienciesTool: {},
        proficienciesLanguage: proficienciesLanguage(res),
        proficienciesArmor: {},
        proficienciesWeapon: {},
        // Advantages
        advantages: {},
        disadvantages: {},
        // Resistances
        resistances: getResistances(res),
        vulnerabilities: getVulnerabilities(res),
        damageImmunities: getDamageImmunities(res),
        conditionImmunities: getConditionImmunities(res),
        // Spells
        spellAttribute: getSpellAttribute(res),
        casterLevel: createCalcValue(),
        spells: {},
        spellSlots: {},
        ritualCaster: false,
        // Abilities
        abilities: getAbilities(res)
    }

    Logger.log('toCreature', { file: res, result: data })
    return data
}

function createCondition(res: Open5eSpell): IEffectCondition {
    const { condition, saveAttr } = getCondition(res.desc)
    switch (condition) {
        case EffectConditionType.None:
            return { type: condition }
        case EffectConditionType.Hit:
            return { type: condition, scaling: { [ScalingType.SpellModifier]: 1, [ScalingType.Proficiency]: 1 } }
        case EffectConditionType.Save:
            return { type: condition, attribute: saveAttr ?? Attribute.STR, scaling: { [ScalingType.SpellModifier]: 1, [ScalingType.Proficiency]: 1 } }
        case EffectConditionType.Check:
            return { type: condition, skill: Skill.Acrobatics, scaling: { [ScalingType.SpellModifier]: 1, [ScalingType.Proficiency]: 1 } }
    }
}

function parseNumberString(value: string): number {
    switch (value) {
        case "one": return 1
        case "two": return 2
        case "three": return 3
        case "four": return 4
        case "five": return 5
        case "six": return 6
        case "seven": return 7
        case "eight": return 8
        case "nine": return 9
        case "ten": return 10
        case "eleven": return 11
        case "twelve": return 12
        case "thirteen": return 13
        case "fourteen": return 14
        case "fifteen": return 15
        case "sixteen": return 16
        case "seventeen": return 17
        case "eighteen": return 18
        case "nineteen": return 19
        case "twenty": return 20
        default: return asNumber(value, 0);;
    }
}

function createTargetArea(res: Open5eSpell): [TargetType, IArea, number] {
    const { area, areaSize, areaHeight } = getArea(res.desc)
    let result: IArea

    switch (area) {
        case AreaType.None:
            result = { type: area } satisfies IAreaNone
            break
        case AreaType.Line:
            result = { type: area, length: areaSize } satisfies IAreaLine
            break
        case AreaType.Cone:
            result = { type: area, side: areaSize } satisfies IAreaCone
            break
        case AreaType.Square:
            result = { type: area, side: areaSize } satisfies IAreaSquare
            break
        case AreaType.Rectangle:
            result = { type: area, length: areaSize, width: areaHeight ?? areaSize } satisfies IAreaRectangle
            break
        case AreaType.Cube:
            result = { type: area, side: areaSize } satisfies IAreaCube
            break
        case AreaType.Cuboid:
            result = { type: area, length: areaSize, width: areaSize, height: areaHeight ?? areaSize } satisfies IAreaCuboid
            break
        case AreaType.Sphere:
            result = { type: area, radius: areaSize } satisfies IAreaSphere
            break
        case AreaType.Cylinder:
            result = { type: area, radius: areaSize, height: areaHeight ?? areaSize } satisfies IAreaCylinder
            break
    }

    let target = getTarget(area, res.range);
    let count = 1
    if (target == TargetType.Single) {
        const multipleMatch = multipleMatchExpr.exec(res.desc);
        if (multipleMatch != null) {
            target = TargetType.Multiple
            count = parseNumberString(multipleMatch[1])
        }
    }
    
    return [target, result, count]
}

function createEffects(res: Open5eSpell): Record<string, IEffect> {
    const { damageType, effectDie, effectDieNum } = getDamage(res.desc)
    const effects: Record<string, IEffect> = {}
    if (damageType === DamageType.None) {
        effects.main = {
            type: EffectType.Text,
            label: 'Effect',
            condition: {},
            text: res.name
        } satisfies ITextEffect
    } else {
        effects.main = {
            type: EffectType.Damage,
            label: 'Damage',
            condition: {},
            category: EffectCategory.Uncategorized,
            damageType: damageType,
            scaling: {},
            die: effectDie,
            dieCount: { [ScalingType.Constant]: effectDieNum }
        } satisfies IDamageEffect
    }
    if (effects.main.type === EffectType.Damage && isString(res.higher_level) && res.higher_level.length > 0) {
        const increaseMatch = higherLevelIncreaseMatchExpr.exec(res.higher_level)
        if (increaseMatch !== null) {
            const type = increaseMatch[1]
            if (type !== 'damage') {
                Logger.warn('Imported spell with unexpected "higher_level" field: ', res.higher_level, increaseMatch)
                return effects
            }

            const expr = new RegExp(higherLevelMatchExpr)
            let hit: RegExpExecArray | null
            let prevLevel = 0
            let prevKey: keyof typeof effects = 'main'
            let prevDie: DieType = effects.main.die
            let prevDieCount: number = effects.main.dieCount[ScalingType.Constant] ?? 0
            while ((hit = expr.exec(res.higher_level)) != null) {
                const level = asNumber(hit[1])
                const higherDie = parseDieType(hit[3], DieType.None)
                const higherDieCount = asNumber(hit[2], 0)
                if (!isNaN(level)) {
                    effects[prevKey] = {
                        ...effects.main,
                        die: prevDie,
                        dieCount: { [ScalingType.Constant]: prevDieCount },
                        condition: prevLevel > 0
                            ? { range: [prevLevel, { property: 'casterLevel' }, level - 1] }
                            : { leq: [{ property: 'casterLevel' }, level - 1] }
                    }
                    prevLevel = level
                    prevKey = `lv${level}`
                    prevDie = higherDie
                    prevDieCount = higherDieCount
                }
            }

            if (prevLevel > 0) {
                effects[prevKey] = {
                    ...effects.main,
                    die: prevDie,
                    dieCount: { [ScalingType.Constant]: prevDieCount },
                    condition: { geq: [{ property: 'casterLevel' }, prevLevel] }
                }
            } else if (res.higher_level.toLowerCase().includes('for each slot level')) {
                const die = parseDieType(increaseMatch[3], DieType.None)
                const dieCount = asNumber(increaseMatch[2], 0)
                const initialCount = effects.main.dieCount[ScalingType.Constant] ?? 0

                for (const key of keysOf(effects)) {
                    if (effects[key].type !== EffectType.Text) {
                        effects[key] = {
                            ...effects[key],
                            die: die,
                            dieCount: {
                                [ScalingType.Constant]: initialCount - dieCount * res.level_int,
                                [ScalingType.SpellLevel]: dieCount
                            }
                        }
                    }
                }
            }
        }
    }

    return effects
}

function createDescription(res: Open5eSpell): string {
    let text = toRichText(res.desc) + '\n'
    if (isString(res.higher_level) && res.higher_level.length > 0) {
        text += `\\space\n\\b{At Higher Levels.}~${res.higher_level}\n`
    }
    if (Array.isArray(res.spell_lists) && res.spell_lists.length > 0) {
        text += `\\space\n\\b{Spell Lists.}~${res.spell_lists.map(capitalizeFirstLetter).join(', ')}\n`
    }
    return text
}

export const open5eSpellImporter = async (id: string): Promise<ISpellData | null> => {
    const res = await Communication.open5eFetchOne<Open5eSpell>('spells', id)
    if (res === null) { return null }

    const [target, area, targetCount] = createTargetArea(res)
    const components = res.components.toLowerCase()

    const data: ISpellDataBase = {
        name: res.name,
        description: createDescription(res),
        notes: '',
        level: getSpellLevelFromValue(res.level_int) ?? SpellLevel.Cantrip,
        school: asEnum(res.school.toLowerCase(), MagicSchool) ?? MagicSchool.Abjuration,
        // Time
        ...getCastingTime(res.casting_time),
        ...getDuration(res.duration),
        // Properties
        allowUpcast: res.level_int > 0,
        ritual: res.ritual.toLowerCase() === 'yes',
        concentration: res.concentration.toLowerCase() === 'yes',
        componentVerbal: components.includes('v'),
        componentMaterial: components.includes('m'),
        componentSomatic: components.includes('s'),
        materials: res.material,
        target: TargetType.None,
        condition: { type: EffectConditionType.None },
        effects: {}
    }

    let result: ISpellData
    switch (target) {
        case TargetType.None:
            result = {
                ...data,
                target: target,
                condition: { type: EffectConditionType.None },
                effects: createEffects(res)
            } satisfies ISpellNoneData
            break
        case TargetType.Touch:
            result = {
                ...data,
                target: target,
                condition: createCondition(res),
                effects: createEffects(res)
            } satisfies ISpellTouchData
            break
        case TargetType.Self:
            result = {
                ...data,
                target: target,
                area: area,
                condition: createCondition(res),
                effects: createEffects(res)
            } satisfies ISpellSelfData
            break
        case TargetType.Single:
            result = {
                ...data,
                target: target,
                range: getRange(res.range),
                condition: createCondition(res),
                effects: createEffects(res)
            } satisfies ISpellSingleData
            break
        case TargetType.Multiple:
            result = {
                ...data,
                target: target,
                range: getRange(res.range),
                count: targetCount,
                condition: createCondition(res),
                effects: createEffects(res)
            } satisfies ISpellMultipleData
            break
        case TargetType.Point:
        case TargetType.Area:
            result = {
                ...data,
                target: target,
                range: getRange(res.range),
                area: area,
                condition: createCondition(res),
                effects: createEffects(res)
            } satisfies ISpellAreaData
            break
    }

    Logger.log('toSpell', { file: res, result: data })
    return result
}
