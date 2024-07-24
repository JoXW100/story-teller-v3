import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import IconClosed from '@mui/icons-material/FolderSharp'
import IconOpen from '@mui/icons-material/FolderOpenSharp'
import RemoveIcon from '@mui/icons-material/Remove'
import RenameIcon from '@mui/icons-material/DriveFileRenameOutline'
import { openContext } from '../contextMenu'
import { InputTypeDataMap } from '../../dialogs/createFile'
import { Context as AppContext } from 'components/contexts/app'
import { Context } from './context'
import { isObjectId, keysOf } from 'utils'
import type { ObjectId } from 'types'
import type { IFileStructure } from 'types/database'
import styles from './fileStyle.module.scss'

type FolderProps = React.PropsWithChildren<{
    file: IFileStructure
}>

function hasSelectedChild(file: IFileStructure, fileId: ObjectId): boolean {
    return file.id === fileId || file.children.some(x => hasSelectedChild(x, fileId))
}

function containsFile(file: IFileStructure, holder: IFileStructure): boolean {
    return file.id === holder.id || holder.children.some(x => containsFile(file, x))
}

const Folder: React.FC<FolderProps> = ({ file, children }) => {
    const [app] = useContext(AppContext)
    const [, dispatch] = useContext(Context)
    const [state, setState] = useState({
        open: Boolean(file.open),
        highlight: false,
        inEditMode: false,
        text: file.name
    })
    const router = useRouter()
    const ref = useRef<HTMLInputElement | null>(null)
    const contextID = String(file.id) + '-context-rename-item'
    const Icon = useMemo(() => state.open ? IconOpen : IconClosed, [state.open])
    const containsSelected = useMemo(() => {
        const selected = router.query?.fileId
        return isObjectId(selected) && hasSelectedChild(file, selected)
    }, [file, router.query])

    const cancelEdit = (): void => {
        setState((state) => ({ ...state, inEditMode: false }))
    }

    const breakEdit = (): void => {
        setState((state) => ({ ...state, text: file.name, inEditMode: false }))
    }

    const changeState = (): void => {
        if (!state.inEditMode) {
            const value = { ...state, open: !state.open }
            setState(value)
            dispatch.setFileOpen(file, value.open)
        }
    }

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e): void => {
        if (e.key === 'Enter') {
            cancelEdit()
        } else if (e.key === 'Escape') {
            breakEdit()
        }
    }

    const handleEvent = useCallback((e: MouseEvent): void => {
        const target = e.target as HTMLInputElement
        if (state.inEditMode && target !== ref.current && target?.id !== contextID) {
            cancelEdit()
        }
    }, [contextID, state.inEditMode])

    const handleContext = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
        e.preventDefault()
        e.stopPropagation()
        openContext([
            ...keysOf(InputTypeDataMap).map((type) => (
                {
                    text: InputTypeDataMap[type].text,
                    icon: InputTypeDataMap[type].icon,
                    action: () => { dispatch.openCreateFileMenu(type, file.id) }
                }
            )),
            {
                text: 'common-rename',
                icon: <RenameIcon/>,
                id: contextID,
                action: () => { setState((state) => ({ ...state, inEditMode: true })) }
            },
            {
                text: 'common-delete',
                icon: <RemoveIcon/>,
                action: () => { dispatch.openDeleteFileMenu(file) }
            }
        ], { x: e.pageX, y: e.pageY }, true)
    }, [contextID, dispatch, file])

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        if (window.dragData?.file !== undefined) {
            e.preventDefault()
            e.stopPropagation()
            const drag: IFileStructure | null = window.dragData.file
            if (drag !== null && drag.holderId !== file.id && !containsFile(file, drag)) {
                dispatch.moveFile(drag, file)
            }
            window.dragData.target = null
            window.dragData.file = null
            setState((state) => ({ ...state, highlight: false }))
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.stopPropagation()
        const drag = window.dragData?.file
        if (drag !== undefined && drag !== null && drag.id !== file.id && file.children.every(x => x.id !== drag.id)) {
            e.preventDefault()
        }
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>): void => {
        const drag = window.dragData?.file
        if (drag !== undefined) {
            e.preventDefault()
            e.stopPropagation()
            if (window.dragData.target !== file.id && drag !== null && drag.holderId !== file.id) {
                window.dragData.target = file.id
                setState((state) => ({ ...state, highlight: true }))
            }
        }
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
        if (window.dragData?.file !== undefined) {
            e.preventDefault()
            if (window.dragData.target !== file.id) {
                setState((state) => ({ ...state, highlight: false }))
            }
        }
    }

    const handleDrag = (): void => {
        window.dragData = {
            file: file
        }
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState({ ...state, text: e.target.value })
    }

    useEffect(() => {
        if (!state.inEditMode) {
            setState((state) => {
                if (state.text === file.name) {
                    return state
                }
                dispatch.renameFile(file, state.text)
                return { ...state, text: state.text, inEditMode: false }
            })
        }
    }, [dispatch, file, state.inEditMode])

    useEffect(() => {
        if (state.inEditMode) {
            ref.current?.select()
            window.addEventListener('click', handleEvent)
            window.addEventListener('contextmenu', handleEvent)
            return () => {
                window.removeEventListener('click', handleEvent)
                window.removeEventListener('contextmenu', handleEvent)
            }
        }
    }, [state.inEditMode, handleEvent])

    const className = !state.open && containsSelected
        ? `${styles.folder} ${styles.selected}`
        : styles.folder

    return (
        <div
            className={styles.folderHolder}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnter={handleDragEnter}
            onDrop={handleDrop}
            data={state.highlight ? 'highlight' : undefined}>
            <button
                className={className}
                onClick={changeState}
                onDragStart={handleDrag}
                onContextMenu={handleContext}
                data={app.enableColorFileByType ? file.type : undefined}
                value={state.open ? 'open' : 'closed'}
                draggable={!state.inEditMode}>
                <Icon/>
                <input
                    ref={ref}
                    type='text'
                    spellCheck='false'
                    disabled={!state.inEditMode}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    value={state.text}/>
            </button>
            { state.open && file.children.length > 0 && (
                <div className={styles.content}>
                    { children }
                </div>
            )}
        </div>
    )
}

export default Folder
