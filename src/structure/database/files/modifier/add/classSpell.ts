import ModifierAddDataBase, { ModifierAddType } from '.'
import type Modifier from '../modifier'
import { SourceType } from '../modifier'
import { createMultipleChoiceData, createDefaultChoiceData, validateChoiceData, simplifyMultipleChoiceData } from '../../../choice'
import { asObjectId, isNumber, isObjectId, isObjectIdOrNull } from 'utils'
import { DocumentType } from 'structure/database'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { MultipleChoiceData } from 'types/database/choice'
import type { IModifierAddClassSpellData } from 'types/database/files/modifier'
import { SpellPreparationType } from 'structure/dnd'

class ModifierAddClassSpellData extends ModifierAddDataBase implements IModifierAddClassSpellData {
    public override readonly subtype = ModifierAddType.ClassSpell
    public readonly value: MultipleChoiceData<ObjectId | null>
    public readonly target: ObjectId | null

    public constructor(data: Simplify<IModifierAddClassSpellData>) {
        super(data)
        this.value = createMultipleChoiceData<ObjectId | null>(data.value, asObjectId)
        this.target = asObjectId(data.target)
    }

    public static properties: DataPropertyMap<IModifierAddClassSpellData, ModifierAddClassSpellData> = {
        ...ModifierAddDataBase.properties,
        subtype: {
            value: ModifierAddType.ClassSpell,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            get value() { return createDefaultChoiceData(null) },
            validate: (value) => validateChoiceData(value, isObjectIdOrNull),
            simplify: (value) => simplifyMultipleChoiceData(value, null)
        },
        target: {
            value: null,
            validate: isObjectIdOrNull
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        if (this.target === null) {
            return
        }

        if (this.value.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'spell',
                allowedTypes: [DocumentType.Spell],
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

        modifier.classSpells.subscribe({
            key: key,
            data: this,
            apply: function (value, choices): Record<ObjectId, Record<ObjectId, SpellPreparationType>> {
                const modifier = this.data as ModifierAddClassSpellData
                if (modifier.target === null) {
                    return value
                }
                const result = { ...value }
                if (!(modifier.target in result)) {
                    result[modifier.target] = {}
                }
                if (modifier.value.isChoice) {
                    const choice: unknown = choices[key]
                    if (!Array.isArray(choice)) {
                        return value
                    }

                    if (modifier.value.value.length > 0) {
                        for (let i = 0; i < modifier.value.numChoices; i++) {
                            const index = choice[i]
                            if (isNumber(index)) {
                                const id = modifier.value.value[index]
                                if (isObjectId(id)) {
                                    result[modifier.target][id] = SpellPreparationType.AlwaysPrepared
                                }
                            }
                        }
                    } else {
                        for (const id of choice) {
                            if (isObjectId(id)) {
                                result[modifier.target][id] = SpellPreparationType.AlwaysPrepared
                            }
                        }
                    }
                } else if (modifier.value.value !== null) {
                    result[modifier.target][modifier.value.value] = SpellPreparationType.AlwaysPrepared
                }
                return result
            }
        })
    }
}

export default ModifierAddClassSpellData
