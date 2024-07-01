import { Element } from '.'
import { isURLString } from 'utils'

export type ImageElementParams = React.PropsWithoutRef<{
    href: string
    border: boolean
    weight: string | number | null
    width: string | null
}>

class ImageElement extends Element<ImageElementParams> {
    public readonly name = 'image'
    public readonly defaultParam = 'href'
    public readonly params = {
        'href': {
            default: 'error',
            validate: (value) => isURLString(value),
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
    } satisfies Element<ImageElementParams>['params']
}

export default ImageElement
