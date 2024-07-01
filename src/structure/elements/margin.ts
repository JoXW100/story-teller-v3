import { Element } from '.'

export type MarginElementParams = React.PropsWithChildren<{
    margin: string
}>

class MarginElement extends Element<MarginElementParams> {
    public readonly name = 'margin'
    public readonly defaultParam = 'margin'
    public readonly params = {
        'margin': {
            default: '5px',
            validate: (value) => /^([0-9]*\.)?[0-9]+(px|cm|em|in|%|)$/.test(value.trim()),
            parse: (value) => value.trim()
        }
    } satisfies Element<MarginElementParams>['params']
}

export default MarginElement
