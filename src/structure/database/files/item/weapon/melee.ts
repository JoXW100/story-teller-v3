import { AbilityType } from '../../ability/common'
import AbilityMeleeAttackData from '../../ability/meleeAttack'
import ItemWeaponDataBase from '.'
import { isEnum, isNumber } from 'utils'
import { ActionType, MeleeWeaponType } from 'structure/dnd'
import { EffectConditionType } from 'structure/database/effectCondition'
import { EffectCategory, EffectType } from 'structure/database/effect/common'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IItemWeaponMeleeData } from 'types/database/files/item'

class ItemWeaponMeleeData extends ItemWeaponDataBase implements IItemWeaponMeleeData {
    public override readonly subtype: MeleeWeaponType
    public readonly reach: number

    public constructor(data: Simplify<IItemWeaponMeleeData>) {
        super(data)
        this.subtype = data.subtype ?? ItemWeaponMeleeData.properties.subtype.value
        this.reach = data.reach ?? ItemWeaponMeleeData.properties.reach.value
    }

    public override createAbility(): AbilityMeleeAttackData | null {
        return new AbilityMeleeAttackData({
            type: AbilityType.MeleeWeapon,
            name: this.name,
            description: this.description,
            notes: this.notes,
            action: ActionType.Action,
            charges: this.charges,
            reach: this.reach,
            condition: {
                type: EffectConditionType.Hit,
                scaling: this.hitScaling
            },
            effects: {
                main: {
                    type: EffectType.Damage,
                    category: EffectCategory.MeleeDamage,
                    label: 'Damage',
                    damageType: this.damageType,
                    scaling: this.damageScaling,
                    die: this.damageDie,
                    dieCount: this.damageDieCount
                },
                ...this.effects
            }
        })
    }

    public static properties: DataPropertyMap<IItemWeaponMeleeData, ItemWeaponMeleeData> = {
        ...ItemWeaponDataBase.properties,
        subtype: {
            value: MeleeWeaponType.Battleaxe,
            validate: (value) => isEnum(value, MeleeWeaponType),
            simplify: (value) => value
        },
        reach: {
            value: 5,
            validate: isNumber
        }
    }
}

export default ItemWeaponMeleeData
