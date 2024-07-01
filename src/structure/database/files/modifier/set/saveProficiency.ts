import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createDefaultChoiceData, createMultipleChoiceData, simplifyMultipleChoiceData, validateChoiceData } from '../common'
import { asEnum, isEnum, isNumber } from 'utils'
import { Attribute, ProficiencyLevel } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { MultipleChoiceData, IModifierSetSaveProficiencyData, IEditorChoiceData } from 'types/database/files/modifier'

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

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.proficiency.isChoice) {
            return { type: 'enum', value: this.proficiency.value, enum: 'attr' }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.proficienciesSave.subscribe({
            target: self,
            apply: function (value, choices): Partial<Record<Attribute, ProficiencyLevel>> {
                const modifier = self.data as ModifierSetSaveProficiencyData
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

export default ModifierSetSaveProficiencyData
