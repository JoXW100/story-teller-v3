import { Element } from '.'
import { isURLString, isFloatString, isCSSValueString } from 'utils'

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
            validate: isFloatString,
            parse: (value) => value
        },
        'width': {
            default: null,
            validate: isCSSValueString,
            parse: (value) => value
        }
    } satisfies Element<ImageElementParams>['params']
}

export default ImageElement
