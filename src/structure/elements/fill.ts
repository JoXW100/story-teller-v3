import { Element } from '.'

export type FillElementParams = React.PropsWithChildren

class FillElement extends Element<FillElementParams> {
    public readonly name = 'bold'
    public readonly defaultParam = null
    public readonly params = {}
}

export default FillElement
