import { isEnum, isNumber, isObjectId, isString } from 'utils'
import { ActionType, RestType } from 'structure/dnd'
import EmptyToken from 'structure/language/tokens/empty'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityDataBase } from 'types/database/files/ability'
import type { TokenContext } from 'types/language'

abstract class AbilityDataBase implements IAbilityDataBase {
    public readonly name: string
    public readonly description: string
    public readonly notes: string
    public readonly action: ActionType
    // Charges
    public readonly charges: number
    public readonly chargesReset: RestType
    // Modifiers
    public readonly modifiers: ObjectId[]

    public constructor(data: Simplify<IAbilityDataBase>) {
        this.name = data.name ?? AbilityDataBase.properties.name.value
        this.description = data.description ?? AbilityDataBase.properties.description.value
        this.notes = data.notes ?? AbilityDataBase.properties.notes.value
        this.action = data.action ?? AbilityDataBase.properties.action.value
        // Charges
        this.charges = data.charges ?? AbilityDataBase.properties.charges.value
        this.chargesReset = data.chargesReset ?? AbilityDataBase.properties.chargesReset.value
        // Modifiers
        this.modifiers = AbilityDataBase.properties.modifiers.value
        if (Array.isArray(data.modifiers)) {
            for (const id of data.modifiers) {
                if (isObjectId(id)) {
                    this.modifiers.push(id)
                }
            }
        }
    }

    public createContexts(elements: ElementDefinitions): [TokenContext] {
        const descriptionContext = {
            title: new EmptyToken(elements, this.name),
            name: new EmptyToken(elements, this.name)
        }
        return [descriptionContext]
    }

    public static properties: DataPropertyMap<IAbilityDataBase, AbilityDataBase> = {
        name: {
            value: '',
            validate: isString
        },
        description: {
            value: '',
            validate: isString
        },
        notes: {
            value: '',
            validate: isString
        },
        action: {
            value: ActionType.None,
            validate: (value) => isEnum(value, ActionType)
        },
        // Charges
        charges: {
            value: 0,
            validate: isNumber
        },
        chargesReset: {
            value: RestType.ShortRest,
            validate: (value) => isEnum(value, RestType)
        },
        // Modifiers
        modifiers: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(isObjectId),
            simplify: (value) => value.length === 0 ? null : value
        }
    }
}

export default AbilityDataBase
