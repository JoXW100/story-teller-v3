import { ModifierType } from '../common'
import ModifierDataBase from '../data'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetDataBase } from 'types/database/files/modifier'

export enum ModifierSetType {
    SpellAttribute = 'spellAttribute',
    ArmorClassBase = 'acBase',
    Size = 'size',
    Speed = 'speed',
    Sense = 'sense',
    SaveProficiency = 'saveProficiency',
    SkillProficiency = 'skillProficiency',
    ToolProficiency = 'toolProficiency',
    LanguageProficiency = 'languageProficiency',
    ArmorProficiency = 'armorProficiency',
    WeaponProficiency = 'weaponProficiency',
}

abstract class ModifierSetDataBase extends ModifierDataBase implements IModifierSetDataBase {
    public readonly type = ModifierType.Set
    public abstract readonly subtype: ModifierSetType

    public static properties: Omit<DataPropertyMap<IModifierSetDataBase, ModifierSetDataBase>, 'subtype'> = {
        ...ModifierDataBase.properties,
        type: {
            value: ModifierType.Set,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        }
    }
}

export default ModifierSetDataBase
