import ModifierBonusDataBase, { ModifierBonusType } from '.'
import type ModifierDocument from '..'
import type Modifier from '../modifier'
import { asNumber, isNumber } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierBonusIntelligenceData } from 'types/database/files/modifier'

class ModifierBonusIntelligenceData extends ModifierBonusDataBase implements IModifierBonusIntelligenceData {
    public readonly subtype = ModifierBonusType.Intelligence
    public readonly value: number

    public constructor(data: Simplify<IModifierBonusIntelligenceData>) {
        super(data)
        this.value = asNumber(data.value, ModifierBonusIntelligenceData.properties.value.value)
    }

    public static properties: DataPropertyMap<IModifierBonusIntelligenceData, ModifierBonusIntelligenceData> = {
        ...ModifierBonusDataBase.properties,
        subtype: {
            value: ModifierBonusType.Intelligence,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: 0,
            validate: isNumber
        }
    }

    public apply(data: Modifier, self: ModifierDocument): void {
        data.int.subscribe({
            target: self,
            apply: function (value): number {
                return value + (self.data as ModifierBonusIntelligenceData).value
            }
        })
    }
}

export default ModifierBonusIntelligenceData
