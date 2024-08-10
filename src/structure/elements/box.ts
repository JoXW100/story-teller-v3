import { isCSSValueString, isFloatString } from 'utils'
import { Element } from '.'

export type BoxElementParams = React.PropsWithChildren<{
    color: string | null
    border: boolean
    weight: string | number | null
    width: string | null
}>

class BoxElement extends Element<BoxElementParams> {
    public readonly name = 'box'
    public readonly defaultParam = 'color'
    public readonly params = {
        'color': {
            default: null,
            validate: () => true,
            parse: (value) => value
        },
        'border': {
            default: false,
            validate: (value) => value === 'true' || value === 'false',
            parse: (value) => value === 'true'
        },
        'weight': {
            default: null,
            validate: isFloatString,
            parse: (value) => value
        },
        'width': {
            default: null,
            validate: isCSSValueString,
            parse: (value) => value
        }
    } satisfies Element<BoxElementParams>['params']
}

export default BoxElement
