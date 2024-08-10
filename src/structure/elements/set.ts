import { Element } from '.'

export interface SetElementParams {
    name: string
}

class SetElement extends Element<SetElementParams> {
    public readonly name = 'set'
    public readonly defaultParam = 'name'
    public readonly params = {
        'name': {
            validate: (value) => value.length > 0,
            parse: (value) => value
        }
    } satisfies Element<SetElementParams>['params']
}

export default SetElement
