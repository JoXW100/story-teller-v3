import Logger from 'utils/logger'
import { asEnum, asNumber } from 'utils'
import { EffectConditionType } from 'structure/database/effectCondition'
import { ActionType, AreaType, DamageType, ScalingType, TargetType } from 'structure/dnd'
import AbilityDataFactory, { type AbilityData } from 'structure/database/files/ability/factory'
import { DieType, parseDieType } from 'structure/dice'
import { EffectCategory, EffectType } from 'structure/database/effect/common'
import { AbilityType } from 'structure/database/files/ability/common'
import type { IEffect } from 'types/database/effect'
import type { IAbilityAttackDataBase, IAbilityData, IAbilityFeatureData } from 'types/database/files/ability'

const roll20AbilityExpr = /^(?:([\w ]+): *)?([^.]+)\. *(?:([a-z ]+): *([+-][0-9]+) *to hit,?.*[a-z ]+([0-9]+(?:\/[0-9]+)?)[^.]+\.,? *([^.]+)[^:]+: *(?:[0-9]+)? *\(([0-9]+)d([0-9]+) *([+-] *[0-9]+)?\) *(\w+)[^.]+. *)/mi
const roll20FeatureSimpleExpr = /^(?:([\w ]+): *)?([^.]+)\. *([\s\S]*)/mi
const rollTextExpr = /([0-9]*d[0-9]+(?: *[+-]? *[0-9]+)?)( *)/ig
const checkTextExpr = /DC +([0-9]+) *(?:(\w+)?( *))/ig

function getAbilityType(ability: string): AbilityType {
    switch (ability?.toLowerCase()) {
        case 'melee weapon attack':
            return AbilityType.MeleeWeapon
        case 'ranged weapon attack':
            return AbilityType.RangedWeapon
        case 'melee attack': // unknown
            return AbilityType.MeleeAttack
        case 'ranged attack': // unknown
        case 'melee or ranged weapon attack':
            return AbilityType.RangedAttack
        default:
            return AbilityType.Feature
    }
}

function getTargetType(target: string): TargetType {
    switch (target?.toLowerCase()) {
        case 'one target':
        case 'one creature':
            return TargetType.Single
        case 'self': // unknown
            return TargetType.Self
        case 'point': // unknown
            return TargetType.Point
        default:
            return TargetType.None
    }
}

function getRollMod(roll: string): number {
    return asNumber(roll?.match(/-? *[0-9]+/)?.[0], 0)
}

function getRange(range: string): { range: number, rangeLong: number } {
    const splits = range?.split('/') ?? []
    const res = { range: 0, rangeLong: 0 }
    if (splits[0] !== undefined) { res.range = asNumber(splits[0]) }
    if (splits[1] !== undefined) { res.rangeLong = asNumber(splits[1]) }
    return res
}

function getAction(action: string): ActionType | null {
    switch (action?.toLowerCase()) {
        case 'none':
            return ActionType.None
        case 'special':
            return ActionType.Special
        case 'reaction':
            return ActionType.Reaction
        case 'bonus action':
        case 'bonus':
            return ActionType.BonusAction
        case 'action':
            return ActionType.Action
        case 'legendary':
            return ActionType.Legendary
        default:
            return null
    }
}

function createEffect(damageType: DamageType, text: string, die: DieType, dieCount: number, modifier: number): IEffect {
    const type = damageType !== DamageType.None
        ? EffectType.Damage
        : dieCount > 0
            ? EffectType.Die
            : EffectType.Text
    switch (type) {
        case EffectType.Damage:
            return {
                type: type,
                label: 'Damage',
                category: EffectCategory.Uncategorized,
                damageType: damageType,
                scaling: { [ScalingType.Constant]: modifier },
                die: die,
                dieCount: { [ScalingType.Constant]: dieCount },
                condition: {}
            } satisfies IEffect
        case EffectType.Die:
            return {
                type: type,
                label: 'Roll',
                scaling: { [ScalingType.Constant]: modifier },
                die: die,
                dieCount: { [ScalingType.Constant]: dieCount },
                condition: {}
            } satisfies IEffect
        case EffectType.Text:
            return {
                type: type,
                label: 'Effect',
                text: text,
                condition: {}
            } satisfies IEffect
    }
}

export function isValidAbilityFormat(text: string): boolean {
    return new RegExp(roll20AbilityExpr).test(text)
}

export function toRichText(text: string): string {
    text = text.replace(rollTextExpr, (_, match: string, spaces: string) => `\\roll[${match}]${spaces.length > 0 ? '~' : ''}`)
    text = text.replace(checkTextExpr, (_, dc: string, type?: string, spaces?: string) => `\\check[${dc}${type !== undefined ? `, type: ${type}]${spaces != null && spaces.length > 0 ? '~' : ''}` : ']'}`)
    return text.replace(/\n{2,}/g, '\n\\space\n')
}

export function toAbility(text: string): AbilityData | null {
    let res = roll20AbilityExpr.exec(text)
    let result: IAbilityData
    if (res === null) {
        res = roll20FeatureSimpleExpr.exec(text)
        if (res === null) {
            return null
        }
        const action = getAction(res[1]) ?? ActionType.None
        const name = res[2] ?? 'Missing name'
        const description = toRichText(res[3] ?? '')
        result = {
            name: name,
            description: description,
            type: AbilityType.Feature,
            action: action,
            notes: '',
            charges: {},
            modifiers: []
        } satisfies IAbilityFeatureData
    } else {
        const action = getAction(res[1])
        const name = res[2] ?? 'Missing name'
        const type = getAbilityType(res[3])
        const mod = getRollMod(res[4])
        const ranges = getRange(res[5])
        const target = getTargetType(res[6])
        const dieCount = asNumber(res[7], 1)
        const die = parseDieType(res[8], DieType.None)
        const modifier = getRollMod(res[9])
        const damageType = asEnum(res[10], DamageType, DamageType.None)
        const description = toRichText(res[11] ?? '')
        switch (type) {
            case AbilityType.Attack: {
                const base: IAbilityAttackDataBase = {
                    name: name,
                    description: description,
                    type: type,
                    action: action ?? ActionType.Action,
                    condition: {
                        type: EffectConditionType.Hit,
                        scaling: { [ScalingType.Constant]: mod }
                    },
                    target: target,
                    notes: '',
                    charges: {},
                    effects: { main: createEffect(damageType, text, die, dieCount, modifier) },
                    modifiers: []
                }
                switch (base.target) {
                    case TargetType.None:
                        result = { ...base, target: base.target, condition: { type: EffectConditionType.None } }
                        break
                    case TargetType.Touch:
                        result = { ...base, target: base.target }
                        break
                    case TargetType.Self:
                        result = { ...base, target: base.target, area: { type: AreaType.None } }
                        break
                    case TargetType.Single:
                        result = { ...base, target: base.target, range: ranges.range }
                        break
                    case TargetType.Multiple:
                        result = { ...base, target: base.target, range: ranges.range, count: 1 }
                        break
                    case TargetType.Area:
                    case TargetType.Point:
                        result = { ...base, target: base.target, range: ranges.range, area: { type: AreaType.None } }
                        break
                }
            } break
            case AbilityType.MeleeAttack:
            case AbilityType.MeleeWeapon:
                result = {
                    name: name,
                    description: description,
                    type: type,
                    action: action ?? ActionType.Action,
                    condition: {
                        type: EffectConditionType.Hit,
                        scaling: { [ScalingType.Constant]: mod }
                    },
                    reach: ranges.range,
                    notes: '',
                    charges: {},
                    effects: { main: createEffect(damageType, text, die, dieCount, modifier) },
                    modifiers: []
                }
                break
            case AbilityType.RangedAttack:
            case AbilityType.RangedWeapon:
                result = {
                    name: name,
                    description: description,
                    type: type,
                    action: action ?? ActionType.Action,
                    condition: {
                        type: EffectConditionType.Hit,
                        scaling: { [ScalingType.Constant]: mod }
                    },
                    range: ranges.range,
                    rangeLong: ranges.rangeLong,
                    notes: '',
                    charges: {},
                    effects: { main: createEffect(damageType, text, die, dieCount, modifier) },
                    modifiers: []
                } satisfies IAbilityData
                break
            case AbilityType.Feature:
            default:
                result = {
                    name: name,
                    description: description,
                    type: AbilityType.Feature,
                    action: action ?? ActionType.None,
                    notes: '',
                    charges: {},
                    modifiers: []
                } satisfies IAbilityData
                break
        }
    }
    Logger.log('toAbility', { file: result, result: res })
    return AbilityDataFactory.create(result)
}
