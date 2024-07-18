import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusAllAttributesData as IModifierBonusAllAbilityScoresData } from 'types/database/files/modifier'

class ModifierBonusAllAbilityScoresData extends ModifierBonusDataBase implements IModifierBonusAllAbilityScoresData {
    public readonly subtype = ModifierBonusType.AllAbilityScores
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusAllAbilityScoresData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusAllAbilityScoresData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusAllAbilityScoresData, ModifierBonusAllAbilityScoresData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.AllAbilityScores,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public override apply(modifier: Modifier, self: ModifierDocument, key: string): void {
        modifier.str.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusAllAbilityScoresData).value
            }
        })
        modifier.dex.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusAllAbilityScoresData).value
            }
        })
        modifier.con.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusAllAbilityScoresData).value
            }
        })
        modifier.int.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusAllAbilityScoresData).value
            }
        })
        modifier.wis.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusAllAbilityScoresData).value
            }
        })
        modifier.cha.subscribe({
            key: key,
            target: self,
            data: this,
            apply: function (value): number {
                return value + (this.data as ModifierBonusAllAbilityScoresData).value
            }
        })
    }
}

export default ModifierBonusAllAbilityScoresData
