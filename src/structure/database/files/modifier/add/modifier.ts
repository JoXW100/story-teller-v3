import ModifierAddDataBase, { ModifierAddType } from '.'
import type Modifier from '../modifier'
import { SourceType } from '../modifier'
import { createDefaultChoiceData, createMultipleChoiceData, simplifyMultipleChoiceData, validateChoiceData } from '../../../choice'
import { asObjectId, isNumber, isObjectId, isObjectIdOrNull } from 'utils'
import { DocumentType } from 'structure/database'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAddModifierData } from 'types/database/files/modifier'
import type { MultipleChoiceData } from 'types/database/choice'

class ModifierAddModifierData extends ModifierAddDataBase implements IModifierAddModifierData {
    public override readonly subtype = ModifierAddType.Modifier
    public readonly value: MultipleChoiceData<ObjectId | null>

    public constructor(data: Simplify<IModifierAddModifierData>) {
        super(data)
        this.value = createMultipleChoiceData<ObjectId | null>(data.value, asObjectId)
    }

    public static properties: DataPropertyMap<IModifierAddModifierData, ModifierAddModifierData> = {
        ...ModifierAddDataBase.properties,
        subtype: {
            value: ModifierAddType.Modifier,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            get value() { return createDefaultChoiceData(null) },
            validate: (value) => validateChoiceData(value, isObjectIdOrNull),
            simplify: (value) => simplifyMultipleChoiceData(value, null)
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        if (this.value.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'modifier',
                allowedTypes: [DocumentType.Modifier],
                value: this.value.value,
                numChoices: this.value.numChoices
            }, key)
            for (const id of this.value.value) {
                if (id !== null) {
                    modifier.addSource(id, SourceType.Modifier, key)
                }
            }
        } else if (this.value.value !== null) {
            modifier.addSource(this.value.value, SourceType.Modifier, key)
        }

        modifier.modifiers.subscribe({
            key: key,
            data: this,
            apply: function (value, choices): Record<string, ObjectId> {
                const addModifier = this.data as ModifierAddModifierData
                if (addModifier.value.isChoice) {
                    const choice: unknown = choices[key]
                    if (!Array.isArray(choice)) {
                        return value
                    }

                    const added: Record<string, ObjectId> = {}
                    if (addModifier.value.value.length > 0) {
                        for (let i = 0; i < addModifier.value.numChoices; i++) {
                            const index = choice[i]
                            if (isNumber(index)) {
                                const id: unknown = addModifier.value.value[index]
                                if (isObjectId(id)) {
                                    const addedKey = `${key}.${id}`
                                    modifier.addSource(addedKey, SourceType.Modifier, key)
                                    added[addedKey] = id
                                }
                            }
                        }
                    } else {
                        for (const id of choice) {
                            if (isObjectId(id)) {
                                const addedKey = `${key}.${id}`
                                modifier.addSource(addedKey, SourceType.Modifier, key)
                                added[addedKey] = id
                            }
                        }
                    }

                    return { ...value, ...added }
                } else if (addModifier.value.value !== null) {
                    const addedKey = `${key}.${addModifier.value.value}`
                    modifier.addSource(addedKey, SourceType.Modifier, key)
                    return { ...value, [addedKey]: addModifier.value.value }
                }
                return value
            }
        })
    }
}

export default ModifierAddModifierData
