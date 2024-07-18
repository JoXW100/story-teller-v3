import { AbilityType } from '../../ability/common'
import AbilityRangedAttackData from '../../ability/rangedAttackData'
import ItemWeaponDataBase from '.'
import { isEnum, isNumber } from 'utils'
import { ActionType, RangedWeaponType } from 'structure/dnd'
import { EffectConditionType } from 'structure/database/effectCondition'
import { EffectCategory, EffectType } from 'structure/database/effect/common'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IItemWeaponRangedData } from 'types/database/files/item'

class ItemWeaponRangedData extends ItemWeaponDataBase implements IItemWeaponRangedData {
    public override readonly subtype: RangedWeaponType
    public readonly range: number
    public readonly rangeLong: number

    public constructor(data: Simplify<IItemWeaponRangedData>) {
        super(data)
        this.subtype = data.subtype ?? ItemWeaponRangedData.properties.subtype.value
        this.range = data.range ?? ItemWeaponRangedData.properties.range.value
        this.rangeLong = data.range ?? ItemWeaponRangedData.properties.rangeLong.value
    }

    public override createAbility(): AbilityRangedAttackData | null {
        return new AbilityRangedAttackData({
            type: AbilityType.RangedWeapon,
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
            range: this.range,
            rangeLong: this.rangeLong,
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
                ...this.effects
            }
        })
    }

    public static properties: DataPropertyMap<IItemWeaponRangedData, ItemWeaponRangedData> = {
        ...ItemWeaponDataBase.properties,
        subtype: {
            value: RangedWeaponType.Shortbow,
            validate: (value) => isEnum(value, RangedWeaponType),
            simplify: (value) => value
        },
        range: {
            value: 30,
            validate: isNumber
        },
        rangeLong: {
            value: 120,
            validate: isNumber
        }
    }
}

export default ItemWeaponRangedData
