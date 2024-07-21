import AbilityMeleeAttackData from './meleeAttack'
import AbilityRangedAttackData from './rangedAttack'
import AbilityThrownAttackData from './thrownAttack'
import AbilityFeatureData from './feature'
import AbilityAttackData from './attack'
import { AbilityType } from './common'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import { isEnum, isRecord } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IAbilityData, IAbilityFeatureData } from 'types/database/files/ability'
import AbilityCustomData from './custom'
import AbilitySkillData from './skill'

export type AbilityData = AbilityFeatureData | AbilityCustomData |
AbilityAttackData | AbilityMeleeAttackData | AbilityRangedAttackData |
AbilityThrownAttackData | AbilitySkillData

const AbilityDataFactory: IDatabaseFactory<IAbilityData, AbilityData> = {
    create: function (data: Simplify<IAbilityData> = {}): AbilityData {
        switch (data.type) {
            case AbilityType.Skill:
                return new AbilitySkillData(data)
            case AbilityType.Attack:
                return new AbilityAttackData(data)
            case AbilityType.MeleeAttack:
            case AbilityType.MeleeWeapon:
                return new AbilityMeleeAttackData(data)
            case AbilityType.RangedAttack:
            case AbilityType.RangedWeapon:
                return new AbilityRangedAttackData(data)
            case AbilityType.ThrownWeapon:
                return new AbilityThrownAttackData(data)
            case AbilityType.Custom:
                return new AbilityCustomData(data)
            case AbilityType.Feature:
            default:
                return new AbilityFeatureData(data as IAbilityFeatureData)
        }
    },
    is: function (data: unknown): data is IAbilityData {
        return AbilityDataFactory.validate(data) && hasObjectProperties(data, AbilityDataFactory.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IAbilityData> {
        return isRecord(data) && validateObjectProperties(data, AbilityDataFactory.properties(data))
    },
    simplify: function (data: IAbilityData): Simplify<IAbilityData> {
        return simplifyObjectProperties(data, AbilityDataFactory.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IAbilityData, AbilityData> {
        const type = isRecord(data) && isEnum(data.type, AbilityType)
            ? data.type
            : AbilityType.Feature
        switch (type) {
            case AbilityType.Attack:
                return AbilityAttackData.properties
            case AbilityType.Skill:
                return AbilitySkillData.properties
            case AbilityType.MeleeAttack:
            case AbilityType.MeleeWeapon:
                return AbilityMeleeAttackData.properties
            case AbilityType.RangedAttack:
            case AbilityType.RangedWeapon:
                return AbilityRangedAttackData.properties
            case AbilityType.ThrownWeapon:
                return AbilityThrownAttackData.properties
            case AbilityType.Feature:
                return AbilityFeatureData.properties
            case AbilityType.Custom:
                return AbilityCustomData.properties
        }
    }
}

export default AbilityDataFactory
