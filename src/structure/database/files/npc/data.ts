import { asEnum, isEnum, isString } from 'utils'
import type { TranslationHandler } from 'utils/hooks/localization'
import { Alignment, CreatureType, SizeType } from 'structure/dnd'
import EmptyToken from 'structure/language/tokens/empty'
import StoryScript from 'structure/language/storyscript'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { INPCData } from 'types/database/files/npc'
import type { TokenContext } from 'types/language'

class NPCData implements INPCData {
    public readonly name: string
    public readonly description: string
    public readonly content: string
    public readonly portrait: string
    // Info
    public readonly type: CreatureType
    public readonly size: SizeType
    public readonly alignment: Alignment
    // Appearance
    public readonly race: string
    public readonly gender: string
    public readonly age: string
    public readonly height: string
    public readonly weight: string

    public constructor(data: Simplify<INPCData>) {
        this.name = data.name ?? NPCData.properties.name.value
        this.description = data.description ?? NPCData.properties.description.value
        this.content = data.content ?? NPCData.properties.content.value
        this.portrait = data.portrait ?? NPCData.properties.portrait.value
        // Info
        this.type = asEnum(data.type, CreatureType, NPCData.properties.type.value)
        this.size = asEnum(data.alignment, SizeType, NPCData.properties.size.value)
        this.alignment = asEnum(data.alignment, Alignment, NPCData.properties.alignment.value)
        // Appearance
        this.race = data.race ?? NPCData.properties.race.value
        this.gender = data.gender ?? NPCData.properties.gender.value
        this.age = data.age ?? NPCData.properties.age.value
        this.height = data.height ?? NPCData.properties.height.value
        this.weight = data.weight ?? NPCData.properties.weight.value
    }

    public static properties: DataPropertyMap<INPCData, NPCData> = {
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
        portrait: {
            value: '',
            validate: isString
        },
        // Info
        type: {
            value: CreatureType.Humanoid,
            validate: (value) => isEnum(value, CreatureType)
        },
        size: {
            value: SizeType.Medium,
            validate: (value) => isEnum(value, SizeType)
        },
        alignment: {
            value: Alignment.Any,
            validate: (value) => isEnum(value, Alignment)
        },
        // Appearance
        race: {
            value: '',
            validate: isString
        },
        gender: {
            value: '',
            validate: isString
        },
        age: {
            value: '',
            validate: isString
        },
        height: {
            value: '',
            validate: isString
        },
        weight: {
            value: '',
            validate: isString
        }
    }

    public get namePlateText(): string {
        const texts: string[] = []
        const gender = this.gender
        const raceName = this.race
        if (gender.length > 0) {
            texts.push(gender)
        }
        if (raceName.length > 0) {
            texts.push(raceName)
        }
        return texts.join(' ')
    }

    public createDescriptionContexts(_elements: ElementDefinitions): [description: TokenContext] {
        const descriptionContext = {
            title: new EmptyToken(this.name),
            name: new EmptyToken(this.name)
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

    public getTypeText(translator: TranslationHandler): string {
        return translator(`enum-creatureType-${this.type}`)
    }

    public getSizeText(translator: TranslationHandler): string {
        return translator(`enum-size-${this.size}`)
    }

    public getAlignmentText(translator: TranslationHandler): string {
        return translator(`enum-alignment-${this.alignment}`)
    }
}

export default NPCData
