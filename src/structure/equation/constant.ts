import SymbolicExpression from '.'
import type { TokenContext } from 'types/language'

class Constant extends SymbolicExpression {
    public readonly value: number

    public constructor(value: number) {
        super()
        this.value = value
    }

    public eval(_environment: TokenContext): number {
        return this.value
    }
}

export default Constant
