import { AdvantageBinding, Attribute, type OptionalAttribute, ProficiencyLevel, ScalingType, Skill, SpellLevel, type ClassLevel } from 'structure/dnd'
import type { IConditionProperties } from 'types/database/condition'
import type { ICreatureStats } from 'types/editor'
import { asEnum, asNumber, keysOf } from 'utils'

export function getAttributeModifier(stats: Partial<ICreatureStats>, attr: Attribute): number {
    return Math.ceil((asNumber(stats[attr], 10) - 11) / 2.0)
}

export function getScalingValue(scaling: ScalingType | OptionalAttribute, stats: Partial<IConditionProperties>): number {
    switch (scaling) {
        case ScalingType.Constant:
            return 1
        case ScalingType.Proficiency:
            return stats.proficiency ?? 2
        case ScalingType.Finesse:
            return Math.max(getScalingValue(ScalingType.DEX, stats), getScalingValue(ScalingType.STR, stats))
        case ScalingType.SpellModifier: {
            if (stats.spellAttribute !== undefined) {
                return getScalingValue(stats.spellAttribute, stats)
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
            return (attribute != null) ? getAttributeModifier(stats, attribute) : 0
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
            return stats[scaling] ?? 0
        default:
            return 0
    }
}

export function resolveScaling(scaling: Partial<Record<ScalingType, number>>, stats: Partial<IConditionProperties>, required: boolean = false): number {
    let sum: number = 0
    let flag: boolean = required
    for (const type of keysOf(scaling)) {
        flag = true
        sum += getScalingValue(type, stats) * scaling[type]!
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
    return levels.length > 0 ? getSpellLevelFromValue(Math.max(...levels.map(getSpellLevelValue)))! : SpellLevel.Cantrip
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

export function getMaxProficiencyLevel(...proficiencies: Array<ProficiencyLevel | undefined>): ProficiencyLevel {
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

export const SkillAdvantageBindingMap: Record<Skill, AdvantageBinding> = {
    [Skill.Acrobatics]: AdvantageBinding.AcrobaticsCheck,
    [Skill.AnimalHandling]: AdvantageBinding.AnimalHandlingCheck,
    [Skill.Arcana]: AdvantageBinding.ArcanaCheck,
    [Skill.Athletics]: AdvantageBinding.AthleticsCheck,
    [Skill.Deception]: AdvantageBinding.DeceptionCheck,
    [Skill.History]: AdvantageBinding.HistoryCheck,
    [Skill.Insight]: AdvantageBinding.InsightCheck,
    [Skill.Intimidation]: AdvantageBinding.IntimidationCheck,
    [Skill.Investigation]: AdvantageBinding.InvestigationCheck,
    [Skill.Medicine]: AdvantageBinding.MedicineCheck,
    [Skill.Nature]: AdvantageBinding.NatureCheck,
    [Skill.Perception]: AdvantageBinding.PerceptionCheck,
    [Skill.Performance]: AdvantageBinding.PerformanceCheck,
    [Skill.Persuasion]: AdvantageBinding.PersuasionCheck,
    [Skill.Religion]: AdvantageBinding.ReligionCheck,
    [Skill.SleightOfHand]: AdvantageBinding.SleightOfHandCheck,
    [Skill.Stealth]: AdvantageBinding.StealthCheck,
    [Skill.Survival]: AdvantageBinding.SurvivalCheck
}

export const AttributeAdvantageBindingMap: Record<Attribute, AdvantageBinding> = {
    [Attribute.STR]: AdvantageBinding.StrengthSave,
    [Attribute.DEX]: AdvantageBinding.DexteritySave,
    [Attribute.CON]: AdvantageBinding.ConstitutionSave,
    [Attribute.INT]: AdvantageBinding.IntelligenceSave,
    [Attribute.WIS]: AdvantageBinding.WisdomSave,
    [Attribute.CHA]: AdvantageBinding.CharismaSave
}
