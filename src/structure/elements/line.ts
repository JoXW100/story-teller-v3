import { Element } from '.'

export type LineElementParams = React.PropsWithoutRef<{
    width: string
}>

class LineElement extends Element<LineElementParams> {
    public static readonly Dots = new Set(['*', '-', '0'])
    public readonly name = 'line'
    public readonly defaultParam = 'width'
    public readonly params = {
        'width': {
            default: '2px',
            validate: (value) => /^([0-9]*\.)?[0-9]+(px|cm|em|in|%|)$/.test(value.trim()),
            parse: (value) => value
        }
    } satisfies Element<LineElementParams>['params']
}

export default LineElement
