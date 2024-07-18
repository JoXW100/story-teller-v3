import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createSingleChoiceData, createDefaultChoiceData, validateChoiceData, simplifySingleChoiceData } from '../../../choice'
import { asEnum, asNumber, isEnum, isNumber } from 'utils'
import { Sense } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetSenseData } from 'types/database/files/modifier'
import type { SingleChoiceData } from 'types/database/choice'

class ModifierSetSenseData extends ModifierSetDataBase implements IModifierSetSenseData {
    public override readonly subtype = ModifierSetType.Sense
    public readonly sense: SingleChoiceData<Sense>
    public readonly value: number

    public constructor(data: Simplify<IModifierSetSenseData>) {
        super(data)
        this.sense = createSingleChoiceData<Sense>(data.sense, (value) => asEnum(value, Sense) ?? Sense.DarkVision)
        this.value = asNumber(data.value, ModifierSetSenseData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierSetSenseData, ModifierSetSenseData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.Sense,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        sense: {
            get value() { return createDefaultChoiceData(Sense.DarkVision) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, Sense)),
            simplify: (value) => simplifySingleChoiceData(value, Sense.DarkVision)
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        if (this.sense.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'enum',
                value: this.sense.value,
                enum: 'sense'
            }, key)
        }
        modifier.senses.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value, choices): Partial<Record<Sense, number>> {
                const modifier = this.data as ModifierSetSenseData
                if (modifier.sense.isChoice) {
                    const index: unknown = choices[key]
                    if (!isNumber(index)) {
                        return value
                    }

                    const sense = modifier.sense.value[index] ?? null
                    if (sense !== null) {
                        return { ...value, [sense]: modifier.value }
                    }
                } else {
                    return { ...value, [modifier.sense.value]: modifier.value }
                }
                return value
            }
        })
    }
}

export default ModifierSetSenseData
