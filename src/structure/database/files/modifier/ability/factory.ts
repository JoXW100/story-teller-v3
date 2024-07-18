import { ModifierAbilityType } from '.'
import ModifierAbilityAttackBonusData from './attackBonus'
import ModifierAbilityMeleeWeaponAttackBonusData from './meleeWeaponAttackBonus'
import ModifierAbilityRangedWeaponAttackBonusData from './rangedWeaponAttackBonus'
import ModifierAbilityThrownWeaponAttackBonusData from './thrownWeaponAttackBonus'
import ModifierAbilityDamageBonusData from './damageBonus'
import ModifierAbilityMeleeWeaponDamageBonusData from './meleeWeaponDamageBonus'
import ModifierAbilityRangedWeaponDamageBonusData from './rangedWeaponDamageBonus'
import ModifierAbilityThrownWeaponDamageBonusData from './thrownWeaponDamageBonus'
import { isEnum, isRecord } from 'utils'
import { simplifyObjectProperties, validateObjectProperties, hasObjectProperties } from 'structure/database'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IModifierAbilityAttackBonusData, IModifierAbilityData } from 'types/database/files/modifier'
import type { Simplify } from 'types'

export type ModifierAbilityData = ModifierAbilityAttackBonusData |
ModifierAbilityMeleeWeaponAttackBonusData |
ModifierAbilityRangedWeaponAttackBonusData |
ModifierAbilityThrownWeaponAttackBonusData |
ModifierAbilityDamageBonusData |
ModifierAbilityMeleeWeaponDamageBonusData |
ModifierAbilityRangedWeaponDamageBonusData |
ModifierAbilityThrownWeaponDamageBonusData

const ModifierAbilityDataFactory = {
    create: function (data: Simplify<IModifierAbilityData> = {}): ModifierAbilityData {
        switch (data.subtype) {
            case ModifierAbilityType.MeleeWeaponAttackBonus:
                return new ModifierAbilityMeleeWeaponAttackBonusData(data)
            case ModifierAbilityType.RangedWeaponAttackBonus:
                return new ModifierAbilityRangedWeaponAttackBonusData(data)
            case ModifierAbilityType.ThrownWeaponAttackBonus:
                return new ModifierAbilityThrownWeaponAttackBonusData(data)
            case ModifierAbilityType.DamageBonus:
                return new ModifierAbilityDamageBonusData(data)
            case ModifierAbilityType.MeleeWeaponDamageBonus:
                return new ModifierAbilityMeleeWeaponDamageBonusData(data)
            case ModifierAbilityType.RangedWeaponDamageBonus:
                return new ModifierAbilityRangedWeaponDamageBonusData(data)
            case ModifierAbilityType.ThrownWeaponDamageBonus:
                return new ModifierAbilityThrownWeaponDamageBonusData(data)
            case ModifierAbilityType.AttackBonus:
            default:
                return new ModifierAbilityAttackBonusData(data as IModifierAbilityAttackBonusData)
        }
    },
    is: function (data: unknown): data is IModifierAbilityData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IModifierAbilityData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IModifierAbilityData): Simplify<IModifierAbilityData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IModifierAbilityData, ModifierAbilityData> {
        const type = isRecord(data) && isEnum(data.subtype, ModifierAbilityType)
            ? data.subtype
            : ModifierAbilityType.AttackBonus
        switch (type) {
            case ModifierAbilityType.AttackBonus:
                return ModifierAbilityAttackBonusData.properties
            case ModifierAbilityType.MeleeWeaponAttackBonus:
                return ModifierAbilityMeleeWeaponAttackBonusData.properties
            case ModifierAbilityType.RangedWeaponAttackBonus:
                return ModifierAbilityRangedWeaponAttackBonusData.properties
            case ModifierAbilityType.ThrownWeaponAttackBonus:
                return ModifierAbilityThrownWeaponAttackBonusData.properties
            case ModifierAbilityType.DamageBonus:
                return ModifierAbilityDamageBonusData.properties
            case ModifierAbilityType.MeleeWeaponDamageBonus:
                return ModifierAbilityMeleeWeaponDamageBonusData.properties
            case ModifierAbilityType.RangedWeaponDamageBonus:
                return ModifierAbilityRangedWeaponDamageBonusData.properties
            case ModifierAbilityType.ThrownWeaponDamageBonus:
                return ModifierAbilityThrownWeaponDamageBonusData.properties
        }
    }
} satisfies IDatabaseFactory<IModifierAbilityData, ModifierAbilityData>

export default ModifierAbilityDataFactory
