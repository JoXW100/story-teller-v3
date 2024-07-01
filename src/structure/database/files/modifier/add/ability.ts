import ModifierAddDataBase, { ModifierAddType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createDefaultChoiceData, createMultipleChoiceData, simplifyMultipleChoiceData, validateChoiceData } from '../common'
import { asObjectId, isNumber, isObjectIdOrNull } from 'utils'
import { DocumentType } from 'structure/database'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { MultipleChoiceData, IModifierAddAbilityData, IEditorChoiceData } from 'types/database/files/modifier'

class ModifierAddAbilityData extends ModifierAddDataBase implements IModifierAddAbilityData {
    public override readonly subtype = ModifierAddType.Ability
    public readonly value: MultipleChoiceData<ObjectId | null>

    public constructor(data: Simplify<IModifierAddAbilityData>) {
        super(data)
        this.value = createMultipleChoiceData<ObjectId | null>(data.value, asObjectId)
    }

    public static properties: DataPropertyMap<IModifierAddAbilityData, ModifierAddAbilityData> = {
        ...ModifierAddDataBase.properties,
        subtype: {
            value: ModifierAddType.Ability,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            get value() { return createDefaultChoiceData(null) },
            validate: (value) => validateChoiceData(value, isObjectIdOrNull),
            simplify: (value) => simplifyMultipleChoiceData(value, null)
        }
    }

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.value.isChoice) {
            return { type: 'id', value: this.value.value, numChoices: this.value.numChoices, allowedTypes: [DocumentType.Ability] }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.abilities.subscribe({
            target: self,
            apply: function (value, choices, flags): Array<ObjectId | string> {
                const modifier = self.data as ModifierAddAbilityData
                const existing = new Set(value)
                if (modifier.value.isChoice) {
                    const choice: unknown = choices[self.id]
                    if (!Array.isArray(choice)) {
                        return value
                    }

                    for (let i = 0; i < modifier.value.numChoices; i++) {
                        const index = choice[i]
                        if (!isNumber(index)) {
                            continue
                        }

                        const id = modifier.value.value[index] ?? null
                        if (id === null) {
                            continue
                        }

                        existing.add(id)
                    }

                    value = Array.from(existing)
                } else if (modifier.value.value !== null && !existing.has(modifier.value.value)) {
                    value.push(modifier.value.value)
                }
                return value
            }
        })
    }
}

export default ModifierAddAbilityData
