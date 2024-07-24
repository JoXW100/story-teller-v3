import CreatureStorage from '../creature/storage'
import { InventoryItemDataFactory } from './factory'
import { asObjectId, isEnum, isNumber, isObjectId, isObjectIdOrNull, isRecord, isString, keysOf } from 'utils'
import { SpellLevel, SpellPreparationType } from 'structure/dnd'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ICharacterStorage, IInventoryItemData } from 'types/database/files/character'

function simplifyPreparations(value: Record<ObjectId, Record<ObjectId, SpellPreparationType>>): Record<ObjectId, Record<ObjectId, SpellPreparationType>> | null {
    const result: Record<ObjectId, Record<ObjectId, SpellPreparationType>> = {}
    let hasValue: boolean = false
    for (const id of keysOf(value)) {
        const classPreparations = value[id]
        for (const key of keysOf(classPreparations)) {
            const type = classPreparations[key]
            if (type !== SpellPreparationType.None) {
                hasValue = true
                result[id] = { ...result[id] ?? {}, [key]: type }
            }
        }
    }

    return hasValue ? result : null
}

function simplifyInventoryItemDataRecord(value: Record<ObjectId, IInventoryItemData>): Simplify<Record<ObjectId, IInventoryItemData>> | null {
    const result: Simplify<Record<ObjectId, IInventoryItemData>> = {}
    let flag = false
    for (const id of keysOf(value)) {
        flag = true
        result[id] = InventoryItemDataFactory.simplify(value[id])
    }
    return flag ? result : null
}

class CharacterStorage extends CreatureStorage implements ICharacterStorage {
    public readonly subrace: ObjectId | null
    public readonly subclasses: Record<ObjectId, ObjectId>
    public readonly spellPreparations: Record<ObjectId, Record<ObjectId, SpellPreparationType>>
    public readonly preparationsExpendedSlots: Record<ObjectId, Partial<Record<SpellLevel, number>>>
    public readonly inventory: Record<ObjectId, IInventoryItemData>
    public readonly attunement: ObjectId[]
    public readonly inventoryText: string

    public constructor(storage: Simplify<ICharacterStorage>) {
        super(storage)
        this.subrace = asObjectId(storage.subrace)
        this.subclasses = CharacterStorage.properties.subclasses.value
        if (storage.subclasses !== undefined) {
            for (const id of keysOf(storage.subclasses)) {
                const subclassId = storage.subclasses[id]
                if (isObjectId(id) && isObjectId(subclassId)) {
                    this.subclasses[id] = subclassId
                }
            }
        }
        this.spellPreparations = CharacterStorage.properties.spellPreparations.value
        if (storage.spellPreparations !== undefined) {
            for (const id of keysOf(storage.spellPreparations)) {
                const classPreparations = storage.spellPreparations[id]
                if (isObjectId(id) && classPreparations !== undefined) {
                    this.spellPreparations[id] = {}
                    for (const key of keysOf(classPreparations)) {
                        const type = classPreparations[key]
                        if (isEnum(type, SpellPreparationType)) {
                            this.spellPreparations[id][key] = type
                        }
                    }
                }
            }
        }
        this.preparationsExpendedSlots = CharacterStorage.properties.preparationsExpendedSlots.value
        if (storage.preparationsExpendedSlots !== undefined) {
            for (const id of keysOf(storage.preparationsExpendedSlots)) {
                const expendedSlots = storage.preparationsExpendedSlots[id]
                if (isObjectId(id) && expendedSlots !== undefined) {
                    this.preparationsExpendedSlots[id] = {}
                    for (const key of keysOf(expendedSlots)) {
                        const type = expendedSlots[key]
                        if (isNumber(type)) {
                            this.preparationsExpendedSlots[id][key] = type
                        }
                    }
                }
            }
        }
        this.inventory = CharacterStorage.properties.inventory.value
        if (storage.inventory !== undefined) {
            for (const id of keysOf(storage.inventory)) {
                const data = storage.inventory[id]
                if (isObjectId(id) && data !== undefined) {
                    this.inventory[id] = InventoryItemDataFactory.create(data)
                }
            }
        }
        this.attunement = CharacterStorage.properties.attunement.value
        if (storage.attunement !== undefined) {
            for (const id of storage.attunement) {
                if (isObjectId(id)) {
                    this.attunement.push(id)
                }
            }
        }
        this.inventoryText = storage.inventoryText ?? CharacterStorage.properties.inventoryText.value
    }

    public static properties: DataPropertyMap<ICharacterStorage, CharacterStorage> = {
        ...CreatureStorage.properties,
        subrace: {
            value: null,
            validate: isObjectIdOrNull
        },
        subclasses: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isObjectId(key) && isObjectId(val))
        },
        spellPreparations: {
            get value() { return {} },
            validate: (value) => isRecord(value, (classId, classPreparations) =>
                isObjectId(classId) && isRecord(classPreparations, (spellId, type) =>
                    isObjectId(spellId) && isEnum(type, SpellPreparationType))),
            simplify: simplifyPreparations
        },
        preparationsExpendedSlots: {
            get value() { return {} },
            validate: (value) => isRecord(value, (classId, expendedSlots) =>
                isObjectId(classId) && isRecord(expendedSlots, (level, count) =>
                    isEnum(level, SpellLevel) && isNumber(count)))
        },
        inventory: {
            get value() { return {} },
            validate: (value) => isRecord(value, (id, data) => isObjectId(id) && InventoryItemDataFactory.validate(data)),
            simplify: simplifyInventoryItemDataRecord
        },
        attunement: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(isObjectId),
            simplify: (value) => value.length > 0 ? value : null
        },
        inventoryText: {
            value: '',
            validate: isString
        }
    }
}

export default CharacterStorage
