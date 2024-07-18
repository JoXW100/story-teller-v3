import { AbilityType } from '../../ability/common'
import AbilityThrownAttackData from '../../ability/thrownAttackData'
import ItemWeaponDataBase from '.'
import { isEnum, isNumber } from 'utils'
import { ActionType, ThrownWeaponType } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IItemWeaponThrownData } from 'types/database/files/item'
import { EffectConditionType } from 'structure/database/effectCondition'
import { EffectCategory, EffectType } from 'structure/database/effect/common'

class ItemWeaponThrownData extends ItemWeaponDataBase implements IItemWeaponThrownData {
    public override readonly subtype: ThrownWeaponType
    public readonly reach: number
    public readonly range: number

    public constructor(data: Simplify<IItemWeaponThrownData>) {
        super(data)
        this.subtype = data.subtype ?? ItemWeaponThrownData.properties.subtype.value
        this.reach = data.range ?? ItemWeaponThrownData.properties.reach.value
        this.range = data.range ?? ItemWeaponThrownData.properties.range.value
    }

    public override createAbility(): AbilityThrownAttackData | null {
        return new AbilityThrownAttackData({
            type: AbilityType.ThrownWeapon,
            name: this.name,
            description: this.description,
            notes: this.notes,
            action: ActionType.Action,
            charges: {
                'main': {
                    charges: this.charges,
                    chargesReset: this.chargesReset
                }
            },
            reach: this.reach,
            range: this.range,
            condition: {
                type: EffectConditionType.Hit,
                scaling: this.hitScaling,
                proficiency: this.hitProficiency,
                modifier: this.hitModifier
            },
            effects: {
                main: {
                    type: EffectType.Damage,
                    category: EffectCategory.MeleeDamage,
                    label: 'Damage',
                    damageType: this.damageType,
                    scaling: this.damageScaling,
                    proficiency: this.damageProficiency,
                    die: this.damageDie,
                    dieCount: this.damageDieCount,
                    modifier: this.damageModifier
                },
                thrown: {
                    type: EffectType.Damage,
                    category: EffectCategory.ThrownDamage,
                    label: 'Thrown',
                    damageType: this.damageType,
                    scaling: this.damageScaling,
                    proficiency: this.damageProficiency,
                    die: this.damageDie,
                    dieCount: this.damageDieCount,
                    modifier: this.damageModifier
                },
                ...this.effects
            }
        })
    }

    public static properties: DataPropertyMap<IItemWeaponThrownData, ItemWeaponThrownData> = {
        ...ItemWeaponDataBase.properties,
        subtype: {
            value: ThrownWeaponType.Dagger,
            validate: (value) => isEnum(value, ThrownWeaponType),
            simplify: (value) => value
        },
        reach: {
            value: 5,
            validate: isNumber
        },
        range: {
            value: 30,
            validate: isNumber
        }
    }
}

export default ItemWeaponThrownData
