import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createSingleChoiceData, createDefaultChoiceData, validateChoiceData, simplifySingleChoiceData } from '../../../choice'
import ModifierVariableDataBase, { ModifierVariableType, OperationType } from '.'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierVariableNumberData } from 'types/database/files/modifier'
import type { SingleChoiceData } from 'types/database/choice'

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

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        if (this.value.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'value',
                value: this.value.value
            }, key)
        }
        modifier.variables.subscribe({
            key: key,
            data: this,
            target: self,
            apply: function (value, choices): Record<string, string> {
                const modifier = this.data as ModifierVariableNumberData
                let choice: number
                if (modifier.value.isChoice) {
                    const index: unknown = choices[key]
                    if (!isNumber(index)) {
                        return value
                    }

                    choice = asNumber(modifier.value.value[index], 0)
                } else {
                    choice = modifier.value.value
                }

                switch (modifier.operation) {
                    case OperationType.Add: {
                        const current = Number(value[modifier.variable])
                        return {
                            ...value,
                            [modifier.variable]: isNaN(current)
                                ? String(choice)
                                : String(current + choice)
                        }
                    }
                    case OperationType.Replace:
                        return { ...value, [modifier.variable]: String(choice) }
                }
            }
        })
    }
}

export default ModifierVariableNumberData
