import ModifierAddDataBase, { ModifierAddType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createSingleChoiceData, validateChoiceData } from '../common'
import { asEnum, isEnum, isNumber, isString } from 'utils'
import { ConditionBinding } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { SingleChoiceData, INonChoiceData, IModifierAddConditionImmunityData, IEditorChoiceData } from 'types/database/files/modifier'
import type { ISourceBinding } from 'types/database/files/creature'

class ModifierAddConditionImmunityData extends ModifierAddDataBase implements IModifierAddConditionImmunityData {
    public override readonly subtype = ModifierAddType.ConditionImmunity
    public readonly binding: SingleChoiceData<ConditionBinding>
    public readonly notes: string

    public constructor(data: Simplify<IModifierAddConditionImmunityData>) {
        super(data)
        this.binding = createSingleChoiceData<ConditionBinding>(data.binding, (value) => asEnum(value, ConditionBinding) ?? ConditionBinding.Generic)
        this.notes = data.notes ?? ModifierAddConditionImmunityData.properties.notes.value
    }

    public static properties: DataPropertyMap<IModifierAddConditionImmunityData, ModifierAddConditionImmunityData> = {
        ...ModifierAddDataBase.properties,
        subtype: {
            value: ModifierAddType.ConditionImmunity,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        binding: {
            get value() { return { isChoice: false, value: ConditionBinding.Generic } satisfies INonChoiceData<ConditionBinding> },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, ConditionBinding))
        },
        notes: {
            value: '',
            validate: isString
        }
    }

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.binding.isChoice) {
            return { type: 'enum', value: this.binding.value, enum: 'conditionBinding' }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.conditionImmunities.subscribe({
            target: self,
            apply: function (value, choices): Partial<Record<ConditionBinding, readonly ISourceBinding[]>> {
                const modifier = self.data as ModifierAddConditionImmunityData
                let choice: ConditionBinding | null
                if (modifier.binding.isChoice) {
                    const index: unknown = choices[self.id]
                    if (!isNumber(index)) {
                        return value
                    }

                    choice = asEnum(modifier.binding.value[index], ConditionBinding)
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

export default ModifierAddConditionImmunityData
