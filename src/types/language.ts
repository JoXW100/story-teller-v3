import type { Monaco } from '@monaco-editor/react'
import type { editor, languages, Position as IPosition, IMarkdownString, IDisposable } from 'monaco-editor'
import type Tokenizer from 'structure/language/tokenizer'

export type MonacoType = Monaco
export type MonacoEditor = editor.IStandaloneCodeEditor
export type MonacoModel = editor.ITextModel
export type MarkerData = editor.IMarkerData
export type MonacoDisposable = IDisposable
export type CompletionItem = languages.CompletionItem
export type MarkdownString = IMarkdownString
export type TokenContext = Record<string, IToken | null>
export type Position = IPosition
export type MonarchLanguage = languages.IMonarchLanguage
export type CompletionItemProvider = languages.CompletionItemProvider
export type HoverProvider = languages.HoverProvider

export interface IToken {
    readonly isEmpty: boolean
    readonly startLineNumber: number
    readonly endLineNumber: number
    readonly startColumn: number
    readonly endColumn: number
    readonly children: IToken[]

    readonly parse: (tokenizer: Tokenizer) => void
    readonly build: (key?: string) => React.ReactNode
    readonly findTokenAt: (position: Position) => IToken[]
    readonly getHoverText: (model: MonacoModel) => MarkdownString[]
    readonly getCompletion: (monaco: MonacoType) => CompletionItem[]
    readonly getText: () => string | null
}

export interface ITokenizedResult {
    root: IToken
    markers: readonly MarkerData[]
}

export interface ITokenData {
    readonly startLineNumber: number
    readonly endLineNumber: number
    readonly startColumn: number
    readonly endColumn: number
    readonly content: string
}
