import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import RemoveIcon from '@mui/icons-material/Remove'
import RenameIcon from '@mui/icons-material/DriveFileRenameOutline'
import CopyIcon from '@mui/icons-material/ContentCopySharp'
import OpenIcon from '@mui/icons-material/OpenInBrowserSharp'
import OpenInNewPageIcon from '@mui/icons-material/LaunchSharp'
import DuplicateIcon from '@mui/icons-material/DifferenceSharp'
import { openContext } from '../contextMenu'
import { Context as FileSystemContext } from './context'
import IconMap, { type IconParams } from 'assets/icons'
import { Context as AppContext } from 'components/contexts/app'
import Navigation from 'utils/navigation'
import { type DocumentFileType, DocumentType } from 'structure/database'
import type { IFileStructure } from 'types/database'
import styles from './fileStyle.module.scss'

type FileProps = React.PropsWithRef<{
    file: IFileStructure
}>

export function getFileIcon(type: DocumentFileType): React.FC<IconParams> {
    switch (type) {
        case DocumentType.Ability:
            return IconMap.ability
        case DocumentType.Character:
        case DocumentType.NPC:
            return IconMap.character
        case DocumentType.Class:
        case DocumentType.Subclass:
            return IconMap.class
        case DocumentType.Condition:
            return IconMap.condition
        case DocumentType.Creature:
            return IconMap.creature
        case DocumentType.Encounter:
            return IconMap.encounter
        case DocumentType.Spell:
            return IconMap.spell
        case DocumentType.Modifier:
            return IconMap.settings
        case DocumentType.Item:
            return IconMap.item
        case DocumentType.Race:
        case DocumentType.Subrace:
            return IconMap.character
        case DocumentType.Text:
        default:
            return IconMap.document
    }
}

const File: React.FC<FileProps> = ({ file }) => {
    const [app] = useContext(AppContext)
    const [context, dispatch] = useContext(FileSystemContext)
    const [state, setState] = useState({ inEditMode: false, text: file.name })
    const router = useRouter()
    const ref = useRef<HTMLInputElement | null>(null)
    const Icon = getFileIcon(file.type)
    const isSelected = useMemo(() => context.selected === file.id, [file.id, context.selected])
    const contextID = useMemo(() => `${file.id}-context-rename-item`, [file.id])

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e): void => {
        if (e.key === 'Enter') {
            dispatch.renameFile(file, state.text)
        } else if (e.key === 'Escape') {
            setState((state) => ({ ...state, text: file.name, inEditMode: false }))
        }
    }

    const handleDrag = (): void => {
        window.dragData = { file: file }
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState((state) => ({ ...state, text: e.target.value }))
    }

    const handleClick: React.MouseEventHandler<HTMLDivElement> = (): void => {
        if (!isSelected && !state.inEditMode) {
            void router.push(Navigation.fileURL(file.id))
        }
    }

    const handleContext = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault()
        e.stopPropagation()
        openContext([
            {
                text: 'fileSystem-file-open',
                icon: <OpenIcon/>,
                action: () => { void router.push(Navigation.fileURL(file.id)) }
            },
            {
                text: 'fileSystem-file-openNewTab',
                icon: <OpenInNewPageIcon/>,
                action: () => window.open(Navigation.fileURL(file.id))
            },
            {
                text: 'fileSystem-file-copyId',
                icon: <CopyIcon/>,
                action: () => { void navigator.clipboard.writeText(String(file.id)) }
            },
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
            },
            {
                text: 'fileSystem-file-createCopy',
                icon: <DuplicateIcon/>,
                action: () => { dispatch.copyFile(file, file.holderId, `${file.name} copy`) }
            }
        ], { x: e.pageX, y: e.pageY }, true)
    }, [dispatch, file, router, contextID])

    useEffect(() => {
        const handleEvent = (e: MouseEvent): void => {
            const target = e.target as HTMLInputElement
            if (target !== ref.current && target?.id !== contextID) {
                setState((state) => state.inEditMode ? ({ ...state, inEditMode: false }) : state)
            }
        }

        if (state.inEditMode) {
            ref.current?.select()
            window.addEventListener('click', handleEvent)
            window.addEventListener('contextmenu', handleEvent)
            return () => {
                window.removeEventListener('click', handleEvent)
                window.removeEventListener('contextmenu', handleEvent)
            }
        }
    }, [contextID, state.inEditMode])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent): void => {
            if (e.code === 'F2') {
                setState((state) => isSelected ? ({ ...state, inEditMode: true }) : state)
            }
        }

        if (isSelected) {
            window.addEventListener('keydown', handleKey, true)
            return () => {
                window.removeEventListener('keydown', handleKey, true)
            }
        }
    }, [isSelected])

    useEffect(() => {
        setState({ inEditMode: false, text: file.name })
    }, [file.name])

    const className = isSelected
        ? `${styles.file} ${styles.selected}`
        : styles.file

    return (
        <div
            className={className}
            onClick={handleClick}
            onDragStart={handleDrag}
            onContextMenu={handleContext}
            draggable={!state.inEditMode}
            data={app.enableColorFileByType ? file.type : undefined}>
            <Icon/>
            <input
                ref={ref}
                type='text'
                spellCheck='false'
                disabled={!state.inEditMode}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                value={state.text}/>
        </div>
    )
}

export default File
