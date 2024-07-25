import Logger from 'utils/logger'
import { asEnum, asNumber } from 'utils'
import { EffectConditionType } from 'structure/database/effectCondition'
import { ActionType, AreaType, DamageType, ScalingType, TargetType } from 'structure/dnd'
import AbilityDataFactory, { type AbilityData } from 'structure/database/files/ability/factory'
import { DieType, parseDieType } from 'structure/dice'
import { EffectCategory, EffectType } from 'structure/database/effect/common'
import { AbilityType } from 'structure/database/files/ability/common'
import type { IEffect } from 'types/database/effect'
import type { IAbilityAttackDataBase, IAbilityData } from 'types/database/files/ability'

const roll20AbilityExpr = /^(?:([\w ]+): *)?([^\.]+)\. *(?:([a-z ]+): *([+-][0-9]+) *to hit,?.*[a-z ]+([0-9]+(?:\/[0-9]+)?)[^.]+\.,? *([^.]+)[^:]+: *(?:[0-9]+)? *\(([0-9]+)d([0-9]+) *([+-] *[0-9]+)?\) *(\w+)[^.]+. *)?(.*)?/mi

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

function getAction(action: string, type: AbilityType): ActionType {
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
            return type === AbilityType.Feature
                ? ActionType.None
                : ActionType.Action
    }
}

export function isValidAbilityFormat(text: string): boolean {
    return new RegExp(roll20AbilityExpr).test(text)
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
                dieCount: dieCount,
                condition: {}
            } satisfies IEffect
        case EffectType.Die:
            return {
                type: type,
                label: 'Roll',
                scaling: { [ScalingType.Constant]: modifier },
                die: die,
                dieCount: dieCount,
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

export function toAbility(text: string): AbilityData | null {
    const res = new RegExp(roll20AbilityExpr).exec(text)
    if (res?.[2] === undefined) { return null }
    const type = getAbilityType(res[3])
    const ranges = getRange(res[5])
    const damageType = asEnum(res[10], DamageType) ?? DamageType.None
    const die = parseDieType(res[8], DieType.None)
    const dieCount = asNumber(res[7], 1)
    const modifier = getRollMod(res[9])
    console.log('toAbility', text, res)
    let result: IAbilityData
    switch (type) {
        case AbilityType.Attack: {
            const base: IAbilityAttackDataBase = {
                name: res[2] ?? 'Missing name',
                description: res[11] ?? '',
                type: type,
                action: getAction(res[1], type),
                condition: {
                    type: EffectConditionType.Hit,
                    scaling: { [ScalingType.Constant]: getRollMod(res[4]) }
                },
                target: getTargetType(res[6]),
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
                name: res[2] ?? 'Missing name',
                description: res[11] ?? '',
                type: type,
                action: getAction(res[1], type),
                condition: {
                    type: EffectConditionType.Hit,
                    scaling: { [ScalingType.Constant]: getRollMod(res[4]) }
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
                name: res[2] ?? 'Missing name',
                description: res[11] ?? '',
                type: type,
                action: getAction(res[1], type),
                condition: {
                    type: EffectConditionType.Hit,
                    scaling: { [ScalingType.Constant]: getRollMod(res[4]) }
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
                name: res[2] ?? 'Missing name',
                description: res[11] ?? '',
                type: AbilityType.Feature,
                action: getAction(res[1], type),
                notes: '',
                charges: {},
                modifiers: []
            } satisfies IAbilityData
            break
    }
    Logger.log('toAbility', { file: result, result: res })
    return AbilityDataFactory.create(result)
}
