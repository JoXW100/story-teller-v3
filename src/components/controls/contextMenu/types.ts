import type { LanguageKey } from 'assets'
import type React from 'react'

export type ContextMenuEvent = CustomEvent<ContextEventDetails>

export interface IPoint {
    x: number
    y: number
}

export interface ContextRowData {
    text: LanguageKey
    icon: React.ReactNode
    id?: string
    hide?: boolean
    disabled?: boolean
    action?: React.MouseEventHandler
    content?: ContextRowData[]
}

export interface ContextEventDetails {
    show: boolean
    interrupt: boolean
    anchors: { left: number, top: number }
    content?: ContextRowData[]
}
