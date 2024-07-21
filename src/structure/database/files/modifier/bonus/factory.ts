import { ModifierBonusType } from '.'
import ModifierBonusACData from './ac'
import ModifierBonusMultiAttackData from './multiAttack'
import ModifierBonusSpeedData from './speed'
import ModifierBonusAttunementSlotsData from './attunementSlots'
import ModifierBonusAbilityScoreData from './abilityScore'
import ModifierBonusSaveData from './save'
import ModifierBonusSkillData from './skill'
import ModifierBonusSpellAttackData from './spellAttack'
import ModifierBonusSpellSaveData from './spellSave'
import ModifierBonusCritRangeData from './critRange'
import ModifierBonusCritDieCountData from './critDieCount'
import { isEnum, isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IModifierBonusACData, IModifierBonusData } from 'types/database/files/modifier'

export type ModifierBonusData = ModifierBonusACData |
ModifierBonusAbilityScoreData | ModifierBonusSaveData | ModifierBonusSkillData |
ModifierBonusSpellAttackData | ModifierBonusSpellSaveData |
ModifierBonusMultiAttackData | ModifierBonusSpeedData |
ModifierBonusAttunementSlotsData | ModifierBonusCritRangeData |
ModifierBonusCritDieCountData

const ModifierBonusDataFactory: IDatabaseFactory<IModifierBonusData, ModifierBonusData> = {
    create: function (data: Simplify<IModifierBonusData> = {}): ModifierBonusData {
        switch (data.subtype) {
            case ModifierBonusType.AbilityScore:
                return new ModifierBonusAbilityScoreData(data)
            case ModifierBonusType.Save:
                return new ModifierBonusSaveData(data)
            case ModifierBonusType.Skill:
                return new ModifierBonusSkillData(data)
            case ModifierBonusType.Speed:
                return new ModifierBonusSpeedData(data)
            case ModifierBonusType.SpellAttack:
                return new ModifierBonusSpellAttackData(data)
            case ModifierBonusType.CritRange:
                return new ModifierBonusCritRangeData(data)
            case ModifierBonusType.CritDieCount:
                return new ModifierBonusCritDieCountData(data)
            case ModifierBonusType.SpellSave:
                return new ModifierBonusSpellSaveData(data)
            case ModifierBonusType.MultiAttack:
                return new ModifierBonusMultiAttackData(data)
            case ModifierBonusType.AttunementSlot:
                return new ModifierBonusAttunementSlotsData(data)
            case ModifierBonusType.AC:
            default:
                return new ModifierBonusACData(data as Simplify<IModifierBonusACData>)
        }
    },
    is: function (data: unknown): data is IModifierBonusData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IModifierBonusData> & { key: string } {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IModifierBonusData): Simplify<IModifierBonusData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IModifierBonusData, ModifierBonusData> {
        const type = isRecord(data) && isEnum(data.subtype, ModifierBonusType)
            ? data.subtype
            : ModifierBonusType.AC
        switch (type) {
            case ModifierBonusType.AC:
                return ModifierBonusACData.properties
            case ModifierBonusType.AbilityScore:
                return ModifierBonusAbilityScoreData.properties
            case ModifierBonusType.Save:
                return ModifierBonusSaveData.properties
            case ModifierBonusType.Skill:
                return ModifierBonusSkillData.properties
            case ModifierBonusType.Speed:
                return ModifierBonusSpeedData.properties
            case ModifierBonusType.CritRange:
                return ModifierBonusCritRangeData.properties
            case ModifierBonusType.CritDieCount:
                return ModifierBonusCritDieCountData.properties
            case ModifierBonusType.SpellAttack:
                return ModifierBonusSpellAttackData.properties
            case ModifierBonusType.SpellSave:
                return ModifierBonusSpellSaveData.properties
            case ModifierBonusType.MultiAttack:
                return ModifierBonusMultiAttackData.properties
            case ModifierBonusType.AttunementSlot:
                return ModifierBonusAttunementSlotsData.properties
        }
    }
}

export default ModifierBonusDataFactory
