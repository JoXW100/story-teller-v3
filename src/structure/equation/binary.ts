import SymbolicExpression from '.'
import type { TokenContext } from 'types/language'

abstract class Binary extends SymbolicExpression {
    protected readonly lhs: SymbolicExpression
    protected readonly rhs: SymbolicExpression

    public constructor(lhs: SymbolicExpression, rhs: SymbolicExpression) {
        super()
        this.lhs = lhs
        this.rhs = rhs
    }
}

export class Addition extends Binary {
    public eval(environment: TokenContext): number {
        return this.lhs.eval(environment) + this.rhs.eval(environment)
    }
}

export class Subtraction extends Binary {
    public eval(environment: TokenContext): number {
        return this.lhs.eval(environment) - this.rhs.eval(environment)
    }
}

export class Multiplication extends Binary {
    public eval(environment: TokenContext): number {
        return this.lhs.eval(environment) * this.rhs.eval(environment)
    }
}

export class Division extends Binary {
    public eval(environment: TokenContext): number {
        return this.lhs.eval(environment) / this.rhs.eval(environment)
    }
}

export default Binary
