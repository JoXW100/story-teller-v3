import ModifierSetDataBase, { ModifierSetType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { createSingleChoiceData, createDefaultChoiceData, validateChoiceData, simplifySingleChoiceData } from '../../../choice'
import { asEnum, asNumber, isEnum, isNumber, isRecord, keysOf } from 'utils'
import { resolveScaling } from 'utils/calculations'
import { MovementType, ScalingType } from 'structure/dnd'
import { simplifyNumberRecord } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { SingleChoiceData } from 'types/database/choice'
import type { IModifierSetSpeedData } from 'types/database/files/modifier'

class ModifierSetSpeedData extends ModifierSetDataBase implements IModifierSetSpeedData {
    public override readonly subtype = ModifierSetType.Speed
    public readonly speed: SingleChoiceData<MovementType>
    public readonly value: Partial<Record<ScalingType, number>>

    public constructor(data: Simplify<IModifierSetSpeedData>) {
        super(data)
        this.speed = createSingleChoiceData<MovementType>(data.speed, (value) => asEnum(value, MovementType) ?? MovementType.Walk)
        this.value = ModifierSetSpeedData.properties.value.value
        if (data.value !== undefined) {
            for (const type of keysOf(data.value)) {
                if (isEnum(type, ScalingType)) {
                    this.value[type] = asNumber(data.value[type], 0)
                }
            }
        }
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
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
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
            apply: function (value, choices, properties, variables): Partial<Record<MovementType, number>> {
                const modifier = this.data as ModifierSetSpeedData
                if (modifier.speed.isChoice) {
                    const index: unknown = choices[key]
                    if (!isNumber(index)) {
                        return value
                    }

                    const type = modifier.speed.value[index] ?? null
                    if (type !== null) {
                        return { ...value, [type]: resolveScaling(modifier.value, properties) + asNumber(variables[`speed.${type}.bonus`], 0) }
                    }
                } else {
                    const type = modifier.speed.value
                    return { ...value, [type]: resolveScaling(modifier.value, properties) + asNumber(variables[`speed.${type}.bonus`], 0) }
                }
                return value
            }
        })
    }
}

export default ModifierSetSpeedData
