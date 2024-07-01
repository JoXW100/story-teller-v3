import TextData from './data'
import { isRecord } from 'utils'
import { hasObjectProperties, simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import type { Simplify } from 'types'
import type { DataPropertyMap, IDatabaseFactory } from 'types/database'
import type { ITextData } from 'types/database/files/text'

const TextDataFactory: IDatabaseFactory<ITextData, TextData> = {
    create: function (data: Simplify<ITextData>): TextData {
        return new TextData(data)
    },
    is: function (data: unknown): data is ITextData {
        return this.validate(data) && hasObjectProperties(data, this.properties(data))
    },
    validate: function (data: unknown): data is Simplify<ITextData> {
        return isRecord(data) && validateObjectProperties(data, this.properties(data))
    },
    simplify: function (data: ITextData): Simplify<ITextData> {
        return simplifyObjectProperties(data, this.properties(data))
    },
    properties: function (): DataPropertyMap<ITextData, TextData> {
        return TextData.properties
    }
}

export default TextDataFactory
