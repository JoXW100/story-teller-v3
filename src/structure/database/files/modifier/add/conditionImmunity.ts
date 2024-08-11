import ModifierAddDataBase, { ModifierAddType } from '.'
import type Modifier from '../modifier'
import { SourceType } from '../modifier'
import { createDefaultChoiceData, createSingleChoiceData, simplifySingleChoiceData, validateChoiceData } from '../../../choice'
import { asEnum, isEnum, isNumber, isString } from 'utils'
import { ConditionBinding } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAddConditionImmunityData } from 'types/database/files/modifier'
import type { ISourceBinding } from 'types/database/files/creature'
import type { SingleChoiceData } from 'types/database/choice'
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
            get value() { return createDefaultChoiceData(ConditionBinding.Generic) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, ConditionBinding)),
            simplify: (value) => simplifySingleChoiceData(value, ConditionBinding.Generic)
        },
        notes: {
            value: '',
            validate: isString
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        if (this.binding.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'enum',
                value: this.binding.value,
                enum: 'conditionBinding'
            }, key)
        }
        modifier.conditionImmunities.subscribe({
            key: key,
            data: this,
            apply: function (value, choices): Partial<Record<ConditionBinding, readonly ISourceBinding[]>> {
                const self = this.data as ModifierAddConditionImmunityData
                let choice: ConditionBinding | null
                if (self.binding.isChoice) {
                    const index: unknown = choices[key]
                    if (!isNumber(index)) {
                        return value
                    }

                    choice = asEnum(self.binding.value[index], ConditionBinding)
                } else {
                    choice = self.binding.value
                }

                if (choice === null || (choice in value && value[choice]!.some(binding => binding.description === self.notes))) {
                    return value
                }

                return {
                    ...value,
                    [choice]: [
                        ...value[choice] ?? [],
                        {
                            source: modifier.findSource(key, value => value.type !== SourceType.Modifier),
                            description: self.notes
                        } satisfies ISourceBinding
                    ]
                }
            }
        })
    }
}

export default ModifierAddConditionImmunityData
