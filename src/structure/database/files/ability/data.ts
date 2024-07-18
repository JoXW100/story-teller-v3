import { isEnum, isObjectId, isRecord, isString, keysOf } from 'utils'
import { ActionType } from 'structure/dnd'
import EmptyToken from 'structure/language/tokens/empty'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import ChargesDataFactory, { simplifyChargesDataRecord } from 'structure/database/charges/factory'
import type ChargesData from 'structure/database/charges'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityDataBase } from 'types/database/files/ability'
import type { IConditionProperties } from 'types/database/condition'
import type { TokenContext } from 'types/language'

abstract class AbilityDataBase implements IAbilityDataBase {
    public readonly name: string
    public readonly description: string
    public readonly notes: string
    public readonly action: ActionType
    // Charges
    public readonly charges: Record<string, ChargesData>
    // Modifiers
    readonly modifiers: ObjectId[]

    public constructor(data: Simplify<IAbilityDataBase>) {
        this.name = data.name ?? AbilityDataBase.properties.name.value
        this.description = data.description ?? AbilityDataBase.properties.description.value
        this.notes = data.notes ?? AbilityDataBase.properties.notes.value
        this.action = data.action ?? AbilityDataBase.properties.action.value
        // Charges
        this.charges = AbilityDataBase.properties.charges.value
        if (data.charges !== undefined) {
            for (const key of keysOf(data.charges)) {
                this.charges[key] = ChargesDataFactory.create(data.charges[key])
            }
        }
        // Modifiers
        this.modifiers = AbilityDataBase.properties.modifiers.value
        if (Array.isArray(data.modifiers)) {
            for (const modifier of data.modifiers) {
                if (isObjectId(modifier)) {
                    this.modifiers.push(modifier)
                }
            }
        }
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
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isString(key) && ChargesDataFactory.validate(val)),
            simplify: simplifyChargesDataRecord
        },
        // Modifiers
        modifiers: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(isObjectId),
            simplify: (value) => value.length > 0 ? value : null
        }
    }

    public evaluateNumCharges(data: Partial<IConditionProperties>, choices?: Record<string, unknown>): number {
        for (const key of keysOf(this.charges)) {
            const value = this.charges[key]
            if (value.condition.evaluate(data, choices)) {
                return value.charges
            }
        }
        return 0
    }

    public createContexts(elements: ElementDefinitions): [TokenContext] {
        const descriptionContext: TokenContext = {
            title: new EmptyToken(elements, this.name),
            name: new EmptyToken(elements, this.name)
        }
        return [descriptionContext]
    }
}

export default AbilityDataBase
