import { Element } from '.'

export type TextElementParams = React.PropsWithChildren

class TextElement extends Element<TextElementParams> {
    public readonly name = 'text'
    public readonly defaultParam = null
    public readonly params = {}
}

export default TextElement
