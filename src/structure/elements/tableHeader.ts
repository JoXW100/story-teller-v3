import { Element } from '.'

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
            validate: (value) => /^([0-9]*\.)?[0-9]+(px|cm|em|in|%|)$/.test(value.trim()),
            parse: (value) => value.trim()
        },
        'color': {
            default: null,
            validate: () => true,
            parse: (value) => value
        }
    } satisfies Element<TableHeaderElementParams>['params']
}

export default TableHeaderElement
