import { Element } from '.'
import { isCSSValueString } from 'utils'

export type MarginElementParams = React.PropsWithChildren<{
    margin: string
}>

class MarginElement extends Element<MarginElementParams> {
    public readonly name = 'margin'
    public readonly defaultParam = 'margin'
    public readonly params = {
        'margin': {
            default: '5px',
            validate: isCSSValueString,
            parse: (value) => value
        }
    } satisfies Element<MarginElementParams>['params']
}

export default MarginElement
