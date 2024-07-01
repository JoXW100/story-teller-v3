import { ModifierBonusType } from '.'
import ModifierBonusACData from './ac'
import { isEnum, isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IModifierBonusACData, IModifierBonusData } from 'types/database/files/modifier'
import ModifierBonusStrengthData from './strength'
import ModifierBonusDexterityData from './dexterity'
import ModifierBonusConstitutionData from './constitution'
import ModifierBonusIntelligenceData from './intelligence'
import ModifierBonusWisdomData from './wisdom'
import ModifierBonusCharismaData from './charisma'
import ModifierBonusAllAbilityScoresData from './allAbilityScores'

export type ModifierBonusData = ModifierBonusACData | ModifierBonusStrengthData |
ModifierBonusDexterityData | ModifierBonusConstitutionData |
ModifierBonusIntelligenceData | ModifierBonusWisdomData |
ModifierBonusCharismaData | ModifierBonusAllAbilityScoresData

const ModifierBonusDataFactory: IDatabaseFactory<IModifierBonusData, ModifierBonusData> = {
    create: function (data: Simplify<IModifierBonusData> = {}): ModifierBonusData {
        switch (data.subtype) {
            case ModifierBonusType.AllAbilityScores:
                return new ModifierBonusAllAbilityScoresData(data)
            case ModifierBonusType.Strength:
                return new ModifierBonusStrengthData(data)
            case ModifierBonusType.Dexterity:
                return new ModifierBonusDexterityData(data)
            case ModifierBonusType.Constitution:
                return new ModifierBonusConstitutionData(data)
            case ModifierBonusType.Intelligence:
                return new ModifierBonusIntelligenceData(data)
            case ModifierBonusType.Wisdom:
                return new ModifierBonusWisdomData(data)
            case ModifierBonusType.Charisma:
                return new ModifierBonusCharismaData(data)
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
            case ModifierBonusType.AllAbilityScores:
                return ModifierBonusAllAbilityScoresData.properties
            case ModifierBonusType.Strength:
                return ModifierBonusStrengthData.properties
            case ModifierBonusType.Dexterity:
                return ModifierBonusDexterityData.properties
            case ModifierBonusType.Constitution:
                return ModifierBonusConstitutionData.properties
            case ModifierBonusType.Intelligence:
                return ModifierBonusIntelligenceData.properties
            case ModifierBonusType.Wisdom:
                return ModifierBonusWisdomData.properties
            case ModifierBonusType.Charisma:
                return ModifierBonusCharismaData.properties
            case ModifierBonusType.AC:
                return ModifierBonusACData.properties
        }
    }
}

export default ModifierBonusDataFactory
