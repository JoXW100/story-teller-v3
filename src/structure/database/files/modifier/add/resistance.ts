import ModifierAddDataBase, { ModifierAddType } from '.'
import type Modifier from '../modifier'
import { SourceType } from '../modifier'
import { createSingleChoiceData, createDefaultChoiceData, validateChoiceData, simplifySingleChoiceData } from '../../../choice'
import { asEnum, isEnum, isNumber, isString } from 'utils'
import { DamageBinding } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAddResistanceData } from 'types/database/files/modifier'
import type { ISourceBinding } from 'types/database/files/creature'
import type { SingleChoiceData } from 'types/database/choice'

class ModifierAddResistanceData extends ModifierAddDataBase implements IModifierAddResistanceData {
    public override readonly subtype = ModifierAddType.Resistance
    public readonly binding: SingleChoiceData<DamageBinding>
    public readonly notes: string

    public constructor(data: Simplify<IModifierAddResistanceData>) {
        super(data)
        this.binding = createSingleChoiceData<DamageBinding>(data.binding, (value) => asEnum(value, DamageBinding) ?? DamageBinding.Generic)
        this.notes = data.notes ?? ModifierAddResistanceData.properties.notes.value
    }

    public static properties: DataPropertyMap<IModifierAddResistanceData, ModifierAddResistanceData> = {
        ...ModifierAddDataBase.properties,
        subtype: {
            value: ModifierAddType.Resistance,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        binding: {
            get value() { return createDefaultChoiceData(DamageBinding.Generic) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, DamageBinding)),
            simplify: (value) => simplifySingleChoiceData(value, DamageBinding.Generic)
        },
        notes: {
            value: '',
            validate: isString
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        if (this.binding.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'enum',
                value: this.binding.value,
                enum: 'damageBinding'
            }, key)
        }
        modifier.resistances.subscribe({
            key: key,
            data: this,
            apply: function (value, choices): Partial<Record<DamageBinding, readonly ISourceBinding[]>> {
                const self = this.data as ModifierAddResistanceData
                let choice: DamageBinding | null
                if (self.binding.isChoice) {
                    const index: unknown = choices[key]
                    if (!isNumber(index)) {
                        return value
                    }

                    choice = asEnum(self.binding.value[index], DamageBinding)
                } else {
                    choice = self.binding.value
                }

                if (choice === null || value[choice]?.some(binding => binding.description === self.notes)) {
                    return value
                }

                return {
                    ...value,
                    [choice]: [
                        ...value[choice] ?? [],
                        {
                            source: modifier.findSource(key, value => value.type !== SourceType.Modifier),
                            description: self.notes
                        } satisfies ISourceBinding
                    ]
                }
            }
        })
    }
}

export default ModifierAddResistanceData
