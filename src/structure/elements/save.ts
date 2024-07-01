import { Element } from '.'

export type SaveElementParams = React.PropsWithChildren<{
    value: number
    type: string | null
    tooltips: string | null
}>

class SaveElement extends Element<SaveElementParams> {
    public readonly name = 'save'
    public readonly defaultParam = 'value'
    public readonly params = {
        'value': {
            default: 0,
            validate: (value) => /^[0-9]+$/.test(value),
            parse: (value) => parseInt(value)
        },
        'type': {
            default: null,
            validate: () => true,
            parse: (value) => value
        },
        'tooltips': {
            default: null,
            validate: () => true,
            parse: (value) => value
        }
    } satisfies Element<SaveElementParams>['params']
}

export default SaveElement
