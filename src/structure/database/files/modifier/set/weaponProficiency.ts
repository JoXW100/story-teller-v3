import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createDefaultChoiceData, createMultipleChoiceData, simplifyMultipleChoiceData, validateChoiceData } from '../common'
import { asEnum, isEnum, isNumber } from 'utils'
import { WeaponType, ProficiencyLevelBasic } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { MultipleChoiceData, IModifierSetWeaponProficiencyData, IEditorChoiceData } from 'types/database/files/modifier'

class ModifierSetWeaponProficiencyData extends ModifierSetDataBase implements IModifierSetWeaponProficiencyData {
    public override readonly subtype = ModifierSetType.WeaponProficiency
    public readonly proficiency: MultipleChoiceData<WeaponType>
    public readonly value: ProficiencyLevelBasic

    public constructor(data: Simplify<IModifierSetWeaponProficiencyData>) {
        super(data)
        this.proficiency = createMultipleChoiceData<WeaponType>(data.proficiency, (value) => asEnum(value, WeaponType) ?? WeaponType.Martial)
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
            get value() { return createDefaultChoiceData(WeaponType.Martial) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, WeaponType)),
            simplify: (value) => simplifyMultipleChoiceData(value, WeaponType.Martial)
        },
        value: {
            value: ProficiencyLevelBasic.Proficient,
            validate: (value) => isEnum(value, ProficiencyLevelBasic)
        }
    }

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.proficiency.isChoice) {
            return { type: 'enum', value: this.proficiency.value, enum: 'weaponType' }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.proficienciesWeapon.subscribe({
            target: self,
            apply: function (value, choices): Partial<Record<WeaponType, ProficiencyLevelBasic>> {
                const modifier = self.data as ModifierSetWeaponProficiencyData
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

export default ModifierSetWeaponProficiencyData
