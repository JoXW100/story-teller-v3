import React, { useContext, useMemo } from 'react'
import Folder from './folder'
import File from './file'
import { InputTypeDataMap } from '../../dialogs/createFile'
import { openContext } from '../contextMenu'
import { Context, type FileFilter } from 'components/layouts/fileSystem/context'
import { isKeyOf, keysOf } from 'utils'
import { FileType } from 'structure/database'
import FileStructure from 'structure/database/fileStructure'
import type { ObjectId } from 'types'
import type { IFileStructure } from 'types/database'
import styles from './style.module.scss'

function checkFilers(structure: IFileStructure, filter: FileFilter): boolean {
    return ((!isKeyOf(structure.type, filter) || filter[structure.type]) &&
        (filter.search.length === 0 || structure.name.toLowerCase().includes(filter.search.toLowerCase()))) ||
        structure.children.some((child) => checkFilers(child, filter))
}

function buildFileStructure(file: IFileStructure): React.ReactNode {
    if (file.type === FileType.Folder) {
        return (
            <Folder key={String(file.id)} file={file}>
                { file.children?.map(buildFileStructure) }
            </Folder>
        )
    } else {
        return (
            <File key={String(file.id)} file={file}/>
        )
    }
}

function createFileStructure(root: IFileStructure, visible: Set<ObjectId>): FileStructure {
    const children: FileStructure[] = []
    for (const child of root.children) {
        if (visible.has(child.id)) {
            children.push(createFileStructure(child, visible))
        }
    }
    return new FileStructure({
        ...root,
        children: children.sort((a, b) => {
            if (a.type === FileType.Folder && b.type !== FileType.Folder) {
                return -1
            } else if (a.type !== FileType.Folder && b.type === FileType.Folder) {
                return 1
            } else {
                return a.name.localeCompare(b.name)
            }
        })
    })
}

function sortFileStructure(root: IFileStructure, filter: FileFilter): IFileStructure {
    const visible = new Set<ObjectId>()
    const parents: Record<ObjectId, ObjectId> = {}
    const queue = [...root.children]
    while (queue.length > 0) {
        const structure = queue.pop()!
        if (checkFilers(structure, filter)) {
            if (filter.showEmptyFolders) {
                visible.add(structure.id)
                for (const child of structure.children) {
                    queue.push(child)
                }
                continue
            }
            if (structure.type === FileType.Folder) {
                for (const child of structure.children) {
                    queue.push(child)
                    parents[child.id] = structure.id
                }
            } else {
                visible.add(structure.id)
                let parent = structure.id
                while ((parent = parents[parent]) !== undefined && !visible.has(parent)) {
                    visible.add(parent)
                }
            }
        }
    }
    return createFileStructure(root, visible)
}

const FileMenu: React.FC = () => {
    const [context, dispatch] = useContext(Context)

    const handleContext = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault()
        e.stopPropagation()
        openContext(keysOf(InputTypeDataMap).map((type) => (
            {
                text: InputTypeDataMap[type].text,
                icon: InputTypeDataMap[type].icon,
                action: () => { dispatch.openCreateFileMenu(type) }
            }
        )), { x: e.pageX, y: e.pageY }, true)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
        e.stopPropagation()
        const file = window.dragData?.file
        if (file !== undefined && file !== null && file.holderId !== context.root.id) {
            e.preventDefault()
        }
    }

    const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
        if (window.dragData?.file !== undefined) {
            e.preventDefault()
            e.stopPropagation()
            if (window.dragData !== undefined) {
                window.dragData.target = null
            }
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
        if (window.dragData?.file !== undefined) {
            e.preventDefault()
            e.stopPropagation()

            const file = window.dragData?.file
            if (file !== undefined && file !== null && file.holderId !== context.root.id) {
                dispatch.moveFile(file, null)
            }

            window.dragData.target = null
            window.dragData.file = null
        }
    }

    const children = useMemo(() => {
        const sorted = sortFileStructure(context.root, context.filter).children
        return sorted.map(buildFileStructure)
    }, [context.root, context.filter])

    return (
        <div
            className={styles.body}
            onContextMenu={handleContext}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}>
            { children }
        </div>
    )
}

export default FileMenu
