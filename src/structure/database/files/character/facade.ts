import type CharacterData from './data'
import type CharacterStorage from './storage'
import type RaceData from '../race/data'
import type ClassData from '../class/data'
import type Modifier from '../modifier/modifier'
import CreatureFacade from '../creature/facade'
import { keysOf } from 'utils'
import { getMaxProficiencyLevel, getPreviousClassLevels } from 'utils/calculations'
import { type ClassLevel, type CreatureType, type Language, type MovementType, type ProficiencyLevelBasic, type Sense, type SizeType, SpellLevel, type Attribute, type ProficiencyLevel, type ToolType, type ArmorType, type WeaponType } from 'structure/dnd'
import type { ObjectId } from 'types'
import type { ICharacterData } from 'types/database/files/character'
import type { IConditionProperties } from 'types/database/condition'

class CharacterFacade extends CreatureFacade implements ICharacterData {
    public override readonly data: CharacterData
    public override readonly storage: CharacterStorage
    public readonly raceData: RaceData | null
    public readonly classesData: Record<ObjectId, ClassData>

    constructor(data: CharacterData, storage: CharacterStorage, modifier: Modifier, raceData: RaceData | null = null, classesData: Record<ObjectId, ClassData> = {}, properties: Partial<IConditionProperties> = {}) {
        super(data, storage, modifier, properties)
        this.data = data
        this.storage = storage
        this.raceData = raceData
        this.classesData = classesData
    }

    public get hasClass(): boolean {
        return Object.keys(this.data.classes).length > 0
    }

    public override get type(): CreatureType {
        return this.raceData !== null ? this.raceData.type : super.type
    }

    public override get size(): SizeType {
        if (this.raceData === null) {
            return this.modifier.size.call(this.data.size, this.properties, this.storage.choices)
        } else {
            return this.modifier.size.call(this.raceData.size, this.properties, this.storage.choices)
        }
    }

    public override get level(): number {
        if (this.hasClass) {
            let sum: number = 0
            for (const level of Object.values(this.classes)) {
                sum += Number(level)
            }
            return sum
        } else {
            return this.data.level
        }
    }

    public override get speed(): Partial<Record<MovementType, number>> {
        if (this.raceData === null) {
            return this.modifier.speed.call(this.data.speed, this.properties, this.storage.choices)
        } else {
            return this.modifier.speed.call({ ...this.raceData.speed, ...this.data.speed }, this.properties, this.storage.choices)
        }
    }

    public override get senses(): Partial<Record<Sense, number>> {
        if (this.raceData === null) {
            return this.modifier.senses.call(this.data.senses, this.properties, this.storage.choices)
        } else {
            return this.modifier.senses.call({ ...this.raceData.senses, ...this.data.senses }, this.properties, this.storage.choices)
        }
    }

    public override get proficienciesLanguage(): Partial<Record<Language, ProficiencyLevelBasic>> {
        if (this.raceData === null) {
            return this.modifier.proficienciesLanguage.call(this.data.proficienciesLanguage, this.properties, this.storage.choices)
        } else {
            return this.modifier.proficienciesLanguage.call({ ...this.raceData.languages, ...this.data.proficienciesLanguage }, this.properties, this.storage.choices)
        }
    }

    public get gender(): string {
        return this.data.gender
    }

    public get age(): string {
        return this.data.age
    }

    public get height(): string {
        return this.data.height
    }

    public get weight(): string {
        return this.data.weight
    }

    public get race(): ObjectId | null {
        return this.data.race
    }

    public get raceName(): string {
        return this.data.raceName
    }

    public get raceText(): string {
        if (this.raceData === null) {
            return this.raceName
        } else {
            return this.raceData.name
        }
    }

    public get namePlateText(): string {
        const className = keysOf(this.classesData).map((key) => `${this.classesData[key].name} (${this.classes[key] ?? 0})`).join(', ')
        return `${this.gender} ${this.raceText} ${className}`
    }

    public override get proficienciesSave(): Partial<Record<Attribute, ProficiencyLevel>> {
        const proficiencies = { ...this.data.proficienciesSave }
        for (const id of keysOf(this.data.classes)) {
            if (id in this.classesData) {
                const classData = this.classesData[id]
                for (const key of keysOf(classData.proficienciesSave)) {
                    proficiencies[key] = getMaxProficiencyLevel(proficiencies[key], classData.proficienciesSave[key])
                }
            }
        }
        return this.modifier.proficienciesSave.call(proficiencies, this.properties, this.storage.choices)
    }

    public override get proficienciesTool(): Partial<Record<ToolType, ProficiencyLevel>> {
        const proficiencies = { ...this.data.proficienciesTool }
        for (const id of keysOf(this.data.classes)) {
            if (id in this.classesData) {
                const classData = this.classesData[id]
                for (const key of keysOf(classData.proficienciesTool)) {
                    proficiencies[key] = getMaxProficiencyLevel(proficiencies[key], classData.proficienciesTool[key])
                }
            }
        }
        return this.modifier.proficienciesTool.call(proficiencies, this.properties, this.storage.choices)
    }

    public override get proficienciesArmor(): Partial<Record<ArmorType, ProficiencyLevelBasic>> {
        const proficiencies = { ...this.data.proficienciesArmor }
        for (const id of keysOf(this.data.classes)) {
            if (id in this.classesData) {
                const classData = this.classesData[id]
                for (const key of keysOf(classData.proficienciesArmor)) {
                    proficiencies[key] = getMaxProficiencyLevel(proficiencies[key], classData.proficienciesArmor[key]) as ProficiencyLevelBasic
                }
            }
        }
        return this.modifier.proficienciesArmor.call(proficiencies, this.properties, this.storage.choices)
    }

    public override get proficienciesWeapon(): Partial<Record<WeaponType, ProficiencyLevelBasic>> {
        const proficiencies = { ...this.data.proficienciesWeapon }
        for (const id of keysOf(this.data.classes)) {
            if (id in this.classesData) {
                const classData = this.classesData[id]
                for (const key of keysOf(classData.proficienciesWeapon)) {
                    proficiencies[key] = getMaxProficiencyLevel(proficiencies[key], classData.proficienciesWeapon[key]) as ProficiencyLevelBasic
                }
            }
        }
        return this.modifier.proficienciesWeapon.call(proficiencies, this.properties, this.storage.choices)
    }

    public get classes(): Record<ObjectId, ClassLevel> {
        return this.data.classes
    }

    public get cantripSlots(): number {
        return this.spellSlots[SpellLevel.Cantrip] ?? 0
    }

    public override get abilities(): Array<ObjectId | string> {
        let abilities: Array<ObjectId | string> = this.data.abilities
        if (this.raceData !== null) {
            abilities = [...this.raceData.abilities, ...abilities]
        }
        for (const id of keysOf(this.data.classes)) {
            const classLevel = this.data.classes[id]
            const classData = this.classesData[id]
            for (const level of getPreviousClassLevels(classLevel)) {
                abilities = [...abilities, ...classData.levels[level].abilities]
            }
        }
        return this.modifier.abilities.call(abilities, this.properties, this.storage.choices)
    }
}

export default CharacterFacade
