import { isCSSValueString, isFloatString } from 'utils'
import { Element } from '.'

export type BlockElementParams = React.PropsWithChildren<{
    weight: string | number | null
    width: string | null
}>

class BlockElement extends Element<BlockElementParams> {
    public readonly name = 'block'
    public readonly defaultParam = 'width'
    public readonly params = {
        'weight': {
            default: '1',
            validate: isFloatString,
            parse: (value) => value
        },
        'width': {
            default: null,
            validate: isCSSValueString,
            parse: (value) => value
        }
    } satisfies Element<BlockElementParams>['params']
}

export default BlockElement
