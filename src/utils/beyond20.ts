import { RollType, type IRollContext, type IDiceRoll, type DieType, type IDiceTypeValuePair, numberFromDieType, RollMethodType, isFail, isCritical } from 'structure/dice'
import { keysOf } from 'utils'

type MessageType = 'rendered-roll' | 'hp-update'
export enum WhisperType {
    NO = 0,
    YES = 1,
    QUERY = 2,
    HIDE_NAMES = 3
}
type RequestType = 'chat-message' | 'skill' | 'ability' | 'saving-throw' | 'initiative' | 'initiative-tracker' | 'hit-dice' | 'item' | 'trait' | 'death-save' | 'attack' | 'spell-card' | 'spell-attack' | 'chat-message' | 'roll-table' | 'avatar'

interface Beyond20Dice {
    amount: number
    faces: number
    formula: string
    modifiers?: string
    rolls: Array<{ roll: number }>
    total: number
}

interface Beyond20Roll {
    total?: number
    discarded?: boolean
    formula?: string
    parts?: Array<Beyond20Dice | number | string>
    'critical-success'?: boolean
    'critical-failure'?: boolean
}

interface Beyond20RollRequest {
    action: MessageType
    request?: {
        type: RequestType
        action?: string
        damages?: unknown[]
        rollAttack?: boolean
        rollDamage?: boolean
        sendMessage?: boolean
        range?: string
        'save-dc'?: string
        'save-ability'?: string
        'cast-at'?: string[]
        components?: string
        'to-hit'?: string
        advantage?: number
        initiative?: string
        character?: {
            name?: string
            type?: string
            settings?: {
                'custom-roll-dice': string
            }
        }
    }
    character?: string | {
        name?: string
        hp?: number
        'max-hp'?: number
        'temp-hp'?: number
    }
    title?: string
    source?: string
    attributes?: Record<string, any>
    open?: boolean
    description?: string
    roll_info?: Array<[name: string, value: any]>
    attack_rolls?: Beyond20Roll[]
    damage_rolls?: Array<[name: string, roll: Beyond20Roll, flag?: number]>
    total_damages?: Record<string, Beyond20Roll>
    play_sound?: boolean
    whisper?: WhisperType
}
const interleave = <T>(arr: T[], x: T): T[] => arr.flatMap(e => [e, x]).slice(0, -1)

abstract class Beyond20 {
    private static readonly EventId = 'Beyond20_SendMessage'
    private static whisper: WhisperType

    public static initialize (whisper: WhisperType = WhisperType.NO): void {
        this.whisper = whisper
    }

    public static sendRoll (roll: IRollContext): void {
        switch (roll.type) {
            case RollType.Attack:
            { this.sendAttackRoll(roll); return }
            case RollType.Damage:
            { this.sendDamageRoll(roll); return }
            case RollType.Initiative:
            { this.sendInitiativeRoll(roll); return }
            case RollType.Health:
            case RollType.Check:
            case RollType.Save:
            default:
            { this.sendAttackRoll(roll) }
        }
    }

    private static getParts(roll: IDiceRoll): Beyond20Dice[] {
        const parts: Partial<Record<DieType, IDiceTypeValuePair[]>> = {}
        for (const die of roll.rolls) {
            if (die.type in parts) {
                parts[die.type]!.push(die)
            } else {
                parts[die.type] = [die]
            }
        }

        return keysOf(parts).map<Beyond20Dice>(type => {
            const result = parts[type]!
            const num = result.length
            return {
                amount: num,
                total: result.reduce((sum, x) => sum + x.value, 0),
                faces: numberFromDieType(type),
                formula: `${num}${type}`,
                rolls: result.map(x => ({ roll: x.value }))
            }
        })
    }

    public static sendAttackRoll (roll: IRollContext): void {
        this.sendMessage({
            action: 'rendered-roll',
            request: { type: 'attack' },
            title: roll.description,
            character: roll.source ?? roll.result.dice.stringify(),
            attack_rolls: roll.result.rolls.map((res, index) => ({
                total: res.sum,
                discarded: roll.result.selected !== index,
                parts: [interleave<Beyond20Dice | number | string>(this.getParts(res), '+'), res.modifier !== 0 ? [res.modifier > 0 ? '+' : '-', Math.abs(res.modifier)] : []].flat(),
                formula: roll.result.dice.stringify()
            })),
            damage_rolls: [],
            total_damages: {},
            whisper: this.whisper
        } satisfies Beyond20RollRequest)
    }

    public static sendDamageRoll (roll: IRollContext): void {
        this.sendMessage({
            action: 'rendered-roll',
            request: { type: 'attack' },
            title: roll.description,
            character: roll.source ?? roll.result.dice.stringify(),
            attack_rolls: [],
            damage_rolls: roll.result.rolls.map((res, index) => (
                [roll.details ?? '', {
                    'critical-success': isCritical(res, roll.critRange ?? 20),
                    'critical-failure': isFail(res),
                    discarded: roll.result.selected !== index,
                    total: res.sum + res.modifier,
                    parts: [interleave<Beyond20Dice | number | string>(this.getParts(res), '+'), res.modifier !== 0 ? [res.modifier > 0 ? '+' : '-', Math.abs(res.modifier)] : []].flat(),
                    formula: roll.result.dice.stringify()
                } satisfies Beyond20Roll, 1]
            )),
            total_damages: {},
            whisper: this.whisper
        } satisfies Beyond20RollRequest)
    }

    public static sendInitiativeRoll (roll: IRollContext): void {
        const modifier = roll.result.rolls[roll.result.selected].modifier
        this.sendMessage({
            action: 'rendered-roll',
            request: {
                type: 'initiative',
                advantage: roll.method === RollMethodType.BestOfTwo ? 1 : 0,
                initiative: (modifier >= 0 ? '+' : '-') + Math.abs(modifier),
                sendMessage: true
            },
            title: `${roll.description}${modifier !== 0 ? ` (${modifier > 0 ? '+' : '-'}${Math.abs(modifier)})` : ''}`,
            character: roll.source ?? roll.result.dice.stringify(),
            attack_rolls: roll.result.rolls.map((res, index) => ({
                total: res.sum,
                discarded: roll.result.selected !== index,
                parts: [interleave<Beyond20Dice | number | string>(this.getParts(res), '+'), modifier !== 0 ? [modifier > 0 ? '+' : '-', Math.abs(modifier)] : []].flat(),
                formula: roll.result.dice.stringify()
            })),
            damage_rolls: [],
            total_damages: {},
            whisper: this.whisper
        } satisfies Beyond20RollRequest)
    }

    public static sendHealthUpdate (name: string, hp: number, maxHp: number, tempHp: number): void {
        this.sendMessage({
            action: 'hp-update',
            character: {
                name: name,
                hp: hp,
                'max-hp': maxHp,
                'temp-hp': tempHp
            }
        } satisfies Beyond20RollRequest)
    }

    private static sendMessage (message: Beyond20RollRequest): void {
        const event = new CustomEvent(this.EventId, { detail: [message] })
        document.dispatchEvent(event)
    }
}

export default Beyond20
