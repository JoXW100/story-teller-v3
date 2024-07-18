import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createMultipleChoiceData, createDefaultChoiceData, validateChoiceData, simplifyMultipleChoiceData } from '../../../choice'
import { asEnum, isEnum, isNumber } from 'utils'
import { ArmorType, ProficiencyLevelBasic } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetArmorProficiencyData } from 'types/database/files/modifier'
import type { MultipleChoiceData } from 'types/database/choice'

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
            get value() { return createDefaultChoiceData(ArmorType.Light) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, ArmorType)),
            simplify: (value) => simplifyMultipleChoiceData(value, ArmorType.Light)
        },
        value: {
            value: ProficiencyLevelBasic.Proficient,
            validate: (value) => isEnum(value, ProficiencyLevelBasic)
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        if (this.proficiency.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'enum',
                value: this.proficiency.value,
                enum: 'armor',
                numChoices: this.proficiency.numChoices
            }, key)
        }
        modifier.proficienciesArmor.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value, choices): Partial<Record<ArmorType, ProficiencyLevelBasic>> {
                const modifier = this.data as ModifierSetArmorProficiencyData
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

export default ModifierSetArmorProficiencyData
