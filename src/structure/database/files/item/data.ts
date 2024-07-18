import type { AbilityData } from '../ability/factory'
import { isBoolean, isEnum, isNumber, isObjectId, isString } from 'utils'
import { type ItemType, Rarity, RestType } from 'structure/dnd'
import EmptyToken from 'structure/language/tokens/empty'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IItemDataBase } from 'types/database/files/item'
import type { TokenContext } from 'types/language'
import { getOptionType } from 'structure/optionData'

abstract class ItemDataBase implements IItemDataBase {
    public abstract readonly type: ItemType
    public readonly name: string
    public readonly description: string
    public readonly rarity: Rarity
    public readonly attunement: boolean
    public readonly weight: number
    public readonly cost: number
    // Charges
    public readonly charges: number
    public readonly chargesReset: RestType
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
        this.charges = data.charges ?? ItemDataBase.properties.charges.value
        this.chargesReset = data.chargesReset ?? ItemDataBase.properties.chargesReset.value
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

    public createAbility(): AbilityData | null {
        return null
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
}

export default ItemDataBase
