import ModifierAddDataBase, { ModifierAddType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { ModifierSourceType } from '../modifier'
import { createDefaultChoiceData, createMultipleChoiceData, simplifyMultipleChoiceData, validateChoiceData } from '../../../choice'
import { asObjectId, isNumber, isObjectId, isObjectIdOrNull } from 'utils'
import { DocumentType } from 'structure/database'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAddAbilityData } from 'types/database/files/modifier'
import type { MultipleChoiceData } from 'types/database/choice'

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

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        if (this.value.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'ability',
                allowedTypes: [DocumentType.Ability],
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

        modifier.abilities.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value, choices): Array<ObjectId | string> {
                const modifier = this.data as ModifierAddAbilityData
                const existing = new Set(value)
                if (modifier.value.isChoice) {
                    const choice: unknown = choices[key]
                    if (!Array.isArray(choice)) {
                        return value
                    }

                    if (modifier.value.value.length > 0) {
                        for (let i = 0; i < modifier.value.numChoices; i++) {
                            const index = choice[i]
                            if (isNumber(index)) {
                                const id = asObjectId(modifier.value.value[index])
                                if (isObjectId(id)) {
                                    existing.add(id)
                                }
                            }
                        }
                    } else {
                        for (const id of choice) {
                            if (isObjectId(id)) {
                                existing.add(id)
                            }
                        }
                    }

                    return Array.from(existing)
                } else if (modifier.value.value !== null && !existing.has(modifier.value.value)) {
                    return [...value, modifier.value.value]
                }
                return value
            }
        })
    }
}

export default ModifierAddAbilityData
