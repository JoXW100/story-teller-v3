import { Element } from '.'

export type HeaderElementParams = React.PropsWithChildren<{
    underline: boolean
}>

class HeaderElement extends Element<HeaderElementParams> {
    public readonly name = 'header'
    public readonly defaultParam = 'underline'
    public readonly params = {
        'underline': {
            default: false,
            validate: (value) => value === 'true' || value === 'false',
            parse: (value) => value === 'true'
        }
    } satisfies Element<HeaderElementParams>['params']
}

export default HeaderElement
