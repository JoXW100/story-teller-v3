import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createSingleChoiceData, validateChoiceData } from '../common'
import { asEnum, isEnum, isNumber } from 'utils'
import { OptionalAttribute } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { SingleChoiceData, IModifierSetSpellAttributeData, INonChoiceData, IEditorChoiceData } from 'types/database/files/modifier'

class ModifierSetSpellAttributeData extends ModifierSetDataBase implements IModifierSetSpellAttributeData {
    public override readonly subtype = ModifierSetType.SpellAttribute
    public readonly value: SingleChoiceData<OptionalAttribute>

    public constructor(data: Simplify<IModifierSetSpellAttributeData>) {
        super(data)
        this.value = createSingleChoiceData<OptionalAttribute>(data.value, (value) => asEnum(value, OptionalAttribute) ?? OptionalAttribute.None)
    }

    public static properties: DataPropertyMap<IModifierSetSpellAttributeData, ModifierSetSpellAttributeData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.SpellAttribute,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            get value() { return { isChoice: false, value: OptionalAttribute.None } satisfies INonChoiceData<OptionalAttribute> },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, OptionalAttribute))
        }
    }

    public override getEditorChoiceData(): IEditorChoiceData | null {
        if (this.value.isChoice) {
            return { type: 'enum', value: this.value.value, enum: 'attr' }
        }
        return null
    }

    public override apply(data: Modifier, self: ModifierDocument): void {
        data.spellAttribute.subscribe({
            target: self,
            apply: function (value, choices): OptionalAttribute {
                const modifier = self.data as ModifierSetSpellAttributeData
                if (modifier.value.isChoice) {
                    const index: unknown = choices[self.id]
                    if (!isNumber(index)) {
                        return value
                    }

                    const attribute = modifier.value.value[index] ?? null
                    if (attribute !== null) {
                        return attribute
                    }
                } else if (modifier.value.value !== null) {
                    return modifier.value.value
                }
                return value
            }
        })
    }
}

export default ModifierSetSpellAttributeData
