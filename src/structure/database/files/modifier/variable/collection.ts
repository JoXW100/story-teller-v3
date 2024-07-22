import type Modifier from '../modifier'
import { createMultipleChoiceData, createDefaultChoiceData, validateChoiceData, simplifyMultipleChoiceData } from '../../../choice'
import ModifierVariableDataBase, { ModifierVariableType, OperationType } from '.'
import { isNumber, isString } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierVariableCollectionData } from 'types/database/files/modifier'
import type { MultipleChoiceData } from 'types/database/choice'

class ModifierVariableCollectionData extends ModifierVariableDataBase implements IModifierVariableCollectionData {
    public override readonly subtype = ModifierVariableType.Collection
    public readonly value: MultipleChoiceData<string>

    public constructor(data: Simplify<IModifierVariableCollectionData>) {
        super(data)
        this.value = createMultipleChoiceData<string>(data.value, (value) => isString(value) ? value : '')
    }

    public static properties: DataPropertyMap<IModifierVariableCollectionData, ModifierVariableCollectionData> = {
        ...ModifierVariableDataBase.properties,
        subtype: {
            value: ModifierVariableType.Collection,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            get value() { return createDefaultChoiceData('') },
            validate: (value) => validateChoiceData(value, isString),
            simplify: (value) => simplifyMultipleChoiceData(value, '')
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        if (this.value.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'value',
                value: this.value.value,
                numChoices: this.value.numChoices
            }, key)
        }
        modifier.variables.subscribe({
            key: key,
            data: this,
            target: self,
            apply: function (value, choices): Record<string, string> {
                const modifier = this.data as ModifierVariableCollectionData
                let selected: string[]
                if (modifier.value.isChoice) {
                    const choice: unknown = choices[key]
                    if (!Array.isArray(choice)) {
                        return value
                    }

                    selected = []
                    for (let i = 0; i < modifier.value.numChoices; i++) {
                        const index = choice[i]
                        if (!isNumber(index)) {
                            continue
                        }

                        const val = modifier.value.value[index] ?? null
                        if (val === null) {
                            continue
                        }

                        selected.push(val)
                    }
                } else {
                    selected = [modifier.value.value]
                }

                switch (modifier.operation) {
                    case OperationType.Add: {
                        const current = value[modifier.variable]
                        return {
                            ...value,
                            [modifier.variable]: isString(current) && current.length > 0
                                ? [...current.split(', ') ?? [], ...selected].join(', ')
                                : selected.join(', ')
                        }
                    }
                    case OperationType.Replace:
                        return { ...value, [modifier.variable]: selected.join(', ') }
                }
            }
        })
    }
}

export default ModifierVariableCollectionData
