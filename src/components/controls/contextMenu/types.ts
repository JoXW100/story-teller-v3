import type { LanguageKey } from 'assets'
import type React from 'react'

export type ContextMenuEvent = CustomEvent<ContextEventDetails>

export interface Point {
    x: number
    y: number
}

export interface ContextRowData {
    text: LanguageKey
    icon: React.ReactNode
    id?: string
    enabled?: boolean
    action?: React.MouseEventHandler
    content?: ContextRowData[]
}

export interface ContextEventDetails {
    show: boolean
    interrupt: boolean
    anchors: { left: number, top: number }
    content?: ContextRowData[]
}
