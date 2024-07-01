import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createMultipleChoiceData, validateChoiceData } from '../common'
import { asEnum, asNumber, isEnum } from 'utils'
import { Language, ProficiencyLevelBasic } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { INonChoiceData, IModifierSetLanguageProficiencyData, IEditorChoiceData, MultipleChoiceData } from 'types/database/files/modifier'

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
            get value() { return { isChoice: false, value: Language.Common } satisfies INonChoiceData<Language> },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, Language)),
            simplify: (value) => value.isChoice || value.value !== Language.Common ? value : null
        },
        value: {
            value: ProficiencyLevelBasic.Proficient,
            validate: (value) => isEnum(value, ProficiencyLevelBasic)
        }
    }

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.proficiency.isChoice) {
            return { type: 'enum', value: this.proficiency.value, enum: 'language' }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.proficienciesLanguage.subscribe({
            target: self,
            apply: function (value, choices): Partial<Record<Language, ProficiencyLevelBasic>> {
                const modifier = self.data as ModifierSetLanguageProficiencyData
                if (modifier.proficiency.isChoice) {
                    const index = asNumber(choices[self.id])
                    if (index in modifier.proficiency.value) {
                        const proficiency = modifier.proficiency.value[index]
                        return { ...value, [proficiency]: modifier.value }
                    } else {
                        return value
                    }
                } else {
                    return { ...value, [modifier.proficiency.value]: modifier.value }
                }
            }
        })
    }
}

export default ModifierSetLanguageProficiencyData
