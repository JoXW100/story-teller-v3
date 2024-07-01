import 'react'
import type { ContextEventDetails } from 'components/layouts/contextMenu/types'
import type { DialogDetails } from './dialog'
import type { IFileStructure } from './database'
import type { BooleanString } from 'types'

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export interface HTMLAttributes<T> {
        disabled?: boolean
        error?: BooleanString
        data?: string
        value?: string
    }
}

export interface DragData {
    file?: IFileStructure | null
    target?: unknown | null
    value?: unknown
}

interface CustomEventMap extends DocumentEventMap {
    'dialog': CustomEvent<DialogDetails>
    'contextMenu': CustomEvent<ContextEventDetails>
}

/* eslint-disable @typescript-eslint/method-signature-style */
declare global {
    interface Document {
        addEventListener<K extends keyof CustomEventMap>(type: K, listener: (this: Document, ev: CustomEventMap[K]) => void): void
        removeEventListener<K extends keyof CustomEventMap>(type: K, listener: (this: Document, ev: CustomEventMap[K]) => void): void
        dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): void
    }

    interface Window {
        dragData: DragData
    }
}
