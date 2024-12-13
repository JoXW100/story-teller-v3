import { toRichText } from './stringFormatAbilityImporter'
import { asEnum, asNumber, capitalizeFirstLetter, isString, keysOf } from 'utils'
import Communication from 'utils/communication'
import Logger from 'utils/logger'
import { getSpellLevelFromValue } from 'utils/calculations'
import { DieType, parseDieType } from 'structure/dice'
import { CalcMode } from 'structure/database'
import { AreaType, Attribute, CastingTime, DamageType, Duration, MagicSchool, ScalingType, Skill, SpellLevel, TargetType } from 'structure/dnd'
import { EffectConditionType } from 'structure/database/effectCondition'
import CreatureData from 'structure/database/files/creature/data'
import type { Editable } from 'types'
import type { ICreatureData } from 'types/database/files/creature'
import type { ISpellAreaData, ISpellData, ISpellDataBase, ISpellMultipleData, ISpellNoneData, ISpellSelfData, ISpellSingleData, ISpellTouchData } from 'types/database/files/spell'
import type { IOpen5eCreature } from 'types/open5eCompendium'
import { EffectCategory, EffectType } from 'structure/database/effect/common'
import { type IEffectCondition } from 'types/database/effectCondition'
import { type IArea, type IAreaCone, type IAreaCube, type IAreaCuboid, type IAreaCylinder, type IAreaLine, type IAreaNone, type IAreaRectangle, type IAreaSphere, type IAreaSquare } from 'types/database/area'
import { type IDamageEffect, type IEffect, type ITextEffect } from 'types/database/effect'

const castTimeExpr = /([0-9]+)? *([A-z-]+)/
const durationMatchExpr = /([0-9]+)? *([A-z]+)/g
const areaMatchExpr = /([0-9]+)[- ]*(?:foot|feet)[- ]*([A-z]+)[- ]*(sphere|centered|cylinder)?/g
const damageMatchExpr = /([0-9]+)d([0-9]+)[ -]+([A-z]+) *damage/
const conditionMatchExpr = /(?:([A-z]+) (saving[- ]*throw)|(ranged|melee) (spell[- ]*attack))/
const higherLevelIncreaseMatchExpr = /([A-z]+) increases by ([0-9]+)d([0-9]+)/i
const higherLevelMatchExpr = /([0-9]+)th level \(([0-9]+)d([0-9]+)\)/ig

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

export const getCastingTime = (time: string): { time: CastingTime, timeCustom: string, timeValue: number } => {
    const res = castTimeExpr.exec(time.toLowerCase()) ?? []
    const type = asEnum(res[2], CastingTime, CastingTime.Custom)
    return {
        time: type,
        timeCustom: time,
        timeValue: asNumber(res[1], 1)
    }
}

export const getDuration = (duration: string): { duration: Duration, durationCustom: string, durationValue: number } => {
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

export const getRange = (range: string): number => {
    if (range.includes('touch')) {
        return 5
    }

    const res = /([0-9]+)/.exec(range) ?? []
    return asNumber(res[1], 0)
}

export const getAttribute = (attribute: string): Attribute => {
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

export const getCondition = (desc: string): { condition: EffectConditionType, saveAttr?: Attribute } => {
    const res = conditionMatchExpr.exec(desc.toLowerCase())
    if (res != null) {
        switch (res[2]) {
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
                break
        }
    }
    return { condition: EffectConditionType.None }
}

export const getDamage = (desc: string): { damageType: DamageType, effectDie: DieType, effectDieNum: number } => {
    let effectDieNum: number = 1
    let effectDie: DieType = DieType.None
    let damageType: DamageType = DamageType.None

    const res = damageMatchExpr.exec(desc.toLowerCase())
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

export const getArea = (content: string): { area: AreaType, areaSize: number, areaHeight?: number } => {
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

export const getTarget = (area: AreaType, range: string): TargetType => {
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

export const open5eCreatureImporter = async (id: string): Promise<ICreatureData | null> => {
    const res = await Communication.open5eFetchOne<IOpen5eCreature>('monsters', id)
    if (res === null) {
        return null
    }

    try {
        const data: Partial<Editable<ICreatureData, keyof ICreatureData>> = {
            name: res.name,
            description: res.desc
        }

        if (res.armor_class !== undefined) {
            data.ac = { mode: CalcMode.Override, value: res.armor_class }
        }

        const metadata = new CreatureData(data)
        Logger.log('toCreature', { file: res, result: metadata })
        return metadata
    } catch (error: unknown) {
        Logger.throw('open5eCreatureImporter', error)
        return null
    }
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

function createTargetArea(res: Open5eSpell): [TargetType, IArea] {
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

    return [getTarget(area, res.range), result]
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

    const [target, area] = createTargetArea(res)
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
                count: 1,
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
