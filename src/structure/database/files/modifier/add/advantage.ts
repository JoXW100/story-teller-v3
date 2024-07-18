import ModifierAddDataBase, { ModifierAddType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createDefaultChoiceData, createSingleChoiceData, simplifySingleChoiceData, validateChoiceData } from '../../../choice'
import { asEnum, isEnum, isNumber, isString } from 'utils'
import { AdvantageBinding } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAddAdvantageData } from 'types/database/files/modifier'
import type { ISourceBinding } from 'types/database/files/creature'
import type { SingleChoiceData } from 'types/database/choice'

class ModifierAddAdvantageData extends ModifierAddDataBase implements IModifierAddAdvantageData {
    public override readonly subtype = ModifierAddType.Advantage
    public readonly binding: SingleChoiceData<AdvantageBinding>
    public readonly notes: string

    public constructor(data: Simplify<IModifierAddAdvantageData>) {
        super(data)
        this.binding = createSingleChoiceData<AdvantageBinding>(data.binding, (value) => asEnum(value, AdvantageBinding) ?? AdvantageBinding.Generic)
        this.notes = data.notes ?? ModifierAddAdvantageData.properties.notes.value
    }

    public static properties: DataPropertyMap<IModifierAddAdvantageData, ModifierAddAdvantageData> = {
        ...ModifierAddDataBase.properties,
        subtype: {
            value: ModifierAddType.Advantage,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        binding: {
            get value() { return createDefaultChoiceData(AdvantageBinding.Generic) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, AdvantageBinding)),
            simplify: (value) => simplifySingleChoiceData(value, AdvantageBinding.Generic)
        },
        notes: {
            value: '',
            validate: isString
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        if (this.binding.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'enum',
                value: this.binding.value,
                enum: 'advantageBinding'
            }, key)
        }
        modifier.advantages.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value, choices): Partial<Record<AdvantageBinding, readonly ISourceBinding[]>> {
                const modifier = this.data as ModifierAddAdvantageData
                let choice: AdvantageBinding | null
                if (modifier.binding.isChoice) {
                    const index: unknown = choices[key]
                    if (!isNumber(index)) {
                        return value
                    }

                    choice = asEnum(modifier.binding.value[index], AdvantageBinding)
                } else {
                    choice = modifier.binding.value
                }

                if (choice === null) {
                    return value
                }

                return {
                    ...value,
                    [choice]: [...(value[choice] ?? []), {
                        source: self.id,
                        description: modifier.notes
                    } satisfies ISourceBinding]
                }
            }
        })
    }
}

export default ModifierAddAdvantageData
