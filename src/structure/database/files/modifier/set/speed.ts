import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createSingleChoiceData, createDefaultChoiceData, validateChoiceData, simplifySingleChoiceData } from '../../../choice'
import { asEnum, asNumber, isEnum, isNumber } from 'utils'
import { MovementType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetSpeedData } from 'types/database/files/modifier'
import type { SingleChoiceData } from 'types/database/choice'

class ModifierSetSpeedData extends ModifierSetDataBase implements IModifierSetSpeedData {
    public override readonly subtype = ModifierSetType.Speed
    public readonly speed: SingleChoiceData<MovementType>
    public readonly value: number

    public constructor(data: Simplify<IModifierSetSpeedData>) {
        super(data)
        this.speed = createSingleChoiceData<MovementType>(data.speed, (value) => asEnum(value, MovementType) ?? MovementType.Walk)
        this.value = asNumber(data.value, ModifierSetSpeedData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierSetSpeedData, ModifierSetSpeedData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.Speed,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        speed: {
            get value() { return createDefaultChoiceData(MovementType.Walk) },
            validate: (value) => validateChoiceData(value, (value) => isEnum(value, MovementType)),
            simplify: (value) => simplifySingleChoiceData(value, MovementType.Walk)
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        if (this.speed.isChoice) {
            modifier.addChoice({
                source: this,
                type: 'enum',
                value: this.speed.value,
                enum: 'movement'
            }, key)
        }
        modifier.speed.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value, choices, _, variables): Partial<Record<MovementType, number>> {
                const modifier = this.data as ModifierSetSpeedData
                if (modifier.speed.isChoice) {
                    const index: unknown = choices[key]
                    if (!isNumber(index)) {
                        return value
                    }

                    const type = modifier.speed.value[index] ?? null
                    if (type !== null) {
                        return { ...value, [type]: modifier.value + asNumber(variables[`speed.${type}.bonus`], 0) }
                    }
                } else {
                    const type = modifier.speed.value
                    return { ...value, [type]: modifier.value + asNumber(variables[`speed.${type}.bonus`], 0) }
                }
                return value
            }
        })
    }
}

export default ModifierSetSpeedData
