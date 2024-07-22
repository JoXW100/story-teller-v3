import ModifierSetDataBase, { ModifierSetType } from '.'
import type Modifier from '../modifier'
import { createMultipleChoiceData, createDefaultChoiceData, validateChoiceData, simplifyMultipleChoiceData } from '../../../choice'
import { asEnum, isEnum, isNumber } from 'utils'
import { Language, ProficiencyLevelBasic } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetLanguageProficiencyData } from 'types/database/files/modifier'
import type { MultipleChoiceData } from 'types/database/choice'

class ModifierSetLanguageProficiencyData extends ModifierSetDataBase implements IModifierSetLanguageProficiencyData {
    public override readonly subtype = ModifierSetType.LanguageProficiency
    public readonly proficiency: MultipleChoiceData<Language>
    public readonly value: ProficiencyLevelBasic

    public constructor(data: Simplify<IModifierSetLanguageProficiencyData>) {
        super(data)
        this.proficiency = createMultipleChoiceData<Language>(data.proficiency, (value) => asEnum(value, Language) ?? Language.Common)
        this.value = asEnum(data.value, ProficiencyLevelBasic) ?? ModifierSetLanguageProficiencyData.properties.value.value
    }

    public static properties: DataPropertyMap<IModifierSetLanguageProficiencyData, ModifierSetLanguageProficiencyData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.LanguageProficiency,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        proficiency: {
            get value() { return createDefaultChoiceData(Language.Common) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, Language)),
            simplify: (value) => simplifyMultipleChoiceData(value, Language.Common)
        },
        value: {
            value: ProficiencyLevelBasic.Proficient,
            validate: (value) => isEnum(value, ProficiencyLevelBasic)
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        if (this.proficiency.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'enum',
                value: this.proficiency.value,
                enum: 'language',
                numChoices: this.proficiency.numChoices
            }, key)
        }
        modifier.proficienciesLanguage.subscribe({
            key: key,
            data: this,
            apply: function (value, choices): Partial<Record<Language, ProficiencyLevelBasic>> {
                const modifier = this.data as ModifierSetLanguageProficiencyData
                if (modifier.proficiency.isChoice) {
                    const indices: unknown = choices[key]
                    if (!Array.isArray(indices) || indices.some((value) => !isNumber(value))) {
                        return value
                    }

                    for (const index of indices) {
                        const proficiency = modifier.proficiency.value[index] ?? null
                        if (proficiency !== null) {
                            value = { ...value, [proficiency]: modifier.value }
                        }
                    }
                    return value
                } else {
                    return { ...value, [modifier.proficiency.value]: modifier.value }
                }
            }
        })
    }
}

export default ModifierSetLanguageProficiencyData
