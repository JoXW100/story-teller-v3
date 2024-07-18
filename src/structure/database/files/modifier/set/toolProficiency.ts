import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createMultipleChoiceData, createDefaultChoiceData, validateChoiceData, simplifyMultipleChoiceData } from '../../../choice'
import { asEnum, isEnum, isNumber } from 'utils'
import { ToolType, ProficiencyLevel } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetToolProficiencyData } from 'types/database/files/modifier'
import type { MultipleChoiceData } from 'types/database/choice'

class ModifierSetToolProficiencyData extends ModifierSetDataBase implements IModifierSetToolProficiencyData {
    public override readonly subtype = ModifierSetType.ToolProficiency
    public readonly proficiency: MultipleChoiceData<ToolType>
    public readonly value: ProficiencyLevel

    public constructor(data: Simplify<IModifierSetToolProficiencyData>) {
        super(data)
        this.proficiency = createMultipleChoiceData<ToolType>(data.proficiency, (value) => asEnum(value, ToolType) ?? ToolType.AlchemistsSupplies)
        this.value = asEnum(data.value, ProficiencyLevel) ?? ModifierSetToolProficiencyData.properties.value.value
    }

    public static properties: DataPropertyMap<IModifierSetToolProficiencyData, ModifierSetToolProficiencyData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.ToolProficiency,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        proficiency: {
            get value() { return createDefaultChoiceData(ToolType.AlchemistsSupplies) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, ToolType)),
            simplify: (value) => simplifyMultipleChoiceData(value, ToolType.AlchemistsSupplies)
        },
        value: {
            value: ProficiencyLevel.Proficient,
            validate: (value) => isEnum(value, ProficiencyLevel)
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        if (this.proficiency.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'enum',
                value: this.proficiency.value,
                enum: 'tool',
                numChoices: this.proficiency.numChoices
            }, key)
        }
        modifier.proficienciesTool.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value, choices): Partial<Record<ToolType, ProficiencyLevel>> {
                const modifier = this.data as ModifierSetToolProficiencyData
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

export default ModifierSetToolProficiencyData
