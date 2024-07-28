import ClassLevelData from '../class/levelData'
import { asObjectId, isBoolean, isDefined, isEnum, isObjectIdOrNull, isRecord, isString, keysOf } from 'utils'
import { ClassLevel, OptionalAttribute } from 'structure/dnd'
import { simplifyObjectProperties, validateObjectProperties } from 'structure/database'
import EmptyToken from 'structure/language/tokens/empty'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { ISubclassData } from 'types/database/files/subclass'
import type { IClassLevelData } from 'types/database/files/class'
import type { TokenContext } from 'types/language'

class SubclassData implements ISubclassData {
    public readonly name: string
    public readonly description: string
    public readonly content: string
    public readonly parentFile: ObjectId | null
    public readonly levels: Record<ClassLevel, ClassLevelData>
    // Spells
    public readonly spellAttribute: OptionalAttribute
    public readonly preparationSlotsScaling: OptionalAttribute
    public readonly preparationAll: boolean
    public readonly learnedAll: boolean
    public readonly learnedSlotsScaling: OptionalAttribute

    public constructor (data: Simplify<ISubclassData> = {}) {
        this.name = data.name ?? SubclassData.properties.name.value
        this.description = data.description ?? SubclassData.properties.description.value
        this.content = data.content ?? SubclassData.properties.content.value
        this.parentFile = asObjectId(data.parentFile) ?? SubclassData.properties.parentFile.value
        this.levels = SubclassData.properties.levels.value
        if (data.levels !== undefined) {
            for (const level of keysOf(data.levels)) {
                this.levels[level] = new ClassLevelData(data.levels[level])
            }
        }
        // Spells
        this.spellAttribute = data.spellAttribute ?? SubclassData.properties.spellAttribute.value
        this.preparationAll = data.preparationAll ?? SubclassData.properties.preparationAll.value
        if (this.preparationAll) {
            this.preparationSlotsScaling = SubclassData.properties.preparationSlotsScaling.value
        } else {
            this.preparationSlotsScaling = data.preparationSlotsScaling ?? SubclassData.properties.preparationSlotsScaling.value
        }
        this.learnedAll = data.learnedAll ?? SubclassData.properties.learnedAll.value
        if (this.learnedAll) {
            this.learnedSlotsScaling = SubclassData.properties.learnedSlotsScaling.value
        } else {
            this.learnedSlotsScaling = data.learnedSlotsScaling ?? SubclassData.properties.learnedSlotsScaling.value
        }
    }

    public static properties: DataPropertyMap<ISubclassData, SubclassData> = {
        name: {
            value: '',
            validate: isString
        },
        description: {
            value: '',
            validate: isString
        },
        content: {
            value: '',
            validate: isString
        },
        parentFile: {
            value: null,
            validate: isObjectIdOrNull
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
        }
    }

    public createDescriptionContexts(elements: ElementDefinitions): [description: TokenContext] {
        const descriptionContext = {
            title: new EmptyToken(elements, this.name),
            name: new EmptyToken(elements, this.name)
        }
        return [descriptionContext]
    }

    public createContexts(elements: ElementDefinitions): [description: TokenContext, content: TokenContext] {
        const [descriptionContext] = this.createDescriptionContexts(elements)
        const contentContext: TokenContext = {
            ...descriptionContext,
            description: StoryScript.tokenize(elements, this.description, descriptionContext).root
        }
        return [descriptionContext, contentContext]
    }
}

export default SubclassData
