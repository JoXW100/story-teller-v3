import { Element } from '.'
import { isCSSValueString } from 'utils'

export type LineElementParams = React.PropsWithoutRef<{
    width: string
}>

class LineElement extends Element<LineElementParams> {
    public static readonly Dots = new Set(['*', '-', '0'])
    public readonly name = 'line'
    public readonly defaultParam = 'width'
    public readonly params = {
        'width': {
            default: '2px',
            validate: isCSSValueString,
            parse: (value) => value
        }
    } satisfies Element<LineElementParams>['params']
}

export default LineElement
