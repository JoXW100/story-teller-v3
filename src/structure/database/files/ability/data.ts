import ModifierDataFactory, { type ModifierData } from '../modifier/factory'
import ModifierAddModifierData from '../modifier/add/modifier'
import type { AbilityType } from './common'
import { isEnum, isObjectId, isRecord, isString, keysOf } from 'utils'
import { ActionType } from 'structure/dnd'
import { EmptyProperties } from 'structure/database'
import EmptyToken from 'structure/language/tokens/empty'
import ChargesDataFactory, { simplifyChargesDataRecord } from 'structure/database/charges/factory'
import type ChargesData from 'structure/database/charges'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IAbilityDataBase } from 'types/database/files/ability'
import type { IProperties } from 'types/editor'
import type { TokenContext } from 'types/language'

abstract class AbilityDataBase implements IAbilityDataBase {
    public abstract readonly type: AbilityType
    public readonly name: string
    public readonly description: string
    public readonly notes: string
    public readonly action: ActionType
    // Charges
    public readonly charges: Record<string, ChargesData>
    // Modifiers
    public readonly modifiers: ModifierData[]

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
            for (const value of data.modifiers) {
                if (isObjectId(value)) {
                    this.modifiers.push(new ModifierAddModifierData({ name: value, value: { value: value } }))
                    console.log('modifiers.added modifier', value)
                } else {
                    this.modifiers.push(ModifierDataFactory.create(value))
                }
            }
        }
    }

    public static properties: Omit<DataPropertyMap<IAbilityDataBase, AbilityDataBase>, 'type'> = {
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
            validate: (value) => Array.isArray(value) && value.every(ModifierDataFactory.validate),
            simplify: (value) => value.length > 0 ? value : null
        }
    }

    public evaluateCharges(properties: Partial<IProperties>, choices?: Record<string, unknown>): ChargesData | null {
        for (const key of keysOf(this.charges)) {
            const value = this.charges[key]
            if (value.condition.evaluate(properties, choices)) {
                return value
            }
        }
        return null
    }

    public createContexts(properties: IProperties = EmptyProperties): [TokenContext] {
        const descriptionContext: TokenContext = {
            title: new EmptyToken(this.name),
            name: new EmptyToken(this.name)
        }
        for (const property of keysOf(properties)) {
            descriptionContext[property] = new EmptyToken(String(properties[property]))
        }
        return [descriptionContext]
    }
}

export default AbilityDataBase
