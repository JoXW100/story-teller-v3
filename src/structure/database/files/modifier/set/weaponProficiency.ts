import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createMultipleChoiceData, createDefaultChoiceData, validateChoiceData, simplifyMultipleChoiceData } from '../../../choice'
import { asEnum, isEnum, isNumber } from 'utils'
import { WeaponTypeValue, ProficiencyLevelBasic } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetWeaponProficiencyData } from 'types/database/files/modifier'
import type { MultipleChoiceData } from 'types/database/choice'

class ModifierSetWeaponProficiencyData extends ModifierSetDataBase implements IModifierSetWeaponProficiencyData {
    public override readonly subtype = ModifierSetType.WeaponProficiency
    public readonly proficiency: MultipleChoiceData<WeaponTypeValue>
    public readonly value: ProficiencyLevelBasic

    public constructor(data: Simplify<IModifierSetWeaponProficiencyData>) {
        super(data)
        this.proficiency = createMultipleChoiceData<WeaponTypeValue>(data.proficiency, (value) => asEnum(value, WeaponTypeValue) ?? WeaponTypeValue.Martial)
        this.value = asEnum(data.value, ProficiencyLevelBasic) ?? ModifierSetWeaponProficiencyData.properties.value.value
    }

    public static properties: DataPropertyMap<IModifierSetWeaponProficiencyData, ModifierSetWeaponProficiencyData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.WeaponProficiency,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        proficiency: {
            get value() { return createDefaultChoiceData(WeaponTypeValue.Martial) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, WeaponTypeValue)),
            simplify: (value) => simplifyMultipleChoiceData(value, WeaponTypeValue.Martial)
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
                enum: 'weaponType',
                numChoices: this.proficiency.numChoices
            }, key)
        }
        modifier.proficienciesWeapon.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value, choices): Partial<Record<WeaponTypeValue, ProficiencyLevelBasic>> {
                const modifier = this.data as ModifierSetWeaponProficiencyData
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

export default ModifierSetWeaponProficiencyData
