import { Element } from '.'

export type ItemElementParams = React.PropsWithChildren<{
    dot: string
}>

class ItemElement extends Element<ItemElementParams> {
    public static readonly Dots = new Set(['*', '-', '0'])
    public readonly name = 'item'
    public readonly defaultParam = 'dot'
    public readonly params = {
        'dot': {
            default: '*',
            validate: (value) => ItemElement.Dots.has(value),
            parse: (value) => value
        }
    } satisfies Element<ItemElementParams>['params']
}

export default ItemElement
