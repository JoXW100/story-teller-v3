import { Element } from '.'
import { isObjectId, isURLString } from 'utils'
import Navigation from 'utils/navigation'

export type LinkElementParams = React.PropsWithChildren<{
    href: URL
    newTab: boolean
}>

class LinkElement extends Element<LinkElementParams> {
    public readonly name = 'link'
    public readonly defaultParam = 'href'
    public readonly params = {
        'href': {
            validate: (value) => isObjectId(value) || isURLString(value),
            parse: (value) => isObjectId(value) ? Navigation.fileURL(value) : new URL(value)
        },
        'newTab': {
            default: false,
            validate: (value) => value === 'true' || value === 'false',
            parse: (value) => value === 'true'
        }
    } satisfies Element<LinkElementParams>['params']
}

export default LinkElement
