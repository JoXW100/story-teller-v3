import { ModifierAddType } from '.'
import ModifierAddFeatData from './linked'
import ModifierAddAbilityData from './ability'
import ModifierAddSpellData from './spell'
import ModifierAddAdvantageData from './advantage'
import ModifierAddDisadvantageData from './disadvantage'
import ModifierAddResistanceData from './resistance'
import ModifierAddVulnerabilityData from './vulnerability'
import ModifierAddDamageImmunityData from './damageImmunity'
import ModifierAddConditionImmunityData from './conditionImmunity'
import ModifierAddClassSpellData from './classSpell'
import ModifierAddModifierData from './modifier'
import { isEnum, isRecord } from 'utils'
import { simplifyObjectProperties, validateObjectProperties, hasObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IModifierAddData, IModifierAddModifierData } from 'types/database/files/modifier'

export type ModifierAddData = ModifierAddAbilityData | ModifierAddSpellData |
ModifierAddAdvantageData | ModifierAddDisadvantageData |
ModifierAddResistanceData | ModifierAddVulnerabilityData |
ModifierAddDamageImmunityData | ModifierAddConditionImmunityData |
ModifierAddFeatData | ModifierAddClassSpellData | ModifierAddModifierData

const ModifierAddDataFactory = {
    create: function (data: Simplify<IModifierAddData> = {}): ModifierAddData {
        switch (data.subtype) {
            case ModifierAddType.Linked:
                return new ModifierAddFeatData(data)
            case ModifierAddType.Spell:
                return new ModifierAddSpellData(data)
            case ModifierAddType.ClassSpell:
                return new ModifierAddClassSpellData(data)
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
                return new ModifierAddAbilityData(data)
            case ModifierAddType.Modifier:
            default:
                return new ModifierAddModifierData(data as Simplify<IModifierAddModifierData>)
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
            : ModifierAddType.Modifier
        switch (type) {
            case ModifierAddType.Linked:
                return ModifierAddFeatData.properties
            case ModifierAddType.Spell:
                return ModifierAddSpellData.properties
            case ModifierAddType.ClassSpell:
                return ModifierAddClassSpellData.properties
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
            case ModifierAddType.Modifier:
                return ModifierAddModifierData.properties
        }
    }
} satisfies IDatabaseFactory<IModifierAddData, ModifierAddData>

export default ModifierAddDataFactory
