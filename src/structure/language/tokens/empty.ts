import Token from '.'
import type { editor } from 'monaco-editor'
import type { ElementDefinitions } from 'structure/elements/dictionary'

class EmptyToken extends Token {
    private readonly value: React.ReactNode

    public constructor(elements: ElementDefinitions, value: React.ReactNode = null) {
        super(elements, 0, 0)
        this.value = value
    }

    public parse(part: string, line: number, column: number, markers: editor.IMarkerData[]): boolean {
        return false
    }

    public build(id?: string | undefined): React.ReactNode {
        return this.value
    }
}

export default EmptyToken
