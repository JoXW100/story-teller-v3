import type { Monaco } from '@monaco-editor/react'
import { type editor, type languages, type Position as IPosition, type IMarkdownString } from 'monaco-editor'

export type MonacoType = Monaco
export type MonacoEditor = editor.IStandaloneCodeEditor
export type MonacoModel = editor.ITextModel
export type MarkerData = editor.IMarkerData
export type CompletionItem = languages.CompletionItem
export type MarkdownString = IMarkdownString
export type TokenContext = Record<string, IToken | null>
export type Position = IPosition
export type CompletionItemProvider = languages.CompletionItemProvider
export type HoverProvider = languages.HoverProvider

export interface TokenizedResult {
    root: IToken
    markers: MarkerData[]
}

export interface IToken {
    readonly isEmpty: boolean
    readonly consumePart: boolean
    readonly lineStart: number
    readonly lineEnd: number
    readonly columnStart: number
    readonly columnEnd: number
    readonly subTokens: IToken[]

    readonly parse: (part: string, line: number, column: number, markers: editor.IMarkerData[]) => boolean
    readonly build: (id?: string) => React.ReactNode
    readonly complete: (line: number, column: number, markers: editor.IMarkerData[]) => IToken
    readonly findTokenAt: (position: Position) => IToken[]
    readonly getHoverText: (model: editor.ITextModel) => MarkdownString[]
    readonly getCompletion: (monaco: MonacoType) => CompletionItem[]
}
