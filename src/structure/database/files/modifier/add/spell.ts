import ModifierAddDataBase, { ModifierAddType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createDefaultChoiceData, createMultipleChoiceData, simplifySingleChoiceData, validateChoiceData } from '../common'
import { asObjectId, isNumber, isObjectIdOrNull } from 'utils'
import { DocumentType } from 'structure/database'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { MultipleChoiceData, IModifierAddSpellData, IEditorChoiceData } from 'types/database/files/modifier'

class ModifierAddSpellData extends ModifierAddDataBase implements IModifierAddSpellData {
    public override readonly subtype = ModifierAddType.Spell
    public readonly value: MultipleChoiceData<ObjectId | null>

    public constructor(data: Simplify<IModifierAddSpellData>) {
        super(data)
        this.value = createMultipleChoiceData<ObjectId | null>(data.value, asObjectId)
    }

    public static properties: DataPropertyMap<IModifierAddSpellData, ModifierAddSpellData> = {
        ...ModifierAddDataBase.properties,
        subtype: {
            value: ModifierAddType.Spell,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            get value() { return createDefaultChoiceData(null) },
            validate: (value) => validateChoiceData(value, isObjectIdOrNull),
            simplify: (value) => simplifySingleChoiceData(value, null)
        }
    }

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.value.isChoice) {
            return { type: 'id', value: this.value.value, numChoices: this.value.numChoices, allowedTypes: [DocumentType.Spell] }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.spells.subscribe({
            target: self,
            apply: function (value, choices, flags): ObjectId[] {
                const modifier = self.data as ModifierAddSpellData
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

export default ModifierAddSpellData
