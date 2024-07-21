import type { AbilityData } from '../ability/factory'
import { isBoolean, isEnum, isNumber, isObjectId, isRecord, isString, keysOf } from 'utils'
import { getOptionType } from 'structure/optionData'
import type ChargesData from 'structure/database/charges'
import ChargesDataFactory, { simplifyChargesDataRecord } from 'structure/database/charges/factory'
import { type ItemType, Rarity } from 'structure/dnd'
import EmptyToken from 'structure/language/tokens/empty'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IItemDataBase } from 'types/database/files/item'
import type { TokenContext } from 'types/language'
import type { IConditionProperties } from 'types/database/condition'

abstract class ItemDataBase implements IItemDataBase {
    public abstract readonly type: ItemType
    public readonly name: string
    public readonly description: string
    public readonly rarity: Rarity
    public readonly attunement: boolean
    public readonly weight: number
    public readonly cost: number
    // Charges
    public readonly charges: Record<string, ChargesData>
    // Modifiers
    readonly modifiers: ObjectId[]

    public constructor(data: Simplify<IItemDataBase>) {
        this.name = data.name ?? ItemDataBase.properties.name.value
        this.description = data.description ?? ItemDataBase.properties.description.value
        this.rarity = data.rarity ?? ItemDataBase.properties.rarity.value
        this.attunement = data.attunement ?? ItemDataBase.properties.attunement.value
        this.weight = data.weight ?? ItemDataBase.properties.weight.value
        this.cost = data.cost ?? ItemDataBase.properties.cost.value
        // Charges
        this.charges = ItemDataBase.properties.charges.value
        if (data.charges !== undefined) {
            for (const key of keysOf(data.charges)) {
                this.charges[key] = ChargesDataFactory.create(data.charges[key])
            }
        }
        // Modifiers
        this.modifiers = ItemDataBase.properties.modifiers.value
        if (Array.isArray(data.modifiers)) {
            for (const modifier of data.modifiers) {
                if (isObjectId(modifier)) {
                    this.modifiers.push(modifier)
                }
            }
        }
    }

    public get categoryText(): string {
        return getOptionType('itemType').options[this.type]
    }

    public get equippable(): boolean {
        return false
    }

    public static properties: Omit<DataPropertyMap<IItemDataBase, ItemDataBase>, 'type'> = {
        name: {
            value: '',
            validate: isString
        },
        description: {
            value: '',
            validate: isString
        },
        rarity: {
            value: Rarity.Mundane,
            validate: (value) => isEnum(value, Rarity)
        },
        attunement: {
            value: false,
            validate: isBoolean
        },
        weight: {
            value: 0,
            validate: isNumber
        },
        cost: {
            value: 0,
            validate: isNumber
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

    public createContexts(elements: ElementDefinitions): [TokenContext] {
        const descriptionContext: TokenContext = {
            title: new EmptyToken(elements, this.name),
            name: new EmptyToken(elements, this.name)
        }
        return [descriptionContext]
    }

    public createAbility(): AbilityData | null {
        return null
    }

    public evaluateNumCharges(data: Partial<IConditionProperties>, choices?: Record<string, unknown>): number {
        for (const key of keysOf(this.charges)) {
            const value = this.charges[key]
            if (value.condition.evaluate(data, choices)) {
                return value.getCharges(data)
            }
        }
        return 0
    }
}

export default ItemDataBase
