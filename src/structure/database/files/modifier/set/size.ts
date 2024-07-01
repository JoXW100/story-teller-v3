import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createSingleChoiceData, validateChoiceData } from '../common'
import { asEnum, isEnum, isNumber } from 'utils'
import { SizeType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { SingleChoiceData, INonChoiceData, IModifierSetSizeData, IEditorChoiceData } from 'types/database/files/modifier'

class ModifierSetSizeData extends ModifierSetDataBase implements IModifierSetSizeData {
    public override readonly subtype = ModifierSetType.Size
    public readonly value: SingleChoiceData<SizeType>

    public constructor(data: Simplify<IModifierSetSizeData>) {
        super(data)
        this.value = createSingleChoiceData<SizeType>(data.value, (value) => asEnum(value, SizeType) ?? SizeType.Medium)
    }

    public static properties: DataPropertyMap<IModifierSetSizeData, ModifierSetSizeData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.Size,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            get value() { return { isChoice: false, value: SizeType.Medium } satisfies INonChoiceData<SizeType> },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, SizeType))
        }
    }

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.value.isChoice) {
            return { type: 'enum', value: this.value.value, enum: 'size' }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.size.subscribe({
            target: self,
            apply: function (value, choices, flags): SizeType {
                const modifier = self.data as ModifierSetSizeData
                if (modifier.value.isChoice) {
                    const index: unknown = choices[self.id]
                    if (!isNumber(index)) {
                        return value
                    }

                    const size = modifier.value.value[index] ?? null
                    if (size !== null) {
                        return size
                    }
                } else {
                    return modifier.value.value
                }
                return value
            }
        })
    }
}

export default ModifierSetSizeData
