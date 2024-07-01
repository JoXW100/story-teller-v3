import Communication from 'utils/communication'
import Logger from 'utils/logger'
import { asEnum, asNumber } from 'utils'
import { DieType } from 'structure/dice'
import { CalcMode } from 'structure/database'
import { AreaType, Attribute, CastingTime, DamageType, Duration, TargetType } from 'structure/dnd'
import { EffectConditionType } from 'structure/database/effectCondition'
import CreatureData from 'structure/database/files/creature/data'
import SpellDataFactory from 'structure/database/files/spell/factory'
import type { Editable } from 'types'
import type { ICreatureData } from 'types/database/files/creature'
import type { ISpellData } from 'types/database/files/spell'
import type { IOpen5eCreature } from 'types/open5eCompendium'

const castTimeExpr = /([0-9]+)? *([A-z-]+)/
const durationMatchExpr = /([0-9]+)? *([A-z]+)/g
const areaMatchExpr = /([0-9]+)[- ]*(?:foot|feet)[- ]*([A-z]+)[- ]*(sphere|centered|cylinder)?/g
const damageMatchExpr = /([0-9]+)d([0-9]+)[ -]+([A-z]+) *damage/
const conditionMatchExpr = /(?:([A-z]+) (saving[- ]*throw)|(ranged|melee) (spell[- ]*attack))/

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

export const getDuration = (duration: string): { duration: Duration, durationValue: number } => {
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
        durationValue: value
    }
}

export const getRange = (range: string): number => {
    if (range.includes('touch')) {
        return 5
    }

    const res = /([0-9]+)/.exec(range) ?? []
    return asNumber(res[1])
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

export const getDamage = (desc: string): { damageType: DamageType, effectDice: DieType, effectDiceNum: number } => {
    let effectDiceNum: number = 1
    let effectDice: DieType = DieType.None
    let damageType: DamageType = DamageType.None

    const res = damageMatchExpr.exec(desc.toLowerCase())
    if (res !== null) {
        effectDiceNum = asNumber(res[1], effectDiceNum)
        effectDice = asEnum(asNumber(res[2], effectDiceNum), DieType, DieType.None)
        damageType = asEnum(res[3], DamageType, DamageType.None)
    }

    return {
        effectDiceNum: effectDiceNum,
        effectDice: effectDice,
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

    if (Number(range) === 0) {
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

export const open5eSpellImporter = async (id: string): Promise<ISpellData | null> => {
    const res = await Communication.open5eFetchOne<Open5eSpell>('spells', id)
    if (res === null) { return null }
    /*
    const { time, timeCustom, timeValue } = getCastingTime(res.casting_time)
    const { duration, durationValue } = getDuration(res.duration)
    const { condition, saveAttr } = getCondition(res.desc)
    const { damageType, effectDice, effectDiceNum } = getDamage(res.desc)
    const { area, areaSize, areaHeight } = getArea(res.desc)
    const components = res.components.toLowerCase()
    const metadata: ISpellMetadata = {
        name: res.name,
        description: res.desc,
        level: res.level_int,
        school: asEnum(res.school.toLowerCase(), MagicSchool) ?? MagicSchool.Abjuration,
        time: time,
        timeCustom: timeCustom,
        timeValue: timeValue,
        duration: duration,
        durationValue: durationValue,
        ritual: res.ritual.toLowerCase() === 'yes',
        concentration: res.concentration.toLowerCase() === 'yes',
        componentMaterial: components.includes('m'),
        materials: res.material,
        componentSomatic: components.includes('s'),
        componentVerbal: components.includes('v'),
        condition: condition,
        saveAttr: saveAttr,
        target: getTarget(area, res.range), // TODO: Find in description
        range: getRange(res.range),
        area: area,
        areaSize: areaSize,
        areaHeight: areaHeight,
        conditionScaling: ScalingType.SpellModifier,
        conditionProficiency: true,
        effects: [
            {
                id: 'main',
                label: damageType === DamageType.None ? 'Effect' : 'Damage',
                text: damageType === DamageType.None ? res.name : '',
                damageType: damageType,
                dice: effectDice,
                diceNum: effectDiceNum
            }
        ]
    } satisfies KeysOf<ISpellMetadata>

    Logger.log('toSpell', { file: res, result: metadata })
    */

    const data: Partial<ISpellData> = {}
    const metadata = SpellDataFactory.create(data)
    Logger.log('toSpell', { file: res, result: metadata })
    return metadata
}
