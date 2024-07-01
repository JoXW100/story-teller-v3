import { ModifierAbilityType } from '.'
import ModifierAbilityAttackBonusData from './attackBonus'
import { isEnum, isRecord } from 'utils'
import { simplifyObjectProperties, validateObjectProperties, hasObjectProperties } from 'structure/database'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IModifierAbilityAttackBonusData, IModifierAbilityData } from 'types/database/files/modifier'
import type { Simplify } from 'types'

export type ModifierAbilityData = ModifierAbilityAttackBonusData

const ModifierAbilityDataFactory = {
    create: function (data: Simplify<IModifierAbilityData> = {}): ModifierAbilityData {
        switch (data.subtype) {
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
        }
    }
} satisfies IDatabaseFactory<IModifierAbilityData, ModifierAbilityData>

export default ModifierAbilityDataFactory
