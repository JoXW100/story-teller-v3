import { Element } from '.'

export type BoxElementParams = React.PropsWithChildren<{
    color: string | null
    border: boolean
    weight: string | number | null
    width: string | null
}>

class BoxElement extends Element<BoxElementParams> {
    public readonly name = 'box'
    public readonly defaultParam = 'color'
    public readonly params = {
        'color': {
            default: null,
            validate: () => true,
            parse: (value) => value
        },
        'border': {
            default: false,
            validate: (value) => value === 'true' || value === 'false',
            parse: (value) => value === 'true'
        },
        'weight': {
            default: null,
            validate: (value) => /^([0-9]*\.)?[0-9]+$/.test(value.trim()),
            parse: (value) => value
        },
        'width': {
            default: null,
            validate: (value) => /^([0-9]*\.)?[0-9]+(px|cm|em|in|%|)$/.test(value.trim()),
            parse: (value) => value.trim()
        }
    } satisfies Element<BoxElementParams>['params']
}

export default BoxElement
