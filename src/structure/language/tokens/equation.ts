import type Tokenizer from '../tokenizer'
import Token from '.'
import { isNumeric } from 'utils'
import type SymbolicExpression from 'structure/equation'
import Constant from 'structure/equation/constant'
import Negation from 'structure/equation/negation'
import Variable from 'structure/equation/variable'
import { Division, Addition, Subtraction, Multiplication } from 'structure/equation/binary'

class EquationToken extends Token {
    private _equation: SymbolicExpression | null = null

    public get value(): number {
        return this._equation?.eval(this.context) ?? NaN
    }

    public get equation(): SymbolicExpression | null {
        return this._equation
    }

    public override get isEmpty(): boolean {
        return this._equation === null
    }

    public parse(tokenizer: Tokenizer): void {
        this._equation = this.parsePrimary(tokenizer)
    }

    private parsePrimary(tokenizer: Tokenizer): SymbolicExpression | null {
        const token = tokenizer.next(true)
        if (token === null) {
            this.finalize(tokenizer, 'Unexpected end of text')
            return null
        }

        switch (token.content) {
            case '\}':
            case '\)': {
                return null
            }
            case '\(': {
                const result = this.parsePrimary(tokenizer)
                if (tokenizer.token.content !== '\)') {
                    this.finalize(tokenizer, "Unbalanced parenthesis, expected ')'")
                    return null
                } else if (result === null) {
                    return null
                } else {
                    return this.parseOperator(tokenizer, result)
                }
            }
            case '\-': {
                const expr = this.parsePrimary(tokenizer)
                if (expr === null) {
                    return null
                } else {
                    return new Negation(expr)
                }
            }
            case '\$': {
                const nameToken = tokenizer.next()
                if (nameToken === null) {
                    return null
                } else if (!/^\w+$/i.test(nameToken.content)) {
                    tokenizer.addMarker(`Invalid variable name: '${nameToken.content}'`, token)
                    return null
                } else if (!(nameToken.content in this.context)) {
                    tokenizer.addMarker(`Undefined variable: '${nameToken.content}'`, token)
                    return null
                } else {
                    return this.parseOperator(tokenizer, new Variable(nameToken.content))
                }
            }
            default:
                if (!isNumeric(token.content)) {
                    tokenizer.addMarker(`Invalid value: ${token.content}`, token)
                    return null
                } else {
                    return this.parseOperator(tokenizer, new Constant(Number(token.content)))
                }
        }
    }

    private parseOperator(tokenizer: Tokenizer, lhs: SymbolicExpression): SymbolicExpression {
        const token = tokenizer.next(true)
        if (token === null) {
            return lhs
        }

        switch (token.content) {
            case '\}':
            case '\)': {
                return lhs
            }
            case '\/': {
                const rhs = this.parsePrimary(tokenizer)
                if (rhs === null) {
                    return lhs
                } else {
                    return new Division(lhs, rhs)
                }
            }
            case '\*': {
                const rhs = this.parsePrimary(tokenizer)
                if (rhs === null) {
                    return lhs
                } else {
                    return new Multiplication(lhs, rhs)
                }
            }
            case '\+': {
                const rhs = this.parsePrimary(tokenizer)
                if (rhs === null) {
                    return lhs
                } else {
                    return new Addition(lhs, rhs)
                }
            }
            case '\-': {
                const rhs = this.parsePrimary(tokenizer)
                if (rhs === null) {
                    return lhs
                } else {
                    return new Subtraction(lhs, rhs)
                }
            }
            default: {
                tokenizer.addMarker(`Unexpected symbol '${token.content}'`, token)
                return lhs
            }
        }
    }

    public build(): React.ReactNode {
        return String(this.value)
    }

    public override getText(): string | null {
        return this._equation !== null
            ? String(this._equation.eval(this.context))
            : null
    }
}

export default EquationToken
