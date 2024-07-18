import ItemDataBase from '../data'
import { isBoolean, isCalcValue, isEnum, isNumber, isRecord, isString, keysOf } from 'utils'
import { DamageType, ItemType, ScalingType, type WeaponType } from 'structure/dnd'
import { DieType } from 'structure/dice'
import { getOptionType } from 'structure/optionData'
import { AutoCalcValue, createCalcValue, type ICalcValue, simplifyCalcValue } from 'structure/database'
import EffectFactory, { type Effect, simplifyEffectRecord } from 'structure/database/effect/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IItemWeaponDataBase } from 'types/database/files/item'

abstract class ItemWeaponDataBase extends ItemDataBase implements IItemWeaponDataBase {
    public override readonly type = ItemType.Weapon
    public abstract readonly subtype: WeaponType
    public readonly notes: string
    // Damage
    public readonly damageType: DamageType
    public readonly damageScaling: ScalingType
    public readonly damageProficiency: boolean
    public readonly damageDie: DieType
    public readonly damageDieCount: number
    public readonly damageModifier: ICalcValue
    // Hit
    public readonly hitScaling: ScalingType
    public readonly hitProficiency: boolean
    public readonly hitModifier: ICalcValue
    // Other
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<IItemWeaponDataBase>) {
        super(data)
        this.notes = data.notes ?? ItemWeaponDataBase.properties.notes.value
        this.damageType = data.damageType ?? ItemWeaponDataBase.properties.damageType.value
        this.damageScaling = data.damageScaling ?? ItemWeaponDataBase.properties.damageScaling.value
        this.damageProficiency = data.damageProficiency ?? ItemWeaponDataBase.properties.damageProficiency.value
        this.damageDie = data.damageDie ?? ItemWeaponDataBase.properties.damageDie.value
        this.damageDieCount = data.damageDieCount ?? ItemWeaponDataBase.properties.damageDieCount.value
        this.damageModifier = createCalcValue(data.damageModifier, ItemWeaponDataBase.properties.damageModifier.value)
        // Hit
        this.hitScaling = data.hitScaling ?? ItemWeaponDataBase.properties.hitScaling.value
        this.hitProficiency = data.hitProficiency ?? ItemWeaponDataBase.properties.hitProficiency.value
        this.hitModifier = createCalcValue(data.hitModifier, ItemWeaponDataBase.properties.hitModifier.value)
        // Other
        this.effects = ItemWeaponDataBase.properties.effects.value
        if (data.effects !== undefined) {
            for (const key of keysOf(data.effects)) {
                this.effects[key] = EffectFactory.create(data.effects[key])
            }
        }
    }

    public override get categoryText(): string {
        return getOptionType('weaponType').options[this.subtype]
    }

    public static properties: Omit<DataPropertyMap<IItemWeaponDataBase, ItemWeaponDataBase>, 'subtype'> = {
        ...ItemDataBase.properties,
        notes: {
            value: '',
            validate: isString
        },
        type: {
            value: ItemType.Weapon,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        // Damage
        damageType: {
            value: DamageType.Slashing,
            validate: (value) => isEnum(value, DamageType)
        },
        damageScaling: {
            value: ScalingType.Finesse,
            validate: (value) => isEnum(value, ScalingType)
        },
        damageProficiency: {
            value: false,
            validate: isBoolean
        },
        damageDie: {
            value: DieType.D6,
            validate: (value) => isEnum(value, DieType)
        },
        damageDieCount: {
            value: 1,
            validate: isNumber
        },
        damageModifier: {
            get value() { return { ...AutoCalcValue } },
            validate: isCalcValue,
            simplify: simplifyCalcValue
        },
        // Hit
        hitScaling: {
            value: ScalingType.Finesse,
            validate: (value) => isEnum(value, ScalingType)
        },
        hitProficiency: {
            value: true,
            validate: isBoolean
        },
        hitModifier: {
            get value() { return { ...AutoCalcValue } },
            validate: isCalcValue,
            simplify: simplifyCalcValue
        },
        // Other
        effects: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isString(key) && EffectFactory.validate(val)),
            simplify: simplifyEffectRecord
        }
    }
}

export default ItemWeaponDataBase
