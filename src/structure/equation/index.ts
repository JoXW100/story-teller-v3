import type { TokenContext } from 'types/language'

abstract class SymbolicExpression {
    public abstract eval(environment: TokenContext): number
}

export default SymbolicExpression
