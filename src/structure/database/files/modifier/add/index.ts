import { ModifierType } from '../common'
import ModifierDataBase from '../data'
import type { Simplify } from 'types'
import type { IModifierAddDataBase } from 'types/database/files/modifier'
import type { DataPropertyMap } from 'types/database'

export enum ModifierAddType {
    Linked = 'linked',
    Ability = 'ability',
    ClassSpell = 'classSpell',
    Spell = 'spell',
    Advantage = 'advantage',
    Disadvantage = 'disadvantage',
    Resistance = 'resistance',
    Vulnerability = 'vulnerability',
    DamageImmunity = 'damageImmunity',
    ConditionImmunity = 'conditionImmunity',
}

export abstract class ModifierAddDataBase extends ModifierDataBase implements IModifierAddDataBase {
    public override readonly type: ModifierType.Add
    public abstract readonly subtype: ModifierAddType

    public constructor(data: Simplify<IModifierAddDataBase> = {}) {
        super(data)
        this.type = data.type ?? ModifierAddDataBase.properties.type.value
    }

    public static properties: Omit<DataPropertyMap<IModifierAddDataBase, ModifierAddDataBase>, 'subtype'> = {
        ...ModifierDataBase.properties,
        type: {
            value: ModifierType.Add,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        }
    }
}

export default ModifierAddDataBase
