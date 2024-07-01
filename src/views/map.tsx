import { useEffect, useRef, useState } from 'react'
import TokenIcon from '@mui/icons-material/AccountCircleSharp'
import { clamp, isObjectId } from 'utils'
import type { ObjectId } from 'types'
import styles from 'styles/pages/map.module.scss'

interface MapToken {
    id: ObjectId | string
    label: string
    layer: number
    width: number
    height: number
    x: number
    y: number
}

interface MapState {
    name: string
    width: number
    height: number
    gridSize: number
    tokens: MapToken[]
}

const defaultState: MapState = {
    name: 'Test',
    width: 16,
    height: 12,
    gridSize: 64,
    tokens: [
        {
            id: '1',
            label: 'Test 1',
            layer: 0,
            width: 64,
            height: 64,
            x: 0,
            y: 0
        },
        {
            id: '2',
            label: 'Test 2',
            layer: 0,
            width: 64,
            height: 64,
            x: 128,
            y: 64
        }
    ]
}

const MapComponent: React.FC = () => {
    const tokenLayer = useRef<HTMLDivElement>(null)
    const grid = useRef<HTMLCanvasElement>(null)
    const [state, setState] = useState<MapState>(defaultState)

    useEffect(() => {
        if (grid.current !== null) {
            grid.current.width = state.gridSize * state.width
            grid.current.height = state.gridSize * state.height
            const ctx = grid.current.getContext('2d')
            if (ctx !== null) {
                const hw = Number(grid.current.style.strokeWidth) / 2
                for (let x = 1; x < state.width; x++) {
                    const pos = x * state.gridSize - hw
                    ctx.moveTo(pos, 0)
                    ctx.lineTo(pos, grid.current.height)
                }
                for (let y = 1; y < state.width; y++) {
                    const pos = y * state.gridSize - hw
                    ctx.moveTo(0, pos)
                    ctx.lineTo(grid.current.width, pos)
                }
                ctx.stroke()
            }
        }
    }, [state.width, state.height, state.gridSize])

    const onDragOverHandler: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }

    const onDragLeaveHandler: React.DragEventHandler<HTMLDivElement> = (e) => {
    }

    const onDropHandler: React.DragEventHandler<HTMLDivElement> = (e) => {
        const id = e.dataTransfer.getData('text/plain')

        if (!isObjectId(id)) {
            return state
        }

        setState((state) => {
            const tokenIndex = state.tokens.findIndex(x => x.id === id)
            if (tokenIndex === -1) {
                return state
            }

            const token = state.tokens[tokenIndex]
            let x = e.clientX - (tokenLayer.current?.offsetLeft ?? 0) - (token.width / 2)
            let y = e.clientY - (tokenLayer.current?.offsetTop ?? 0) - (token.height / 2)

            if (!e.shiftKey) {
                x = x - x % state.gridSize
                y = y - y % state.gridSize
            }

            x = clamp(x, 0, (state.width - 1) * state.gridSize)
            y = clamp(y, 0, (state.height - 1) * state.gridSize)

            return {
                ...state,
                tokens: [
                    ...state.tokens.slice(0, tokenIndex),
                    { ...token, x: x, y: y },
                    ...state.tokens.slice(tokenIndex + 1)
                ]
            }
        })
    }

    return (
        <div
            className={styles.map}
            onDragOver={onDragOverHandler}
            onDragLeaveCapture={onDragLeaveHandler}
            onDrop={onDropHandler}>
            <canvas ref={grid}/>
            <div ref={tokenLayer} className={styles.layer}>
                { state.tokens.map((token) => (
                    <Token key={token.id} token={token}/>
                ))}
            </div>
        </div>
    )
}

const Token: React.FC<{ token: MapToken }> = ({ token }) => {
    const onDragStartHandler: React.DragEventHandler<HTMLDivElement> = (e) => {
        e.dataTransfer.setData('text/plain', token.id)
    }

    return (
        <div
            className={styles.token}
            draggable={true}
            onDragStart={onDragStartHandler}
            style={{
                left: token.x + 'px',
                top: token.y + 'px',
                width: token.width + 'px',
                height: token.height + 'px'
            }}>
            <TokenIcon/>
            <label>
                {token.label}
            </label>
        </div>
    )
}

export default MapComponent
