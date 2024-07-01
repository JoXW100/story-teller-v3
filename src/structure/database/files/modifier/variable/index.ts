import ModifierDataBase from '../data'
import { ModifierType } from '../common'
import { asEnum, isEnum, isString } from 'utils'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IModifierVariableDataBase } from 'types/database/files/modifier'

export enum ModifierVariableType {
    Collection = 'collection',
    Number = 'number'
}

export enum OperationType {
    Add = 'add',
    Replace = 'replace'
}

abstract class ModifierVariableDataBase extends ModifierDataBase implements IModifierVariableDataBase {
    public override readonly type = ModifierType.Variable
    public abstract readonly subtype: ModifierVariableType
    public readonly operation: OperationType
    public readonly variable: string

    public constructor(data: Simplify<IModifierVariableDataBase>) {
        super(data)
        this.variable = data.variable ?? ModifierVariableDataBase.properties.variable.value
        this.operation = asEnum(data.operation, OperationType) ?? OperationType.Add
    }

    public static properties: Omit<DataPropertyMap<IModifierVariableDataBase, ModifierVariableDataBase>, 'subtype'> = {
        ...ModifierDataBase.properties,
        type: {
            value: ModifierType.Variable,
            validate: (value) => value === this.properties.type.value,
            simplify: (value) => value
        },
        operation: {
            value: OperationType.Add,
            validate: (value) => isEnum(value, OperationType)
        },
        variable: {
            value: '',
            validate: isString
        }
    }
}

export default ModifierVariableDataBase
