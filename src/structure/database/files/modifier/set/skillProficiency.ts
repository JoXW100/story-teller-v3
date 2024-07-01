import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createDefaultChoiceData, createMultipleChoiceData, simplifyMultipleChoiceData, validateChoiceData } from '../common'
import { asEnum, isEnum, isNumber } from 'utils'
import { Skill, ProficiencyLevel } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { MultipleChoiceData, IModifierSetSkillProficiencyData, IEditorChoiceData } from 'types/database/files/modifier'

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

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.proficiency.isChoice) {
            return { type: 'enum', value: this.proficiency.value, enum: 'skill' }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.proficienciesSkill.subscribe({
            target: self,
            apply: function (value, choices): Partial<Record<Skill, ProficiencyLevel>> {
                const modifier = self.data as ModifierSetSkillProficiencyData
                if (modifier.proficiency.isChoice) {
                    const index: unknown = choices[self.id]
                    if (!isNumber(index)) {
                        return value
                    }

                    const proficiency = modifier.proficiency.value[index] ?? null
                    if (proficiency !== null) {
                        return { ...value, [proficiency]: modifier.value }
                    }
                } else {
                    return { ...value, [modifier.proficiency.value]: modifier.value }
                }
                return value
            }
        })
    }
}

export default ModifierSetSkillProficiencyData
