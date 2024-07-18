import { hasObjectProperties, validateObjectProperties, simplifyObjectProperties } from '..'
import ChargesData from '.'
import { isRecord, keysOf } from 'utils'
import type { Simplify } from 'types'
import type { IDatabaseFactory, DataPropertyMap } from 'types/database'
import type { IChargesData } from 'types/database/charges'

export function simplifyChargesDataRecord(value: Record<string, IChargesData>): Simplify<Record<string, IChargesData>> | null {
    const result: Record<string, Simplify<IChargesData>> = {}
    let flag = false
    for (const key of keysOf(value)) {
        flag = true
        result[key] = ChargesDataFactory.simplify(value[key])
    }
    return flag ? result : null
}

const ChargesDataFactory: IDatabaseFactory<IChargesData, ChargesData> = {
    create: function (data: Simplify<IChargesData> = {}): ChargesData {
        return new ChargesData(data)
    },
    is: function (data: unknown): data is IChargesData {
        return ChargesDataFactory.validate(data) && hasObjectProperties(data, ChargesDataFactory.properties(data))
    },
    validate: function (data: unknown): data is Simplify<IChargesData> {
        return isRecord(data) && validateObjectProperties(data, ChargesDataFactory.properties(data))
    },
    simplify: function (data: IChargesData): Simplify<IChargesData> {
        return simplifyObjectProperties(data, ChargesDataFactory.properties(data))
    },
    properties: function (): DataPropertyMap<IChargesData, ChargesData> {
        return ChargesData.properties
    }
}

export default ChargesDataFactory
