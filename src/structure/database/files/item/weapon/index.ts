import ItemDataBase from '../data'
import { asEnum, asNumber, isEnum, isNumber, isRecord, isString, keysOf } from 'utils'
import type { TranslationHandler } from 'utils/hooks/localization'
import { DamageType, ItemType, ScalingType, type WeaponType } from 'structure/dnd'
import { DieType } from 'structure/dice'
import { simplifyNumberRecord } from 'structure/database'
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
    public readonly damageScaling: Partial<Record<ScalingType, number>>
    public readonly damageDie: DieType
    public readonly damageDieCount: Partial<Record<ScalingType, number>>
    // Hit
    public readonly hitScaling: Partial<Record<ScalingType, number>>
    // Other
    public readonly effects: Record<string, Effect>

    public constructor(data: Simplify<IItemWeaponDataBase>) {
        super(data)
        this.notes = data.notes ?? ItemWeaponDataBase.properties.notes.value
        this.damageType = asEnum(data.damageType, DamageType, ItemWeaponDataBase.properties.damageType.value)
        this.damageScaling = ItemWeaponDataBase.properties.damageScaling.value
        if (data.damageScaling !== undefined) {
            for (const type of keysOf(data.damageScaling)) {
                if (isEnum(type, ScalingType)) {
                    this.damageScaling[type] = asNumber(data.damageScaling[type], 0)
                }
            }
        }
        this.damageDie = asEnum(data.damageDie, DieType, ItemWeaponDataBase.properties.damageDie.value)
        this.damageDieCount = ItemWeaponDataBase.properties.damageDieCount.value
        if (data.damageDieCount !== undefined) {
            for (const type of keysOf(data.damageDieCount)) {
                if (isEnum(type, ScalingType)) {
                    this.damageDieCount[type] = asNumber(data.damageDieCount[type], 0)
                }
            }
        }
        // Hit
        this.hitScaling = ItemWeaponDataBase.properties.hitScaling.value
        if (data.hitScaling !== undefined) {
            for (const type of keysOf(data.hitScaling)) {
                if (isEnum(type, ScalingType)) {
                    this.hitScaling[type] = asNumber(data.hitScaling[type], 0)
                }
            }
        }
        // Other
        this.effects = ItemWeaponDataBase.properties.effects.value
        if (data.effects !== undefined) {
            for (const key of keysOf(data.effects)) {
                this.effects[key] = EffectFactory.create(data.effects[key])
            }
        }
    }

    public override getCategoryText(translator: TranslationHandler): string {
        return translator(`enum-weaponType-${this.subtype}`)
    }

    public override get equippable(): boolean {
        return true
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
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        },
        damageDie: {
            value: DieType.D6,
            validate: (value) => isEnum(value, DieType)
        },
        damageDieCount: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
        },
        // Hit
        hitScaling: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ScalingType) && isNumber(val)),
            simplify: simplifyNumberRecord
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
