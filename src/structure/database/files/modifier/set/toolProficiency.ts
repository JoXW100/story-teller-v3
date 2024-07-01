import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createDefaultChoiceData, createMultipleChoiceData, simplifyMultipleChoiceData, validateChoiceData } from '../common'
import { asEnum, isEnum, isNumber } from 'utils'
import { ToolType, ProficiencyLevel } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { MultipleChoiceData, IModifierSetToolProficiencyData, IEditorChoiceData } from 'types/database/files/modifier'

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

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.proficiency.isChoice) {
            return { type: 'enum', value: this.proficiency.value, enum: 'tool' }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.proficienciesTool.subscribe({
            target: self,
            apply: function (value, choices): Partial<Record<ToolType, ProficiencyLevel>> {
                const modifier = self.data as ModifierSetToolProficiencyData
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

export default ModifierSetToolProficiencyData
