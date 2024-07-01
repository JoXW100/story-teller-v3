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

    public apply(data: Modifier, self: ModifierDocument): void {
        data.str.subscribe({
            target: self,
            apply: function (value): number {
                return value + (self.data as ModifierBonusAllAbilityScoresData).value
            }
        })
        data.dex.subscribe({
            target: self,
            apply: function (value): number {
                return value + (self.data as ModifierBonusAllAbilityScoresData).value
            }
        })
        data.con.subscribe({
            target: self,
            apply: function (value): number {
                return value + (self.data as ModifierBonusAllAbilityScoresData).value
            }
        })
        data.int.subscribe({
            target: self,
            apply: function (value): number {
                return value + (self.data as ModifierBonusAllAbilityScoresData).value
            }
        })
        data.wis.subscribe({
            target: self,
            apply: function (value): number {
                return value + (self.data as ModifierBonusAllAbilityScoresData).value
            }
        })
        data.cha.subscribe({
            target: self,
            apply: function (value): number {
                return value + (self.data as ModifierBonusAllAbilityScoresData).value
            }
        })
    }
}

export default ModifierBonusAllAbilityScoresData
