import { ModifierSetType } from '.'
import ModifierSetSpellAttributeData from './spellAttribute'
import ModifierSetSenseData from './sense'
import ModifierSetSizeData from './size'
import ModifierSetLanguageProficiencyData from './languageProficiency'
import ModifierSetSaveProficiencyData from './saveProficiency'
import ModifierSetSkillProficiencyData from './skillProficiency'
import ModifierSetToolProficiencyData from './toolProficiency'
import ModifierSetArmorProficiencyData from './armorProficiency'
import ModifierSetWeaponProficiencyData from './weaponProficiency'
import { simplifyObjectProperties, validateObjectProperties, hasObjectProperties } from 'structure/database'
import { isEnum, isRecord } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IModifierSetData, IModifierSetSpellAttributeData } from 'types/database/files/modifier'

export type ModifierSetData = ModifierSetSpellAttributeData |
ModifierSetSenseData | ModifierSetSizeData | ModifierSetSaveProficiencyData |
ModifierSetSkillProficiencyData | ModifierSetToolProficiencyData |
ModifierSetLanguageProficiencyData | ModifierSetArmorProficiencyData |
ModifierSetWeaponProficiencyData

const ModifierSetDataFactory = {
    create: function (data: Simplify<IModifierSetData> = {}): ModifierSetData {
        switch (data.subtype) {
            case ModifierSetType.Size:
                return new ModifierSetSizeData(data)
            case ModifierSetType.Sense:
                return new ModifierSetSenseData(data)
            case ModifierSetType.SaveProficiency:
                return new ModifierSetSaveProficiencyData(data)
            case ModifierSetType.SkillProficiency:
                return new ModifierSetSkillProficiencyData(data)
            case ModifierSetType.ToolProficiency:
                return new ModifierSetToolProficiencyData(data)
            case ModifierSetType.LanguageProficiency:
                return new ModifierSetLanguageProficiencyData(data)
            case ModifierSetType.ArmorProficiency:
                return new ModifierSetArmorProficiencyData(data)
            case ModifierSetType.WeaponProficiency:
                return new ModifierSetWeaponProficiencyData(data)
            case ModifierSetType.SpellAttribute:
            default:
                return new ModifierSetSpellAttributeData(data as IModifierSetSpellAttributeData)
        }
    },
    is: function (data: unknown): data is IModifierSetData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IModifierSetData> & { key: string } {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IModifierSetData): Simplify<IModifierSetData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IModifierSetData, ModifierSetData> {
        const type = isRecord(data) && isEnum(data.subtype, ModifierSetType)
            ? data.subtype
            : ModifierSetType.SpellAttribute
        switch (type) {
            case ModifierSetType.SpellAttribute:
                return ModifierSetSpellAttributeData.properties
            case ModifierSetType.Size:
                return ModifierSetSizeData.properties
            case ModifierSetType.Sense:
                return ModifierSetSenseData.properties
            case ModifierSetType.SaveProficiency:
                return ModifierSetSaveProficiencyData.properties
            case ModifierSetType.SkillProficiency:
                return ModifierSetSkillProficiencyData.properties
            case ModifierSetType.ToolProficiency:
                return ModifierSetToolProficiencyData.properties
            case ModifierSetType.LanguageProficiency:
                return ModifierSetLanguageProficiencyData.properties
            case ModifierSetType.ArmorProficiency:
                return ModifierSetArmorProficiencyData.properties
            case ModifierSetType.WeaponProficiency:
                return ModifierSetWeaponProficiencyData.properties
        }
    }
} satisfies IDatabaseFactory<IModifierSetData, ModifierSetData>

export default ModifierSetDataFactory
