import { AdvantageBinding, Attribute, type OptionalAttribute, ProficiencyLevel, ScalingType, Skill, SpellLevel, type ClassLevel } from 'structure/dnd'
import type { IProperties } from 'types/editor'
import { asEnum, asNumber, keysOf } from 'utils'

export function getAttributeModifier(stats: Partial<IProperties>, attr: Attribute): number {
    return Math.ceil((asNumber(stats[attr], 10) - 11) / 2.0)
}

export function getScalingValue(scaling: ScalingType | OptionalAttribute, properties: Partial<IProperties>): number {
    switch (scaling) {
        case ScalingType.Constant:
            return 1
        case ScalingType.Proficiency:
            return properties.proficiency ?? 2
        case ScalingType.Finesse:
            return Math.max(getScalingValue(ScalingType.STR, properties), getScalingValue(ScalingType.DEX, properties))
        case ScalingType.SpellModifier: {
            if (properties.spellAttribute !== undefined) {
                return getScalingValue(properties.spellAttribute, properties)
            } else {
                return 0
            }
        }
        case ScalingType.STR:
        case ScalingType.DEX:
        case ScalingType.CON:
        case ScalingType.INT:
        case ScalingType.WIS:
        case ScalingType.CHA: {
            const attribute = asEnum(scaling, Attribute)
            return (attribute != null) ? getAttributeModifier(properties, attribute) : 0
        }
        case ScalingType.Level:
        case ScalingType.ClassLevel:
        case ScalingType.SpellLevel:
        case ScalingType.AttunedItems:
        case ScalingType.WalkSpeed:
        case ScalingType.BurrowSpeed:
        case ScalingType.ClimbSpeed:
        case ScalingType.FlySpeed:
        case ScalingType.HoverSpeed:
        case ScalingType.SwimSpeed:
            return properties[scaling] ?? 0
        default:
            return 0
    }
}

export function resolveScaling(scaling: Partial<Record<ScalingType, number>>, stats: Partial<IProperties>, required: boolean = false): number {
    let sum: number = 0
    let flag: boolean = required
    for (const type of keysOf(scaling)) {
        flag = true
        sum += getScalingValue(type, stats) * (scaling[type] ?? 0)
    }
    return flag ? Math.floor(sum) : 1
}

export function getSpellLevelValue(level: SpellLevel): number {
    switch (level) {
        case SpellLevel.Cantrip:
            return 0
        case SpellLevel.Level1:
            return 1
        case SpellLevel.Level2:
            return 2
        case SpellLevel.Level3:
            return 3
        case SpellLevel.Level4:
            return 4
        case SpellLevel.Level5:
            return 5
        case SpellLevel.Level6:
            return 6
        case SpellLevel.Level7:
            return 7
        case SpellLevel.Level8:
            return 8
        case SpellLevel.Level9:
            return 9
    }
}
export function getMaxSpellLevel(...levels: SpellLevel[]): SpellLevel {
    return levels.length > 0 ? getSpellLevelFromValue(Math.max(...levels.map(getSpellLevelValue))) ?? SpellLevel.Cantrip : SpellLevel.Cantrip
}

export function getSpellLevelFromValue(level: number): SpellLevel | null {
    switch (level) {
        case 0:
            return SpellLevel.Cantrip
        case 1:
            return SpellLevel.Level1
        case 2:
            return SpellLevel.Level2
        case 3:
            return SpellLevel.Level3
        case 4:
            return SpellLevel.Level4
        case 5:
            return SpellLevel.Level5
        case 6:
            return SpellLevel.Level6
        case 7:
            return SpellLevel.Level7
        case 8:
            return SpellLevel.Level8
        case 9:
            return SpellLevel.Level9
        default:
            return null
    }
}

export function getPreviousClassLevels(level: ClassLevel): ClassLevel[] {
    const value: ClassLevel[] = []
    for (let i = 1; i <= Number(level); i++) {
        value.push(String(i) as ClassLevel)
    }
    return value
}

export function getProficiencyBonusFromLevel(level: number): number {
    return Math.floor((level + 7) / 4)
}

const MaxProficiencyLevel: ProficiencyLevel = ProficiencyLevel.Expert
const ProficiencyLevelValueMap: Record<ProficiencyLevel, number> = {
    [ProficiencyLevel.None]: 0,
    [ProficiencyLevel.HalfProficient]: 0.5,
    [ProficiencyLevel.Proficient]: 1,
    [ProficiencyLevel.Expert]: 2
}

export function getProficiencyLevelValue(proficiency?: ProficiencyLevel): number {
    return ProficiencyLevelValueMap[proficiency ?? ProficiencyLevel.None]
}

export function getMaxProficiencyLevel(...proficiencies: (ProficiencyLevel | undefined)[]): ProficiencyLevel {
    let maxValue: number = 0
    let maxProficiency: ProficiencyLevel = ProficiencyLevel.None
    for (const proficiency of proficiencies) {
        if (proficiency === undefined) {
            continue
        }
        if (proficiency === MaxProficiencyLevel) {
            return proficiency
        }
        const proficiencyLevelValue = getProficiencyLevelValue(proficiency)
        if (proficiencyLevelValue > maxValue) {
            maxValue = proficiencyLevelValue
            maxProficiency = proficiency
        }
    }
    return maxProficiency
}

export function getSkillAdvantageBinding(skill: Skill): AdvantageBinding {
    switch (skill) {
        case Skill.Acrobatics:
            return AdvantageBinding.AthleticsCheck
        case Skill.AnimalHandling:
            return AdvantageBinding.AnimalHandlingCheck
        case Skill.Arcana:
            return AdvantageBinding.ArcanaCheck
        case Skill.Athletics:
            return AdvantageBinding.AthleticsCheck
        case Skill.Deception:
            return AdvantageBinding.DeceptionCheck
        case Skill.History:
            return AdvantageBinding.HistoryCheck
        case Skill.Insight:
            return AdvantageBinding.InsightCheck
        case Skill.Intimidation:
            return AdvantageBinding.IntimidationCheck
        case Skill.Investigation:
            return AdvantageBinding.InvestigationCheck
        case Skill.Medicine:
            return AdvantageBinding.MedicineCheck
        case Skill.Nature:
            return AdvantageBinding.NatureCheck
        case Skill.Perception:
            return AdvantageBinding.PerceptionCheck
        case Skill.Performance:
            return AdvantageBinding.PerformanceCheck
        case Skill.Persuasion:
            return AdvantageBinding.PerformanceCheck
        case Skill.Religion:
            return AdvantageBinding.ReligionCheck
        case Skill.SleightOfHand:
            return AdvantageBinding.SleightOfHandCheck
        case Skill.Stealth:
            return AdvantageBinding.StealthCheck
        case Skill.Survival:
            return AdvantageBinding.SurvivalCheck
    }
}

export function getSkillAttribute(skill: Skill): Attribute {
    switch (skill) {
        case Skill.Athletics:
            return Attribute.STR
        case Skill.Acrobatics:
        case Skill.SleightOfHand:
        case Skill.Stealth:
            return Attribute.DEX
        case Skill.Arcana:
        case Skill.History:
        case Skill.Investigation:
        case Skill.Nature:
        case Skill.Religion:
            return Attribute.INT
        case Skill.AnimalHandling:
        case Skill.Insight:
        case Skill.Medicine:
        case Skill.Perception:
        case Skill.Survival:
            return Attribute.WIS
        case Skill.Deception:
        case Skill.Intimidation:
        case Skill.Performance:
        case Skill.Persuasion:
            return Attribute.CHA
    }
}

export function getSkillAttributeCheckAdvantageBinding(skill: Skill): AdvantageBinding {
    switch (getSkillAttribute(skill)) {
        case Attribute.STR:
            return AdvantageBinding.StrengthCheck
        case Attribute.DEX:
            return AdvantageBinding.DexterityCheck
        case Attribute.CON:
            return AdvantageBinding.ConstitutionCheck
        case Attribute.INT:
            return AdvantageBinding.IntelligenceCheck
        case Attribute.WIS:
            return AdvantageBinding.WisdomCheck
        case Attribute.CHA:
            return AdvantageBinding.CharismaCheck
    }
}

export function getAttributeSaveAdvantageBinding(skill: Attribute): AdvantageBinding {
    switch (skill) {
        case Attribute.STR:
            return AdvantageBinding.StrengthSave
        case Attribute.DEX:
            return AdvantageBinding.DexteritySave
        case Attribute.CON:
            return AdvantageBinding.ConstitutionSave
        case Attribute.INT:
            return AdvantageBinding.IntelligenceSave
        case Attribute.WIS:
            return AdvantageBinding.WisdomSave
        case Attribute.CHA:
            return AdvantageBinding.CharismaSave
    }
}
