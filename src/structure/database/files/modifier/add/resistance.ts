import ModifierAddDataBase, { ModifierAddType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createSingleChoiceData, validateChoiceData } from '../common'
import { asEnum, isEnum, isNumber, isString } from 'utils'
import { DamageBinding } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { SingleChoiceData, INonChoiceData, IModifierAddResistanceData, IEditorChoiceData } from 'types/database/files/modifier'
import type { ISourceBinding } from 'types/database/files/creature'

class ModifierAddResistanceData extends ModifierAddDataBase implements IModifierAddResistanceData {
    public override readonly subtype = ModifierAddType.Resistance
    public readonly binding: SingleChoiceData<DamageBinding>
    public readonly notes: string

    public constructor(data: Simplify<IModifierAddResistanceData>) {
        super(data)
        this.binding = createSingleChoiceData<DamageBinding>(data.binding, (value) => asEnum(value, DamageBinding) ?? DamageBinding.Generic)
        this.notes = data.notes ?? ModifierAddResistanceData.properties.notes.value
    }

    public static properties: DataPropertyMap<IModifierAddResistanceData, ModifierAddResistanceData> = {
        ...ModifierAddDataBase.properties,
        subtype: {
            value: ModifierAddType.Resistance,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        binding: {
            get value() { return { isChoice: false, value: DamageBinding.Generic } satisfies INonChoiceData<DamageBinding> },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, DamageBinding))
        },
        notes: {
            value: '',
            validate: isString
        }
    }

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.binding.isChoice) {
            return { type: 'enum', value: this.binding.value, enum: 'damageBinding' }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.resistances.subscribe({
            target: self,
            apply: function (value, choices): Partial<Record<DamageBinding, readonly ISourceBinding[]>> {
                const modifier = self.data as ModifierAddResistanceData
                let choice: DamageBinding | null
                if (modifier.binding.isChoice) {
                    const index: unknown = choices[self.id]
                    if (!isNumber(index)) {
                        return value
                    }

                    choice = asEnum(modifier.binding.value[index], DamageBinding)
                } else {
                    choice = modifier.binding.value
                }

                if (choice === null) {
                    return value
                }

                value[choice] = [...(value[choice] ?? []), {
                    source: self.id,
                    description: modifier.notes
                } satisfies ISourceBinding]
                return value
            }
        })
    }
}

export default ModifierAddResistanceData
