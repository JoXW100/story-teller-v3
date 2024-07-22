import ModifierSetDataBase, { ModifierSetType } from '.'
import type Modifier from '../modifier'
import { createMultipleChoiceData, createDefaultChoiceData, validateChoiceData, simplifyMultipleChoiceData } from '../../../choice'
import { asEnum, isEnum, isNumber } from 'utils'
import { getMaxProficiencyLevel } from 'utils/calculations'
import { Attribute, ProficiencyLevel } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetSaveProficiencyData } from 'types/database/files/modifier'
import type { MultipleChoiceData } from 'types/database/choice'

class ModifierSetSaveProficiencyData extends ModifierSetDataBase implements IModifierSetSaveProficiencyData {
    public override readonly subtype = ModifierSetType.SaveProficiency
    public readonly proficiency: MultipleChoiceData<Attribute>
    public readonly value: ProficiencyLevel

    public constructor(data: Simplify<IModifierSetSaveProficiencyData>) {
        super(data)
        this.proficiency = createMultipleChoiceData<Attribute>(data.proficiency, (value) => asEnum(value, Attribute) ?? Attribute.STR)
        this.value = asEnum(data.value, ProficiencyLevel) ?? ModifierSetSaveProficiencyData.properties.value.value
    }

    public static properties: DataPropertyMap<IModifierSetSaveProficiencyData, ModifierSetSaveProficiencyData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.SaveProficiency,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        proficiency: {
            get value() { return createDefaultChoiceData(Attribute.STR) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, Attribute)),
            simplify: (value) => simplifyMultipleChoiceData(value, Attribute.STR)
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
                enum: 'attr',
                numChoices: this.proficiency.numChoices
            }, key)
        }
        modifier.proficienciesSave.subscribe({
            key: key,
            data: this,
            apply: function (value, choices): Partial<Record<Attribute, ProficiencyLevel>> {
                const modifier = this.data as ModifierSetSaveProficiencyData
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

export default ModifierSetSaveProficiencyData
