import { Element } from '.'
import type CommandToken from 'structure/language/tokens/command'

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

    public override init(token: CommandToken): void {
        const params = token.params
        if (params !== null) {
            const value = params.value
            if (this.defaultParam in value) {
                token.context[value[this.defaultParam]] = token.body
            }
        }
    }
}

export default SetElement
