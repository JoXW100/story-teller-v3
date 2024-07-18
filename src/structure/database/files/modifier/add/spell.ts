import ModifierAddDataBase, { ModifierAddType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createMultipleChoiceData, createDefaultChoiceData, validateChoiceData, simplifyMultipleChoiceData } from '../../../choice'
import { asObjectId, isNumber, isObjectIdOrNull } from 'utils'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { MultipleChoiceData } from 'types/database/choice'
import type { IModifierAddSpellData } from 'types/database/files/modifier'
import { ModifierSourceType } from '../modifier'

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
            simplify: (value) => simplifyMultipleChoiceData(value, null)
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        if (this.value.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'id',
                value: this.value.value,
                numChoices: this.value.numChoices
            }, key)
            for (const id of this.value.value) {
                if (id !== null) {
                    modifier.addSource(id, ModifierSourceType.Modifier, key)
                }
            }
        } else if (this.value.value !== null) {
            modifier.addSource(this.value.value, ModifierSourceType.Modifier, key)
        }

        modifier.spells.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value, choices): ObjectId[] {
                const modifier = this.data as ModifierAddSpellData
                const existing = new Set(value)
                if (modifier.value.isChoice) {
                    const choice: unknown = choices[key]
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
