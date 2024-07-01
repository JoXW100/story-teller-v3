import { Element } from '.'

export type RowElementParams = React.PropsWithChildren

class RowElement extends Element<RowElementParams> {
    public readonly name = 'row'
    public readonly defaultParam = null
    public readonly params = {}
}

export default RowElement
