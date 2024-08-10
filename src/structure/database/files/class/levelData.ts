import type { ModifierData } from '../modifier/factory'
import ModifierDataFactory from '../modifier/factory'
import ModifierAddAbilityData from '../modifier/add/ability'
import { isEnum, isNumber, isObjectId, isRecord, keysOf } from 'utils'
import { getMaxSpellLevel } from 'utils/calculations'
import { OptionalAttribute, SpellLevel } from 'structure/dnd'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IClassLevelData } from 'types/database/files/class'

export enum LevelModifyType {
    Replace = 'replace',
    Add = 'add'
}

export function resolveAggregateClassDataSpellInfo(data: ClassLevelData[]): [learnedSlots: number, preparationSlots: number, spellSlots: Partial<Record<SpellLevel, number>>, maxSpellLevel: SpellLevel] {
    let learnedSlots = 0
    let preparationSlots = 0
    let spellSlots: Partial<Record<SpellLevel, number>> = {}
    for (const levelData of data) {
        switch (levelData.type) {
            case LevelModifyType.Add:
                learnedSlots += levelData.learnedSlots
                preparationSlots += levelData.preparationSlots
                for (const spellLevel of keysOf(levelData.spellSlots)) {
                    spellSlots[spellLevel] = (spellSlots[spellLevel] ?? 0) + (levelData.spellSlots[spellLevel] ?? 0)
                }
                break
            case LevelModifyType.Replace:
                learnedSlots = levelData.learnedSlots
                preparationSlots = levelData.preparationSlots
                spellSlots = { ...levelData.spellSlots }
                break
        }
    }
    return [learnedSlots, preparationSlots, spellSlots, getMaxSpellLevel(...keysOf(spellSlots))]
}

class ClassLevelData implements IClassLevelData {
    public readonly spellAttribute: OptionalAttribute
    public readonly type: LevelModifyType
    public readonly spellSlots: Partial<Record<SpellLevel, number>>
    public readonly preparationSlots: number
    public readonly learnedSlots: number
    public readonly modifiers: ModifierData[]

    constructor(data: Simplify<IClassLevelData> = {}) {
        this.spellAttribute = data.spellAttribute ?? ClassLevelData.properties.spellAttribute.value
        if (this.spellAttribute !== OptionalAttribute.None) {
            this.type = data.type ?? ClassLevelData.properties.type.value
            this.spellSlots = data.spellSlots ?? ClassLevelData.properties.spellSlots.value
            this.preparationSlots = data.preparationSlots ?? ClassLevelData.properties.preparationSlots.value
            this.learnedSlots = data.learnedSlots ?? ClassLevelData.properties.learnedSlots.value
        } else {
            this.type = ClassLevelData.properties.type.value
            this.spellSlots = ClassLevelData.properties.spellSlots.value
            this.preparationSlots = ClassLevelData.properties.preparationSlots.value
            this.learnedSlots = ClassLevelData.properties.learnedSlots.value
        }
        this.modifiers = ClassLevelData.properties.modifiers.value
        if (Array.isArray(data.modifiers)) {
            for (const value of data.modifiers) {
                this.modifiers.push(ModifierDataFactory.create(value))
            }
        }
        if (Array.isArray(data.abilities)) {
            for (const value of data.abilities) {
                if (isObjectId(value)) {
                    this.modifiers.push(new ModifierAddAbilityData({ name: value, value: { value: value } }))
                    console.log('modifiers.added ability', value)
                }
            }
        }
    }

    public static properties: DataPropertyMap<IClassLevelData, ClassLevelData> = {
        type: {
            value: LevelModifyType.Add,
            validate: (value) => isEnum(value, LevelModifyType)
        },
        spellAttribute: {
            value: OptionalAttribute.None,
            validate: (value) => isEnum(value, OptionalAttribute)
        },
        spellSlots: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, SpellLevel) && isNumber(val) && val >= 0),
            simplify: (value) => Object.keys(value).length > 0 ? value : null
        },
        preparationSlots: {
            value: 0,
            validate: isNumber
        },
        learnedSlots: {
            value: 0,
            validate: isNumber
        },
        modifiers: {
            get value() { return [] },
            validate: (value) => Array.isArray(value) && value.every(ModifierDataFactory.validate),
            simplify: (value) => value.length > 0 ? value : null
        }
    }
}

export default ClassLevelData
