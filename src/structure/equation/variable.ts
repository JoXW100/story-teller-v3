import SymbolicExpression from '.'
import EmptyToken from 'structure/language/tokens/empty'
import TextToken from 'structure/language/tokens/text'
import type { TokenContext } from 'types/language'

class Variable extends SymbolicExpression {
    private readonly name: string

    public constructor(name: string) {
        super()
        this.name = name
    }

    public eval(environment: TokenContext): number {
        const value = environment[this.name]
        if (value instanceof EmptyToken || value instanceof TextToken) {
            return Number(value.value)
        }
        return NaN
    }
}

export default Variable
