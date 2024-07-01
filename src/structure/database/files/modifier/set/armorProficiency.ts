import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createMultipleChoiceData, validateChoiceData } from '../common'
import { asEnum, isEnum, isNumber } from 'utils'
import { ArmorType, ProficiencyLevelBasic } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { MultipleChoiceData, INonChoiceData, IModifierSetArmorProficiencyData, IEditorChoiceData } from 'types/database/files/modifier'

class ModifierSetArmorProficiencyData extends ModifierSetDataBase implements IModifierSetArmorProficiencyData {
    public override readonly subtype = ModifierSetType.ArmorProficiency
    public readonly proficiency: MultipleChoiceData<ArmorType>
    public readonly value: ProficiencyLevelBasic

    public constructor(data: Simplify<IModifierSetArmorProficiencyData>) {
        super(data)
        this.proficiency = createMultipleChoiceData<ArmorType>(data.proficiency, (value) => asEnum(value, ArmorType) ?? ArmorType.Light)
        this.value = asEnum(data.value, ProficiencyLevelBasic) ?? ModifierSetArmorProficiencyData.properties.value.value
    }

    public static properties: DataPropertyMap<IModifierSetArmorProficiencyData, ModifierSetArmorProficiencyData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.ArmorProficiency,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        proficiency: {
            get value() { return { isChoice: false, value: ArmorType.Light } satisfies INonChoiceData<ArmorType> },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, ArmorType)),
            simplify: (value) => value.isChoice || value.value !== ArmorType.Light ? value : null
        },
        value: {
            value: ProficiencyLevelBasic.Proficient,
            validate: (value) => isEnum(value, ProficiencyLevelBasic)
        }
    }

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.proficiency.isChoice) {
            return { type: 'enum', value: this.proficiency.value, enum: 'armor' }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.proficienciesArmor.subscribe({
            target: self,
            apply: function (value, choices): Partial<Record<ArmorType, ProficiencyLevelBasic>> {
                const modifier = self.data as ModifierSetArmorProficiencyData
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

export default ModifierSetArmorProficiencyData
