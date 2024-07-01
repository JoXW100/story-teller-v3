import React, { useEffect, useRef, useState } from 'react'
import styles from './style.module.scss'

type DividerProps = React.PropsWithRef<{
    className?: string
    leftClassName?: string
    rightClassName?: string
    left: React.ReactNode
    right: React.ReactNode
    defaultSlider?: number
    minLeft?: string
    minRight?: string
    collapsed?: boolean
    collapsedLeft?: React.ReactNode
    collapsedRight?: React.ReactNode
}>

const Divider = ({ className, leftClassName, rightClassName, left, right, defaultSlider = 0.5, minLeft = '0px', minRight = '0px', collapsed = false, collapsedLeft = null, collapsedRight = null }: DividerProps): JSX.Element => {
    const [state, setState] = useState({ dragging: false, position: defaultSlider })
    const ref = useRef<HTMLDivElement>(null)

    const dragStart = (e: React.UIEvent<HTMLDivElement>): void => {
        setState((state) => ({ ...state, dragging: true }))
        e.preventDefault()
    }

    useEffect(() => {
        const dragEnd = (): void => {
            setState((state) => ({ ...state, dragging: false }))
        }

        const mouseDrag = (e: MouseEvent): void => {
            const rect = ref.current?.parentElement?.getBoundingClientRect()
            if (rect !== undefined && e.pageX !== 0) {
                setState((state) => ({ ...state, position: (e.clientX - rect.left) / rect.width }))
            }
        }

        const touchDrag = (e: TouchEvent): void => {
            const touch = e.touches[0] ?? null
            const rect = ref.current?.parentElement?.getBoundingClientRect()
            if (touch !== null && rect !== undefined) {
                setState((state) => ({ ...state, position: (touch.pageX - rect.left) / rect.width }))
            }
        }

        if (state.dragging) {
            document.addEventListener('mouseup', dragEnd)
            document.addEventListener('mousemove', mouseDrag)
            document.addEventListener('touchend', dragEnd)
            document.addEventListener('touchmove', touchDrag)
        }

        return () => {
            document.removeEventListener('mouseup', dragEnd)
            document.removeEventListener('mousemove', mouseDrag)
            document.removeEventListener('touchend', dragEnd)
            document.removeEventListener('touchmove', touchDrag)
        }
    }, [state.dragging])

    const name = className !== undefined ? styles.main + ' ' + className : styles.main
    const sizeLeft = `clamp(${minLeft}, ${state.position * 100}%, 100% - ${minRight})`
    const sizeRight = `clamp(${minRight}, ${(1 - state.position) * 100}%, 100% - ${minLeft})`

    return (
        <div className={name}>
            { !collapsed && <div ref={ref} className={styles.divider} onMouseDown={dragStart} onTouchStart={dragStart} style={{ left: sizeLeft }}/> }
            { collapsed && collapsedLeft !== null
                ? collapsedLeft
                : <div className={leftClassName !== undefined ? `${styles.side} ${leftClassName}` : styles.side} style={{ left: 0, width: sizeLeft }}>
                    { left }
                </div>
            }
            { collapsed && collapsedRight !== null
                ? collapsedRight
                : <div className={rightClassName !== undefined ? `${styles.side} ${rightClassName}` : styles.side} style={{ right: 0, width: sizeRight }}>
                    { right }
                </div>
            }
        </div>
    )
}

export default Divider
