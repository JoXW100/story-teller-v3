import type Tokenizer from '../tokenizer'
import Token from '.'
import CommandToken from './command'
import VariableToken from './variable'
import EquationToken from './equation'
import TextToken from './text'
import type { TokenContext } from 'types/language'

class BodyToken extends Token {
    private static readonly BreakExpr = /^\$\{|[\}\\\$]$/

    public constructor(startLineNumber?: number, startColumn?: number, context?: TokenContext) {
        super(startLineNumber, startColumn, { ...context })
    }

    public parse(tokenizer: Tokenizer, isRoot: boolean = false): void {
        let token = tokenizer.next(true)
        while (token !== null) {
            switch (token.content) {
                case '\}':
                    this.finalize(tokenizer)
                    return
                case '\\': {
                    const command = new CommandToken(tokenizer.elements, token.startLineNumber, token.startColumn, this.context)
                    command.parse(tokenizer)
                    this.children.push(command)
                    break
                }
                case '\$': {
                    const variable = new VariableToken(token.startLineNumber, token.startColumn, this.context)
                    variable.parse(tokenizer)
                    this.children.push(variable)
                    break
                }
                case '${': {
                    const equation = new EquationToken(token.startLineNumber, token.startColumn, this.context)
                    equation.parse(tokenizer)
                    this.children.push(equation)
                    break
                }
                default: {
                    tokenizer.back()
                    const text = new TextToken(BodyToken.BreakExpr, token.startLineNumber, token.startColumn, this.context)
                    text.parse(tokenizer)
                    this.children.push(text)
                    break
                }
            }
            token = tokenizer.next(true)
        }
        if (isRoot) {
            this.finalize(tokenizer)
        } else {
            this.finalize(tokenizer, "Unexpected end of text, missing body end symbol '}'")
        }
    }

    public build(): React.ReactNode {
        return this.children.map((token, index) => token.build(String(index)) as JSX.Element[])
    }
}

export default BodyToken
