import SymbolicExpression from ".";
import { TokenContext } from "types/language";

abstract class Command extends SymbolicExpression {
    public readonly args: readonly SymbolicExpression[]

    public constructor(args: readonly SymbolicExpression[]) {
        super()
        this.args = args
    }
}

export class CeilCommand extends Command {
    public eval(environment: TokenContext): number {
        return Math.ceil(this.args[0].eval(environment))
    }
}

export class FloorCommand extends Command {
    public eval(environment: TokenContext): number {
        return Math.floor(this.args[0].eval(environment))
    }
}

export class MaxCommand extends Command {
    public eval(environment: TokenContext): number {
        return Math.max(...this.args.map(arg => arg.eval(environment)))
    }
}

export class MinCommand extends Command {
    public eval(environment: TokenContext): number {
        return Math.max(...this.args.map(arg => arg.eval(environment)))
    }
}

export default Command;