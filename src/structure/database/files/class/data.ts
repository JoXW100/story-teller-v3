import ClassLevelData from './levelData'
import { isBoolean, isDefined, isEnum, isRecord, isString, keysOf } from 'utils'
import { DieType } from 'structure/dice'
import { ArmorType, Attribute, ClassLevel, OptionalAttribute, ProficiencyLevel, ProficiencyLevelBasic, ToolType, WeaponTypeValue } from 'structure/dnd'
import { simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import EmptyToken from 'structure/language/tokens/empty'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { Simplify } from 'types'
import type { TokenContext } from 'types/language'
import type { DataPropertyMap } from 'types/database'
import type { IClassData, IClassLevelData } from 'types/database/files/class'

class ClassData implements IClassData {
    public readonly name: string
    public readonly description: string
    public readonly hitDie: DieType
    public readonly subclassLevel: ClassLevel
    public readonly levels: Record<ClassLevel, ClassLevelData>
    // Proficiencies
    public readonly proficienciesSave: Partial<Record<Attribute, ProficiencyLevel>>
    public readonly proficienciesTool: Partial<Record<ToolType, ProficiencyLevel>>
    public readonly proficienciesArmor: Partial<Record<ArmorType, ProficiencyLevelBasic>>
    public readonly proficienciesWeapon: Partial<Record<WeaponTypeValue, ProficiencyLevelBasic>>
    // Spells
    public readonly spellAttribute: OptionalAttribute
    public readonly preparationAll: boolean
    public readonly preparationSlotsScaling: OptionalAttribute
    public readonly learnedAll: boolean
    public readonly learnedSlotsScaling: OptionalAttribute
    public readonly ritualCaster: boolean

    public constructor (data: Simplify<IClassData> = {}) {
        this.name = data.name ?? ClassData.properties.name.value
        this.description = data.description ?? ClassData.properties.description.value
        this.hitDie = data.hitDie ?? ClassData.properties.hitDie.value
        this.subclassLevel = data.subclassLevel ?? ClassData.properties.subclassLevel.value
        this.levels = ClassData.properties.levels.value
        if (data.levels !== undefined) {
            for (const level of keysOf(data.levels)) {
                this.levels[level] = new ClassLevelData(data.levels[level])
            }
        }
        // Proficiencies
        this.proficienciesSave = ClassData.properties.proficienciesSave.value
        if (data.proficienciesSave !== undefined) {
            for (const type of keysOf(data.proficienciesSave)) {
                if (isEnum(type, Attribute) && isEnum(data.proficienciesSave[type], ProficiencyLevel)) {
                    this.proficienciesSave[type] = data.proficienciesSave[type]
                }
            }
        }
        this.proficienciesTool = ClassData.properties.proficienciesTool.value
        if (data.proficienciesTool !== undefined) {
            for (const type of keysOf(data.proficienciesTool)) {
                if (isEnum(type, ToolType) && isEnum(data.proficienciesTool[type], ProficiencyLevel)) {
                    this.proficienciesTool[type] = data.proficienciesTool[type]
                }
            }
        }
        this.proficienciesArmor = ClassData.properties.proficienciesArmor.value
        if (data.proficienciesArmor !== undefined) {
            for (const type of keysOf(data.proficienciesArmor)) {
                if (isEnum(type, ArmorType) && isEnum(data.proficienciesArmor[type], ProficiencyLevelBasic)) {
                    this.proficienciesArmor[type] = data.proficienciesArmor[type]
                }
            }
        }
        this.proficienciesWeapon = ClassData.properties.proficienciesWeapon.value
        if (data.proficienciesWeapon !== undefined) {
            for (const type of keysOf(data.proficienciesWeapon)) {
                if (isEnum(type, WeaponTypeValue) && isEnum(data.proficienciesWeapon[type], ProficiencyLevelBasic)) {
                    this.proficienciesWeapon[type] = data.proficienciesWeapon[type]
                }
            }
        }
        // Spells
        this.spellAttribute = data.spellAttribute ?? ClassData.properties.spellAttribute.value
        this.preparationAll = data.preparationAll ?? ClassData.properties.preparationAll.value
        if (this.preparationAll) {
            this.preparationSlotsScaling = ClassData.properties.preparationSlotsScaling.value
        } else {
            this.preparationSlotsScaling = data.preparationSlotsScaling ?? ClassData.properties.preparationSlotsScaling.value
        }
        this.learnedAll = data.learnedAll ?? ClassData.properties.learnedAll.value
        if (this.learnedAll) {
            this.learnedSlotsScaling = ClassData.properties.learnedSlotsScaling.value
        } else {
            this.learnedSlotsScaling = data.learnedSlotsScaling ?? ClassData.properties.learnedSlotsScaling.value
        }
        this.ritualCaster = data.ritualCaster ?? ClassData.properties.ritualCaster.value
    }

    public static properties: DataPropertyMap<IClassData, ClassData> = {
        name: {
            value: '',
            validate: isString
        },
        description: {
            value: '',
            validate: isString
        },
        subclassLevel: {
            value: ClassLevel.Level1,
            validate: (value) => isEnum(value, ClassLevel)
        },
        levels: {
            get value() {
                return {
                    [ClassLevel.Level1]: new ClassLevelData(),
                    [ClassLevel.Level2]: new ClassLevelData(),
                    [ClassLevel.Level3]: new ClassLevelData(),
                    [ClassLevel.Level4]: new ClassLevelData(),
                    [ClassLevel.Level5]: new ClassLevelData(),
                    [ClassLevel.Level6]: new ClassLevelData(),
                    [ClassLevel.Level7]: new ClassLevelData(),
                    [ClassLevel.Level8]: new ClassLevelData(),
                    [ClassLevel.Level9]: new ClassLevelData(),
                    [ClassLevel.Level10]: new ClassLevelData(),
                    [ClassLevel.Level11]: new ClassLevelData(),
                    [ClassLevel.Level12]: new ClassLevelData(),
                    [ClassLevel.Level13]: new ClassLevelData(),
                    [ClassLevel.Level14]: new ClassLevelData(),
                    [ClassLevel.Level15]: new ClassLevelData(),
                    [ClassLevel.Level16]: new ClassLevelData(),
                    [ClassLevel.Level17]: new ClassLevelData(),
                    [ClassLevel.Level18]: new ClassLevelData(),
                    [ClassLevel.Level19]: new ClassLevelData(),
                    [ClassLevel.Level20]: new ClassLevelData()
                }
            },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ClassLevel) && isRecord(val) && validateObjectProperties(val, ClassLevelData.properties)),
            simplify: (value) => {
                const simplified: Simplify<Record<ClassLevel, IClassLevelData>> = {}
                let flag = false
                for (const level of keysOf(value)) {
                    const res = simplifyObjectProperties(value[level], ClassLevelData.properties)
                    if (Object.values(res).some(isDefined)) {
                        flag = true
                        simplified[level] = res
                    }
                }
                return flag ? simplified : null
            }
        },
        proficienciesSave: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, Attribute) && isEnum(val, ProficiencyLevel)),
            simplify: (value) => Object.values(value).some((value) => value !== ProficiencyLevel.None) ? value : null
        },
        proficienciesTool: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ToolType) && isEnum(val, ProficiencyLevel)),
            simplify: (value) => Object.values(value).some((value) => value !== ProficiencyLevel.None) ? value : null
        },
        proficienciesArmor: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, ArmorType) && isEnum(val, ProficiencyLevelBasic)),
            simplify: (value) => Object.values(value).some((value) => value !== ProficiencyLevelBasic.None) ? value : null
        },
        proficienciesWeapon: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isEnum(key, WeaponTypeValue) && isEnum(val, ProficiencyLevelBasic)),
            simplify: (value) => Object.values(value).some((value) => value !== ProficiencyLevelBasic.None) ? value : null
        },
        hitDie: {
            value: DieType.D8,
            validate: (value) => isEnum(value, DieType)
        },
        // Spells
        spellAttribute: {
            value: OptionalAttribute.None,
            validate: (value) => isEnum(value, OptionalAttribute)
        },
        preparationSlotsScaling: {
            value: OptionalAttribute.None,
            validate: (value) => isEnum(value, OptionalAttribute)
        },
        preparationAll: {
            value: false,
            validate: isBoolean
        },
        learnedAll: {
            value: false,
            validate: isBoolean
        },
        learnedSlotsScaling: {
            value: OptionalAttribute.None,
            validate: (value) => isEnum(value, OptionalAttribute)
        },
        ritualCaster: {
            value: false,
            validate: isBoolean
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

export default ClassData
