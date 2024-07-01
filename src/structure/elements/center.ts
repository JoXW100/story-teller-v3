import { Element } from '.'

export type CenterElementParams = React.PropsWithChildren

class CenterElement extends Element<CenterElementParams> {
    public readonly name = 'center'
    public readonly defaultParam = null
    public readonly params = {}
}

export default CenterElement
