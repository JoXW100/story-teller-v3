import type ModifierDocument from '..'
import ModifierDataBase from '../data'
import { ModifierType } from '../common'
import type Modifier from '../modifier'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetDataBase } from 'types/database/files/modifier'

export enum ModifierSetType {
    SpellAttribute = 'spellAttribute',
    Size = 'size',
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

    public apply(data: Modifier, self: ModifierDocument): void {
        data.subscribe(self)
    }

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
