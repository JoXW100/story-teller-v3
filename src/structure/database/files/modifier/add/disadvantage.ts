import ModifierAddDataBase, { ModifierAddType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createDefaultChoiceData, createSingleChoiceData, simplifySingleChoiceData, validateChoiceData } from '../common'
import { asEnum, isEnum, isNumber, isString } from 'utils'
import { AdvantageBinding } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { SingleChoiceData, IModifierAddDisadvantageData, IEditorChoiceData } from 'types/database/files/modifier'
import type { ISourceBinding } from 'types/database/files/creature'

class ModifierAddDisadvantageData extends ModifierAddDataBase implements IModifierAddDisadvantageData {
    public override readonly subtype = ModifierAddType.Disadvantage
    public readonly binding: SingleChoiceData<AdvantageBinding>
    public readonly notes: string

    public constructor(data: Simplify<IModifierAddDisadvantageData>) {
        super(data)
        this.binding = createSingleChoiceData<AdvantageBinding>(data.binding, (value) => asEnum(value, AdvantageBinding) ?? AdvantageBinding.Generic)
        this.notes = data.notes ?? ModifierAddDisadvantageData.properties.notes.value
    }

    public static properties: DataPropertyMap<IModifierAddDisadvantageData, ModifierAddDisadvantageData> = {
        ...ModifierAddDataBase.properties,
        subtype: {
            value: ModifierAddType.Disadvantage,
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

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.binding.isChoice) {
            return { type: 'enum', value: this.binding.value, enum: 'advantageBinding' }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.disadvantages.subscribe({
            target: self,
            apply: function (value, choices): Partial<Record<AdvantageBinding, readonly ISourceBinding[]>> {
                const modifier = self.data as ModifierAddDisadvantageData
                let choice: AdvantageBinding | null
                if (modifier.binding.isChoice) {
                    const index: unknown = choices[self.id]
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

export default ModifierAddDisadvantageData
