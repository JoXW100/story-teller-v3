import { Element } from '.'
import { isEnum } from 'utils'
import { RollMethodType, RollType } from 'structure/dice'
import DiceFactory from 'structure/dice/factory'

export type RollElementParams = React.PropsWithChildren<{
    dice: string
    critRange: number
    mode: RollMethodType
    type: RollType
    desc: string
    details: string | null
    tooltips: React.ReactNode | null
}>

class RollElement extends Element<RollElementParams> {
    public static readonly simplifyDiceMatcher = /^ *[+-]? *[0-9]+$/
    public readonly name = 'roll'
    public readonly defaultParam = 'dice'
    public readonly params = {
        'dice': {
            validate: (value) => DiceFactory.test(value),
            parse: (value) => value
        },
        'type': {
            default: RollType.General,
            validate: (value) => isEnum(value, RollType),
            parse: (value) => value as RollType
        },
        'critRange': {
            default: 20,
            validate: (value) => /^[0-9]+$/.test(value),
            parse: (value) => parseInt(value)
        },
        'mode': {
            default: RollMethodType.Normal,
            validate: (value) => isEnum(value, RollMethodType),
            parse: (value) => value as RollMethodType
        },
        'desc': {
            default: 'Rolled',
            validate: () => true,
            parse: (value) => value
        },
        'details': {
            default: null,
            validate: () => true,
            parse: (value) => value
        },
        'tooltips': {
            default: null,
            validate: () => true,
            parse: (value) => value
        }
    } satisfies Element<RollElementParams>['params']
}

export default RollElement
