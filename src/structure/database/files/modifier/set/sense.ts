import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createSingleChoiceData, validateChoiceData } from '../common'
import { asEnum, asNumber, isEnum, isNumber } from 'utils'
import { Sense } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { SingleChoiceData, INonChoiceData, IModifierSetSenseData, IEditorChoiceData } from 'types/database/files/modifier'

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
            get value() { return { isChoice: false, value: Sense.DarkVision } satisfies INonChoiceData<Sense> },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, Sense))
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.sense.isChoice) {
            return { type: 'enum', value: this.sense.value, enum: 'sense' }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.senses.subscribe({
            target: self,
            apply: function (value, choices): Partial<Record<Sense, number>> {
                const modifier = self.data as ModifierSetSenseData
                if (modifier.sense.isChoice) {
                    const index: unknown = choices[self.id]
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
