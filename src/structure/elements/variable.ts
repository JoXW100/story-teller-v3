import { Element } from '.'

export interface VariableElementParams {
    name: string
    fallback: string | null
    format: string | null
}

class VariableElement extends Element<VariableElementParams> {
    public readonly name = 'variable'
    public readonly defaultParam = 'name'
    public readonly params = {
        'name': {
            validate: (value) => value.length > 0,
            parse: (value) => value.trim()
        },
        'fallback': {
            default: null,
            validate: () => true,
            parse: (value) => value
        },
        'format': {
            default: null,
            validate: (value) => value === null || value.includes('@'),
            parse: (value) => value
        }
    } satisfies Element<VariableElementParams>['params']
}

export default VariableElement
