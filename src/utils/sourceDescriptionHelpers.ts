import { AdvantageBinding, ConditionBinding, DamageBinding } from "structure/dnd";

export function createAdvantageBindingSourceDescription(binding: AdvantageBinding, notes: string): string {
    // TODO: Implement localization
    let prefix: string
    switch (binding) {
        case AdvantageBinding.Saves:
            prefix = "On Saves"
            break;
        case AdvantageBinding.StrengthSave:
            prefix = "On Strength Saves"
            break;
        case AdvantageBinding.DexteritySave:
            prefix = "On Dexterity Saves"
            break;
        case AdvantageBinding.ConstitutionSave:
            prefix = "On Constitution Saves"
            break;
        case AdvantageBinding.IntelligenceSave:
            prefix = "On Intelligence Saves"
            break;
        case AdvantageBinding.WisdomSave:
            prefix = "On Wisdom Saves"
            break;
        case AdvantageBinding.CharismaSave:
            prefix = "On Charisma Saves"
            break;
        case AdvantageBinding.Checks:
            prefix = "On Checks"
            break;
        case AdvantageBinding.StrengthCheck:
            prefix = "On Strength Checks"
            break;
        case AdvantageBinding.DexterityCheck:
            prefix = "On Dexterity Checks"
            break;
        case AdvantageBinding.ConstitutionCheck:
            prefix = "On Constitution Checks"
            break;
        case AdvantageBinding.IntelligenceCheck:
            prefix = "On Intelligence Checks"
            break;
        case AdvantageBinding.WisdomCheck:
            prefix = "On Wisdom Checks"
            break;
        case AdvantageBinding.CharismaCheck:
            prefix = "On Charisma Checks"
            break;
        case AdvantageBinding.SkillChecks:
            prefix = "On Skill Checks"
            break;
        case AdvantageBinding.AcrobaticsCheck:
            prefix = "On Acrobatics Checks"
            break;
        case AdvantageBinding.AnimalHandlingCheck:
            prefix = "On Animal Handling Checks"
            break;
        case AdvantageBinding.ArcanaCheck:
            prefix = "On Arcana Checks"
            break;
        case AdvantageBinding.AthleticsCheck:
            prefix = "On Athletics Checks"
            break;
        case AdvantageBinding.DeceptionCheck:
            prefix = "On Deception Checks"
            break;
        case AdvantageBinding.HistoryCheck:
            prefix = "On History Checks"
            break;
        case AdvantageBinding.InsightCheck:
            prefix = "On Insight Checks"
            break;
        case AdvantageBinding.IntimidationCheck:
            prefix = "On Intimidation Checks"
            break;
        case AdvantageBinding.InvestigationCheck:
            prefix = "On Investigation Check"
            break;
        case AdvantageBinding.MedicineCheck:
            prefix = "On Medicine Checks"
            break;
        case AdvantageBinding.NatureCheck:
            prefix = "On Nature Checks"
            break;
        case AdvantageBinding.PerceptionCheck:
            prefix = "On Perception Checks"
            break;
        case AdvantageBinding.PerformanceCheck:
            prefix = "On Performance Checks"
            break;
        case AdvantageBinding.PersuasionCheck:
            prefix = "On Persuasion Checks"
            break;
        case AdvantageBinding.ReligionCheck:
            prefix = "On Religion Checks"
            break;
        case AdvantageBinding.SleightOfHandCheck:
            prefix = "On Sleight of Hand Checks"
            break;
        case AdvantageBinding.StealthCheck:
            prefix = "On Stealth Checks"
            break;
        case AdvantageBinding.SurvivalCheck:
            prefix = "On Survival Checks"
            break;
        case AdvantageBinding.Attack:
            prefix = "On Attacks"
            break;
        case AdvantageBinding.Initiative:
            prefix = "On Initiative"
            break;
        case AdvantageBinding.Generic:
        default:
            return notes
    }

    return `${prefix} (${notes})`
}

export function createDamageBindingSourceDescription(binding: DamageBinding, notes: string): string {
    // TODO: Implement localization
    let prefix: string
    switch (binding) {
        case DamageBinding.Acid:
            prefix = "Against Acid Damage"
            break;
        case DamageBinding.Bludgeoning:
            prefix = "Against Bludgeoning Damage"
            break;
        case DamageBinding.Cold:
            prefix = "Against Cold Damage"
            break;
        case DamageBinding.Fire:
            prefix = "Against Fire Damage"
            break;
        case DamageBinding.Force:
            prefix = "Against Force Damage"
            break;
        case DamageBinding.Lightning:
            prefix = "Against Lightning Damage"
            break;
        case DamageBinding.Necrotic:
            prefix = "Against Necrotic Damage"
            break;
        case DamageBinding.Piercing:
            prefix = "Against Piercing Damage"
            break;
        case DamageBinding.Poison:
            prefix = "Against Poison Damage"
            break;
        case DamageBinding.Psychic:
            prefix = "Against Psychic Damage"
            break;
        case DamageBinding.Radiant:
            prefix = "Against Radiant Damage"
            break;
        case DamageBinding.Slashing:
            prefix = "Against Slashing Damage"
            break;
        case DamageBinding.Thunder:
            prefix = "Against Thunder Damage"
            break;
        case DamageBinding.Generic:
        default:
            return notes
    }

    return `${prefix} (${notes})`
}

export function createConditionBindingSourceDescription(binding: ConditionBinding, notes: string): string {
    // TODO: Implement localization
    let prefix: string
    switch (binding) {
        case ConditionBinding.Blinded:
            prefix = "Against Blinded"
            break;
        case ConditionBinding.Charmed:
            prefix = "Against Charmed"
            break;
        case ConditionBinding.Deafened:
            prefix = "Against Deafened"
            break;
        case ConditionBinding.Diseased:
            prefix = "Against Diseased"
            break;
        case ConditionBinding.Exhaustion:
            prefix = "Against Exhaustion"
            break;
        case ConditionBinding.Frightened:
            prefix = "Against Frightened"
            break;
        case ConditionBinding.Grappled:
            prefix = "Against Grappled"
            break;
        case ConditionBinding.Incapacitated:
            prefix = "Against Incapacitated"
            break;
        case ConditionBinding.Invisible:
            prefix = "Against Invisible"
            break;
        case ConditionBinding.Paralyzed:
            prefix = "Against Paralyzed"
            break;
        case ConditionBinding.Petrified:
            prefix = "Against Petrified"
            break;
        case ConditionBinding.Poisoned:
            prefix = "Against Poisoned"
            break;
        case ConditionBinding.Restrained:
            prefix = "Against Restrained"
            break;
        case ConditionBinding.Sleep:
            prefix = "Against Sleep"
            break;
        case ConditionBinding.Stunned:
            prefix = "Against Stunned"
            break;
        case ConditionBinding.Unconscious:
            prefix = "Against Unconscious"
            break;
        case ConditionBinding.Generic:
        default:
            return notes
    }

    return `${prefix} (${notes})`
}