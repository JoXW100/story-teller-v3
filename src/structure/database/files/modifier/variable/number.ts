import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createDefaultChoiceData, createSingleChoiceData, simplifySingleChoiceData, validateChoiceData } from '../common'
import ModifierVariableDataBase, { ModifierVariableType, OperationType } from '.'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IEditorChoiceData, IModifierVariableNumberData, SingleChoiceData } from 'types/database/files/modifier'

class ModifierVariableNumberData extends ModifierVariableDataBase implements IModifierVariableNumberData {
    public override readonly subtype = ModifierVariableType.Number
    public readonly value: SingleChoiceData<number>

    public constructor(data: Simplify<IModifierVariableNumberData>) {
        super(data)
        this.value = createSingleChoiceData<number>(data.value, (value) => asNumber(value, 0))
    }

    public static properties: DataPropertyMap<IModifierVariableNumberData, ModifierVariableNumberData> = {
        ...ModifierVariableDataBase.properties,
        subtype: {
            value: ModifierVariableType.Number,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            get value() { return createDefaultChoiceData(0) },
            validate: (value) => validateChoiceData(value, isNumber),
            simplify: (value) => simplifySingleChoiceData(value, 0)
        }
    }

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.value.isChoice) {
            return { type: 'value', value: this.value.value }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.variables.subscribe({
            target: self,
            apply: function (value, choices, flags): Record<string, unknown> {
                const modifier = self.data as ModifierVariableNumberData
                let choice: number
                if (modifier.value.isChoice) {
                    const index: unknown = choices[self.id]
                    if (!isNumber(index)) {
                        return value
                    }

                    choice = asNumber(modifier.value.value[index], 0)
                } else {
                    choice = modifier.value.value
                }

                switch (modifier.operation) {
                    case OperationType.Add: {
                        const current = value[modifier.variable]
                        return {
                            ...value,
                            [modifier.variable]: isNumber(current)
                                ? current + choice
                                : choice
                        }
                    }
                    case OperationType.Replace:
                        return { ...value, [modifier.variable]: choice }
                }
            }
        })
    }
}

export default ModifierVariableNumberData
