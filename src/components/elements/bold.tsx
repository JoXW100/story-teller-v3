import BoldElement from 'structure/elements/bold'

const bold = new BoldElement(({ key, ...props }) => (<b key={key} {...props}/>))

export const element = {
    'bold': bold,
    'b': bold
}
