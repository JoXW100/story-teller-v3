import { Element } from '.'

export type BoldElementParams = React.PropsWithChildren

class BoldElement extends Element<BoldElementParams> {
    public readonly name = 'bold'
    public readonly defaultParam = null
    public readonly params = {}
}

export default BoldElement
