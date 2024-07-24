import { asNumber, isNumber, isObjectId, isRecord, isString, keysOf } from 'utils'
import EmptyToken from 'structure/language/tokens/empty'
import { simplifyNumberRecord } from 'structure/database'
import type { ElementDefinitions } from 'structure/elements/dictionary'
import type { ObjectId, Simplify } from 'types'
import type { DataPropertyMap } from 'types/database'
import type { IEncounterData } from 'types/database/files/encounter'
import type { TokenContext } from 'types/language'

class EncounterData implements IEncounterData {
    public readonly name: string
    public readonly description: string
    public readonly challenge: number
    public readonly xp: number
    public readonly creatures: Record<ObjectId, number>

    public constructor(data: Simplify<IEncounterData>) {
        this.name = data.name ?? EncounterData.properties.name.value
        this.description = data.description ?? EncounterData.properties.description.value
        this.challenge = data.challenge ?? EncounterData.properties.challenge.value
        this.xp = data.xp ?? EncounterData.properties.xp.value
        this.creatures = EncounterData.properties.creatures.value
        if (data.creatures !== undefined) {
            for (const id of keysOf(data.creatures)) {
                if (isObjectId(id)) {
                    this.creatures[id] = asNumber(data.creatures[id], 1)
                }
            }
        }
    }

    public get challengeText(): string {
        const fraction: string = this.challenge > 0
            ? (this.challenge < 1
                ? `1/${Math.floor(1 / this.challenge)}`
                : String(this.challenge))
            : '0'
        return `${fraction} (${this.xp} XP)`
    }

    public static properties: DataPropertyMap<IEncounterData, EncounterData> = {
        name: {
            value: '',
            validate: isString
        },
        description: {
            value: '',
            validate: isString
        },
        creatures: {
            get value() { return {} },
            validate: (value) => isRecord(value, (key, val) => isObjectId(key) && isNumber(val)),
            simplify: simplifyNumberRecord
        },
        challenge: {
            value: 0,
            validate: isNumber
        },
        xp: {
            value: 0,
            validate: isNumber
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

export default EncounterData