import ModifierSetDataBase, { ModifierSetType } from '.'
import type Modifier from '../modifier'
import { createSingleChoiceData, createDefaultChoiceData, validateChoiceData, simplifySingleChoiceData } from '../../../choice'
import { asEnum, isEnum, isNumber } from 'utils'
import { SizeType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetSizeData } from 'types/database/files/modifier'
import type { SingleChoiceData } from 'types/database/choice'

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
            get value() { return createDefaultChoiceData(SizeType.Medium) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, SizeType)),
            simplify: (value) => simplifySingleChoiceData(value, SizeType.Medium)
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        if (this.value.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'enum',
                value: this.value.value,
                enum: 'size'
            }, key)
        }
        modifier.size.subscribe({
            key: key,
            data: this,
            apply: function (value, choices): SizeType {
                const modifier = this.data as ModifierSetSizeData
                if (modifier.value.isChoice) {
                    const index: unknown = choices[key]
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
