import TextElement from 'structure/elements/text'

export const element = {
    'text': new TextElement(({ key, ...params }) => <span key={key} {...params}/>)
}
