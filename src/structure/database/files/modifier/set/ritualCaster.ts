import ModifierSetDataBase, { ModifierSetType } from '.'
import type Modifier from '../modifier'
import { isBoolean } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierSetRitualCasterData } from 'types/database/files/modifier'

class ModifierSetRitualCasterBaseData extends ModifierSetDataBase implements IModifierSetRitualCasterData {
    public override readonly subtype = ModifierSetType.RitualCaster
    public readonly value: boolean

    public constructor(data: Simplify<IModifierSetRitualCasterData>) {
        super(data)
        this.value = data.value ?? ModifierSetRitualCasterBaseData.properties.value.value
    }

    public static properties: DataPropertyMap<IModifierSetRitualCasterData, ModifierSetRitualCasterBaseData> = {
        ...ModifierSetDataBase.properties,
        subtype: {
            value: ModifierSetType.RitualCaster,
            validate: (value) => value === this.properties.subtype.value,
            simplify: (value) => value
        },
        value: {
            value: false,
            validate: isBoolean
        }
    }

    public override apply(modifier: Modifier, key: string): void {
        modifier.ritualCaster.subscribe({
            key: key,
            data: this,
            apply: function (): boolean {
                return (this.data as ModifierSetRitualCasterBaseData).value
            }
        })
    }
}

export default ModifierSetRitualCasterBaseData
