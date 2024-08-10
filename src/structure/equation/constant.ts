import SymbolicExpression from '.'
import type { TokenContext } from 'types/language'

class Constant extends SymbolicExpression {
    private readonly value: number

    public constructor(value: number) {
        super()
        this.value = value
    }

    public eval(environment: TokenContext): number {
        return this.value
    }
}

export default Constant
