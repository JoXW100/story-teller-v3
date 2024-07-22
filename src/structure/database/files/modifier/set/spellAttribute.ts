import ModifierSetDataBase, { ModifierSetType } from '.'
import type Modifier from '../modifier'
import { createSingleChoiceData, createDefaultChoiceData, validateChoiceData, simplifySingleChoiceData } from '../../../choice'
import { asEnum, isEnum, isNumber } from 'utils'
import { OptionalAttribute } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetSpellAttributeData } from 'types/database/files/modifier'
import type { SingleChoiceData } from 'types/database/choice'

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
            get value() { return createDefaultChoiceData(OptionalAttribute.None) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, OptionalAttribute)),
            simplify: (value) => simplifySingleChoiceData(value, OptionalAttribute.None)
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        if (this.value.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'enum',
                value: this.value.value,
                enum: 'attr'
            }, key)
        }
        modifier.spellAttribute.subscribe({
            key: key,
            data: this,
            apply: function (value, choices): OptionalAttribute {
                const modifier = this.data as ModifierSetSpellAttributeData
                if (modifier.value.isChoice) {
                    const index: unknown = choices[key]
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
