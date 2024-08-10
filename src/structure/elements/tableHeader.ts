import { Element } from '.'
import { isCSSValueString } from 'utils'

export type TableHeaderElementParams = React.PropsWithChildren<{
    color: string | null
    width: string | null
}>

class TableHeaderElement extends Element<TableHeaderElementParams> {
    public readonly name = 'tableHeader'
    public readonly defaultParam = 'color'
    public readonly params = {
        'width': {
            default: null,
            validate: isCSSValueString,
            parse: (value) => value
        },
        'color': {
            default: null,
            validate: () => true,
            parse: (value) => value
        }
    } satisfies Element<TableHeaderElementParams>['params']
}

export default TableHeaderElement
