import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createDefaultChoiceData, createMultipleChoiceData, simplifyMultipleChoiceData, validateChoiceData } from '../common'
import ModifierVariableDataBase, { ModifierVariableType, OperationType } from '.'
import { isNumber, isString } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IEditorChoiceData, IModifierVariableCollectionData, MultipleChoiceData } from 'types/database/files/modifier'

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

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.value.isChoice) {
            return { type: 'value', value: this.value.value, numChoices: this.value.numChoices }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.variables.subscribe({
            target: self,
            apply: function (value, choices, flags): Record<string, unknown> {
                const modifier = self.data as ModifierVariableCollectionData
                let selected: string[]
                if (modifier.value.isChoice) {
                    const choice: unknown = choices[self.id]
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
                            [modifier.variable]: Array.isArray(current)
                                ? [...current, ...selected]
                                : selected
                        }
                    }
                    case OperationType.Replace:
                        return { ...value, [modifier.variable]: selected }
                }
            }
        })
    }
}

export default ModifierVariableCollectionData
