import { ModifierAddType } from '.'
import ModifierAddAbilityData from './ability'
import ModifierAddSpellData from './spell'
import ModifierAddAdvantageData from './advantage'
import ModifierAddDisadvantageData from './disadvantage'
import ModifierAddResistanceData from './resistance'
import ModifierAddVulnerabilityData from './vulnerability'
import ModifierAddDamageImmunityData from './damageImmunity'
import ModifierAddConditionImmunityData from './conditionImmunity'
import { isEnum, isRecord } from 'utils'
import { simplifyObjectProperties, validateObjectProperties, hasObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IModifierAddAbilityData, IModifierAddData } from 'types/database/files/modifier'

export type ModifierAddData = ModifierAddAbilityData | ModifierAddSpellData |
ModifierAddAdvantageData | ModifierAddDisadvantageData |
ModifierAddResistanceData | ModifierAddVulnerabilityData |
ModifierAddDamageImmunityData | ModifierAddConditionImmunityData

const ModifierAddDataFactory = {
    create: function (data: Simplify<IModifierAddData> = {}): ModifierAddData {
        switch (data.subtype) {
            case ModifierAddType.Spell:
                return new ModifierAddSpellData(data)
            case ModifierAddType.Advantage:
                return new ModifierAddAdvantageData(data)
            case ModifierAddType.Disadvantage:
                return new ModifierAddDisadvantageData(data)
            case ModifierAddType.Resistance:
                return new ModifierAddResistanceData(data)
            case ModifierAddType.Vulnerability:
                return new ModifierAddVulnerabilityData(data)
            case ModifierAddType.DamageImmunity:
                return new ModifierAddDamageImmunityData(data)
            case ModifierAddType.ConditionImmunity:
                return new ModifierAddConditionImmunityData(data)
            case ModifierAddType.Ability:
            default:
                return new ModifierAddAbilityData(data as Simplify<IModifierAddAbilityData>)
        }
    },
    is: function (data: unknown): data is IModifierAddData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IModifierAddData> & { key: string } {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IModifierAddData): Simplify<IModifierAddData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IModifierAddData, ModifierAddData> {
        const type = isRecord(data) && isEnum(data.subtype, ModifierAddType)
            ? data.subtype
            : ModifierAddType.Ability
        switch (type) {
            case ModifierAddType.Spell:
                return ModifierAddSpellData.properties
            case ModifierAddType.Advantage:
                return ModifierAddAdvantageData.properties
            case ModifierAddType.Disadvantage:
                return ModifierAddDisadvantageData.properties
            case ModifierAddType.Resistance:
                return ModifierAddResistanceData.properties
            case ModifierAddType.Vulnerability:
                return ModifierAddVulnerabilityData.properties
            case ModifierAddType.DamageImmunity:
                return ModifierAddDamageImmunityData.properties
            case ModifierAddType.ConditionImmunity:
                return ModifierAddConditionImmunityData.properties
            case ModifierAddType.Ability:
                return ModifierAddAbilityData.properties
        }
    }
} satisfies IDatabaseFactory<IModifierAddData, ModifierAddData>

export default ModifierAddDataFactory
