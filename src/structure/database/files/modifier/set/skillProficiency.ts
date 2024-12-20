import ModifierSetDataBase, { ModifierSetType } from '.'
import type Modifier from '../modifier'
import { asEnum, isEnum, isNumber } from 'utils'
import { getMaxProficiencyLevel } from 'utils/calculations'
import { Skill, ProficiencyLevel } from 'structure/dnd'
import { createDefaultChoiceData, createMultipleChoiceData, simplifyMultipleChoiceData, validateChoiceData } from 'structure/database/choice'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetSkillProficiencyData } from 'types/database/files/modifier'
import type { MultipleChoiceData } from 'types/database/choice'

class ModifierSetSkillProficiencyData extends ModifierSetDataBase implements IModifierSetSkillProficiencyData {
    public override readonly subtype = ModifierSetType.SkillProficiency
    public readonly proficiency: MultipleChoiceData<Skill>
    public readonly value: ProficiencyLevel

    public constructor(data: Simplify<IModifierSetSkillProficiencyData>) {
        super(data)
        this.proficiency = createMultipleChoiceData<Skill>(data.proficiency, (value) => asEnum(value, Skill) ?? Skill.Acrobatics)
        this.value = asEnum(data.value, ProficiencyLevel) ?? ModifierSetSkillProficiencyData.properties.value.value
    }

    public static properties: DataPropertyMap<IModifierSetSkillProficiencyData, ModifierSetSkillProficiencyData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.SkillProficiency,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        proficiency: {
            get value() { return createDefaultChoiceData(Skill.Acrobatics) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, Skill)),
            simplify: (value) => simplifyMultipleChoiceData(value, Skill.Acrobatics)
        },
        value: {
            value: ProficiencyLevel.Proficient,
            validate: (value) => isEnum(value, ProficiencyLevel)
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        if (this.proficiency.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'enum',
                value: this.proficiency.value,
                enum: 'skill',
                numChoices: this.proficiency.numChoices
            }, key)
        }
        modifier.proficienciesSkill.subscribe({
            key: key,
            data: this,
            apply: function (value, choices): Partial<Record<Skill, ProficiencyLevel>> {
                const modifier = this.data as ModifierSetSkillProficiencyData
                if (modifier.proficiency.isChoice) {
                    const indices: unknown = choices[key]
                    if (!Array.isArray(indices) || indices.some((value) => !isNumber(value))) {
                        return value
                    }

                    for (const index of indices) {
                        const proficiency = modifier.proficiency.value[index]
                        value = { ...value, [proficiency]: getMaxProficiencyLevel(modifier.value, value[proficiency]) }
                    }
                    return value
                } else {
                    const proficiency = modifier.proficiency.value
                    return { ...value, [proficiency]: getMaxProficiencyLevel(modifier.value, value[proficiency]) }
                }
            }
        })
    }
}

export default ModifierSetSkillProficiencyData
