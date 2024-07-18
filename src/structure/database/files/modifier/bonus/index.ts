import { ModifierType } from '../common'
import ModifierDataBase from '../data'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusDataBase } from 'types/database/files/modifier'

export enum ModifierBonusType {
    AC = 'ac',
    AllAbilityScores = 'allAttr',
    Strength = 'str',
    Dexterity = 'dex',
    Constitution = 'con',
    Intelligence = 'int',
    Wisdom = 'wis',
    Charisma = 'cha',
    Attacks = 'attacks',
    Speed = 'speed',
}

export abstract class ModifierBonusDataBase extends ModifierDataBase implements IModifierBonusDataBase {
    public override readonly type = ModifierType.Bonus
    public abstract readonly subtype: ModifierBonusType

    public static properties: Omit<DataPropertyMap<IModifierBonusDataBase, ModifierBonusDataBase>, 'subtype'> = {
        ...ModifierDataBase.properties,
        type: {
            value: ModifierType.Bonus,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        }
    }
}

export default ModifierBonusDataBase
