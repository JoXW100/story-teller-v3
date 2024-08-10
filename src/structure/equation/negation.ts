import SymbolicExpression from '.'
import type { TokenContext } from 'types/language'

class Negation extends SymbolicExpression {
    public readonly expr: SymbolicExpression

    public constructor(expr: SymbolicExpression) {
        super()
        this.expr = expr
    }

    public eval(environment: TokenContext): number {
        return -this.expr.eval(environment)
    }
}

export default Negation
