import { useState } from 'react'
import { Tooltip } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import EditIcon from '@mui/icons-material/EditSharp'
import CollapseIcon from '@mui/icons-material/CloseFullscreenSharp'
import ExpandIcon from '@mui/icons-material/OpenInFullSharp'
import { openContext } from '../contextMenu'
import LocalizedText from 'components/localizedText'
import { type ContextRowData } from '../contextMenu/types'
import { type DragData } from 'types/dom'
import styles from './style.module.scss'

type CollapsibleGroupProps = React.PropsWithChildren<{
    header: React.ReactNode
    open?: boolean
    onChange?: (value: string) => void
    onRemove?: () => void
    onDrag?: (data: DragData) => boolean
    onDrop?: (data: DragData) => void
}>

const CollapsibleGroup = ({ header, open = true, onChange, onRemove, onDrag, onDrop, children }: CollapsibleGroupProps): JSX.Element => {
    const [state, setState] = useState({
        isOpen: open,
        isEdit: false,
        highlight: false,
        header: String(header)
    })

    const tooltipsId = state.isOpen
        ? 'common-collapse'
        : 'common-expand'

    const handleContextMenu: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const options: ContextRowData[] = [{
            text: tooltipsId,
            icon: state.isOpen
                ? <CollapseIcon/>
                : <ExpandIcon/>,
            action: () => { setState((state) => ({ ...state, isOpen: !state.isOpen })) }
        }]

        if (onChange !== undefined) {
            options.push({
                text: 'common-rename',
                icon: <EditIcon/>,
                action: () => { setState((state) => ({ ...state, isEdit: !state.isEdit })) }
            })
        }

        if (onRemove !== undefined) {
            options.push({
                text: 'common-delete',
                icon: <RemoveIcon/>,
                action: onRemove
            })
        }

        openContext(options, { x: e.pageX, y: e.pageY }, true)
    }

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = () => {
        setState((state) => ({ ...state, isOpen: !state.isOpen }))
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState((state) => ({ ...state, header: e.target.value }))
    }

    const handleLoseFocus = (): void => {
        if (state.header !== header) {
            onChange?.(state.header)
        }
        setState((state) => ({ ...state, isEdit: false }))
    }

    const handleDragOver = (e: React.DragEvent<HTMLInputElement>): void => {
        if (onDrag !== undefined && onDrag(window.dragData)) {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    const handleDragEnter = (e: React.DragEvent<HTMLInputElement>): void => {
        if (onDrag !== undefined && onDrag(window.dragData)) {
            e.preventDefault()
            e.stopPropagation()
            setState({ ...state, highlight: true })
        }
    }

    const handleDragLeave = (e: React.DragEvent<HTMLInputElement>): void => {
        if (onDrag !== undefined && onDrag(window.dragData)) {
            e.preventDefault()
            setState({ ...state, highlight: false })
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLInputElement>): void => {
        if (onDrag !== undefined && onDrop !== undefined && onDrag(window.dragData)) {
            e.preventDefault()
            e.stopPropagation()
            onDrop(window.dragData)
        }
    }

    return <>
        <div
            className={styles.collapsibleGroup}
            data={state.isOpen ? 'open' : 'closed'}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            <Tooltip title={<LocalizedText id={tooltipsId}/>}>
                <button
                    onClick={handleClick}
                    onContextMenu={handleContextMenu}>
                    {state.isEdit && onChange !== undefined
                        ? <input
                            className={styles.headerInput}
                            value={state.header}
                            onChange={handleChange}
                            onBlur={handleLoseFocus}
                            autoFocus/>
                        : header
                    }
                </button>
            </Tooltip>
        </div>
        { state.isOpen && children }
    </>
}

export default CollapsibleGroup
