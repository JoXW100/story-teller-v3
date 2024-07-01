import NewLineElement from 'structure/elements/newline'

const newline = new NewLineElement(({ key, ...params }) => <br key={key} {...params}/>)

export const element = {
    'n': newline,
    'newline': newline
}
