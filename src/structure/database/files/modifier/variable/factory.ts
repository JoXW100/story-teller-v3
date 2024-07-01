import { ModifierVariableType } from '.'
import ModifierVariableNumberData from './number'
import ModifierVariableCollectionData from './collection'
import { isEnum, isRecord } from 'utils'
import { simplifyObjectProperties, validateObjectProperties, hasObjectProperties } from 'structure/database'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { Simplify } from 'types'
import type { IModifierVariableData, IModifierVariableNumberData } from 'types/database/files/modifier'

export type ModifierVariableData = ModifierVariableNumberData | ModifierVariableCollectionData

const ModifierVariableDataFactory = {
    create: function (data: Simplify<IModifierVariableData> = {}): ModifierVariableData {
        switch (data.subtype) {
            case ModifierVariableType.Collection:
                return new ModifierVariableCollectionData(data)
            case ModifierVariableType.Number:
            default:
                return new ModifierVariableNumberData(data as IModifierVariableNumberData)
        }
    },
    is: function (data: unknown): data is IModifierVariableData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IModifierVariableData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: IModifierVariableData): Simplify<IModifierVariableData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (data: unknown): DataPropertyMap<IModifierVariableData, ModifierVariableData> {
        const type = isRecord(data) && isEnum(data.subtype, ModifierVariableType)
            ? data.subtype
            : ModifierVariableType.Number
        switch (type) {
            case ModifierVariableType.Collection:
                return ModifierVariableCollectionData.properties
            case ModifierVariableType.Number:
                return ModifierVariableNumberData.properties
        }
    }
} satisfies IDatabaseFactory<IModifierVariableData, ModifierVariableData>

export default ModifierVariableDataFactory
