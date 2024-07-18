import { ModifierType } from '../common'
import ModifierDataBase from '../data'
import type { DataPropertyMap } from 'types/database'
import type { IModifierAbilityDataBase } from 'types/database/files/modifier'

export enum ModifierAbilityType {
    AttackBonus = 'attackBonus',
    MeleeWeaponAttackBonus = 'meleeWeaponAttackBonus',
    RangedWeaponAttackBonus = 'rangedWeaponAttackBonus',
    ThrownWeaponAttackBonus = 'thrownWeaponAttackBonus',
    DamageBonus = 'damageBonus',
    MeleeWeaponDamageBonus = 'meleeWeaponDamageBonus',
    RangedWeaponDamageBonus = 'rangedWeaponDamageBonus',
    ThrownWeaponDamageBonus = 'thrownWeaponDamageBonus'
}

abstract class ModifierAbilityDataBase extends ModifierDataBase implements IModifierAbilityDataBase {
    public override readonly type = ModifierType.Ability
    public abstract readonly subtype: ModifierAbilityType

    public static properties: Omit<DataPropertyMap<IModifierAbilityDataBase, ModifierAbilityDataBase>, 'subtype'> = {
        ...ModifierDataBase.properties,
        type: {
            value: ModifierType.Ability,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        }
    }
}

export default ModifierAbilityDataBase
