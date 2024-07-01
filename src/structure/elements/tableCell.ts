import { Element } from '.'

export type TableCellElementParams = React.PropsWithChildren<{
    color: string | null
}>

class TableCellElement extends Element<TableCellElementParams> {
    public readonly name = 'tableCell'
    public readonly defaultParam = 'color'
    public readonly params = {
        'color': {
            default: null,
            validate: () => true,
            parse: (value) => value
        }
    } satisfies Element<TableCellElementParams>['params']
}

export default TableCellElement
