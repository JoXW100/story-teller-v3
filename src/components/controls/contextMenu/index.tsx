import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import ContextMenuItem from './menuItem'
import type { IPoint, ContextRowData, ContextMenuEvent, ContextEventDetails } from './types'
import styles from './style.module.scss'

interface ContextMenuState {
    show: boolean
    anchors: { left: number, top: number }
    content: ContextRowData[]
}

const getDepthHeight = (row: ContextRowData): { height: number, depth: number } => {
    return row.content?.reduce((pre, cur, index) => {
        if ('content' in cur && Array.isArray(cur.content)) {
            const { height, depth } = getDepthHeight(cur)
            return {
                height: Math.max(height + index, pre.height),
                depth: Math.max(1 + depth, pre.depth)
            }
        }
        return {
            height: Math.max(1 + index, pre.height),
            depth: pre.depth
        }
    }, { height: 0, depth: 1 }) ?? { height: 0, depth: 0 }
}

const ContextMenu: React.FC = () => {
    const router = useRouter()
    const [state, setState] = useState<ContextMenuState>({
        show: false,
        anchors: { left: 0, top: 9 },
        content: []
    })

    const clickHandler = useCallback(() => {
        if (state.show) {
            setState((state) => ({ ...state, show: false }))   
        }
    }, [state.show])

    const contextHandler = useCallback((ev: ContextMenuEvent) => {
        const detail = ev.detail
        const { depth, height } = getDepthHeight({
            text: 'empty',
            icon: null,
            content: detail.content
        } satisfies ContextRowData)
        const contentWidth = 240 * depth
        const contentHeight = 26 * height

        const top = detail.anchors.top + contentHeight - window.innerHeight
        if (top > 0) {
            detail.anchors.top -= top
        }
        const left = detail.anchors.left + contentWidth - window.innerWidth
        if (left > 0) {
            detail.anchors.left -= left
        }

        if (!state.show || detail.interrupt) {
            setState({
                show: detail.show,
                anchors: detail.anchors,
                content: detail.content ?? []
            })
        }
    }, [state.show])

    useEffect(() => {
        setState((state) => ({ ...state, show: false }))
    }, [router.route])

    useEffect(() => {
        window.addEventListener('click', clickHandler)
        window.addEventListener('scroll', clickHandler)
        window.addEventListener('contextmenu', clickHandler)
        document.addEventListener('contextMenu', contextHandler)

        return () => {
            window.removeEventListener('click', clickHandler)
            window.removeEventListener('scroll', clickHandler)
            window.removeEventListener('contextmenu', clickHandler)
            document.removeEventListener('contextMenu', contextHandler)
        }
    }, [state.show, contextHandler, clickHandler])

    return state.show
        ? (
            <div
                id={'contextMenu'}
                className={styles.main}
                style={state.anchors}>
                { state.content.map((data, index) =>
                    <ContextMenuItem key={index} data={data}/>
                )}
            </div>
        )
        : null
}

export const openContext = (content: ContextRowData[], point: IPoint, interrupt: boolean = true): void => {
    document.dispatchEvent(new CustomEvent<ContextEventDetails>('contextMenu', {
        bubbles: true,
        detail: {
            show: true,
            interrupt: interrupt,
            anchors: { left: point.x, top: point.y },
            content: content
        }
    }))
}

export default ContextMenu
export type {
    ContextMenuEvent
}
