import { asEnum, isRecord } from 'utils'
import { ModifierType } from './common'
import ModifierAbilityDataFactory, { type ModifierAbilityData } from './ability/factory'
import ModifierAddDataFactory, { type ModifierAddData } from './add/factory'
import ModifierBonusDataFactory, { type ModifierBonusData } from './bonus/factory'
import type { ModifierVariableData } from './variable/factory'
import type ModifierChoiceData from './choice'
import { ModifierChoiceDataFactory } from './choice'
import type ModifierRemoveData from './remove'
import { ModifierRemoveDataFactory } from './remove'
import ModifierSetDataFactory, { type ModifierSetData } from './set/factory'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { IModifierData } from 'types/database/files/modifier'
import ModifierVariableDataFactory from './variable/factory'

export type ModifierData = ModifierAddData | ModifierBonusData |
ModifierAbilityData | ModifierChoiceData | ModifierRemoveData | ModifierSetData |
ModifierVariableData

function getFactory(type: ModifierType | null | undefined): IDatabaseFactory<IModifierData, ModifierData> {
    switch (type ?? ModifierType.Add) {
        case ModifierType.Ability:
            return ModifierAbilityDataFactory as IDatabaseFactory<IModifierData, ModifierData>
        case ModifierType.Add:
            return ModifierAddDataFactory as IDatabaseFactory<IModifierData, ModifierData>
        case ModifierType.Bonus:
            return ModifierBonusDataFactory as IDatabaseFactory<IModifierData, ModifierData>
        case ModifierType.Remove:
            return ModifierRemoveDataFactory as IDatabaseFactory<IModifierData, ModifierData>
        case ModifierType.Set:
            return ModifierSetDataFactory as IDatabaseFactory<IModifierData, ModifierData>
        case ModifierType.Choice:
            return ModifierChoiceDataFactory as IDatabaseFactory<IModifierData, ModifierData>
        case ModifierType.Variable:
            return ModifierVariableDataFactory as IDatabaseFactory<IModifierData, ModifierData>
    }
}

const ModifierDataFactory = {
    create: function (data: Simplify<IModifierData> = {}): ModifierData {
        return getFactory(data.type).create(data)
    },
    is: function (data: unknown): data is IModifierData {
        return isRecord(data) && getFactory(asEnum(data.type, ModifierType)).is(data)
    },
    validate: function (data: unknown): data is Simplify<IModifierData> & { key: string } {
        return isRecord(data) && getFactory(asEnum(data.type, ModifierType)).validate(data)
    },
    simplify: function (data: IModifierData): Simplify<IModifierData> {
        return getFactory(data.type).simplify(data)
    },
    properties: function (data: unknown): DataPropertyMap<IModifierData, ModifierData> {
        const type = isRecord(data)
            ? asEnum(data.type, ModifierType)
            : ModifierType.Add
        return getFactory(type).properties(data)
    }
} satisfies IDatabaseFactory<IModifierData, ModifierData>

export default ModifierDataFactory
