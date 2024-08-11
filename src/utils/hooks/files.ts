import { useEffect, useState } from 'react'
import { isObjectId } from 'utils'
import Logger from 'utils/logger'
import Communication from 'utils/communication'
import type { DocumentFileType, DocumentType } from 'structure/database'
import type { DocumentTypeMap } from 'structure/database/files/factory'
import type { ObjectId } from 'types'

type FileState<T extends DocumentFileType> = [file: DocumentTypeMap[T] | null, loading: boolean]
type FilesState<T extends DocumentFileType> = [files: Array<DocumentTypeMap[T] | null>, loading: boolean]

export function useFilesOfType<T extends readonly DocumentType[]>(fileIDs: Array<ObjectId | null>, allowedTypes: T): FilesState<T[number]> {
    const [state, setState] = useState<FilesState<T[number]>>(
        [Array.from({ length: fileIDs.length }).map(() => null), true]
    )
    useEffect(() => {
        const values = Array.from({ length: fileIDs.length }).map<DocumentTypeMap[T[number]] | null>(() => null)
        const [validIds, indices] = fileIDs.reduce<[ObjectId[], number[]]>((prev, id, i) => isObjectId(id)
            ? [[...prev[0], id], [...prev[1], i]] // If valid id, add to validIds that are queried and add the index to indices for
            : prev, [[], []])
        if (fileIDs.length > 0 && allowedTypes.length > 0) {
            Communication.getFilesOfTypes(validIds, allowedTypes)
                .then((res) => {
                    if (res.success) {
                        const documents = Object.values(res.result)
                        for (let i = 0; i < documents.length; i++) {
                            values[indices[i]] = documents[i]
                        }
                    }
                }, (e: unknown) => {
                    Logger.throw('useFilesOfType', e)
                }).finally(() => {
                    setState([values, false])
                })
        } else {
            setState([values, false])
        }
    }, [fileIDs, allowedTypes])
    return state
}

export function useFileOfType<T extends readonly DocumentType[]>(fileID: ObjectId | null, allowedTypes: T): FileState<T[number]> {
    const [state, setState] = useState<FileState<T[number]>>([null, true])
    useEffect(() => {
        if (isObjectId(fileID) && allowedTypes.length > 0) {
            Communication.getFileOfTypes(fileID, allowedTypes)
                .then((res) => {
                    setState([res.success ? res.result : null, false])
                }, (e: unknown) => {
                    Logger.throw('useFileOfType', e)
                    setState([null, false])
                })
        } else {
            setState([null, false])
        }
    }, [fileID, allowedTypes])
    return state
}

export function useFile(fileID: ObjectId | null): FileState<DocumentFileType> {
    const [state, setState] = useState<FileState<DocumentFileType>>([null, true])
    useEffect(() => {
        if (isObjectId(fileID)) {
            Communication.getFile(fileID)
                .then((res) => {
                    setState([res.success ? res.result : null, false])
                }, (e: unknown) => {
                    Logger.throw('useFile', e)
                    setState([null, false])
                })
        } else {
            setState([null, false])
        }
    }, [fileID])
    return state
}

export function useSubFiles<T extends DocumentType>(parentId: ObjectId | null, type: T): FilesState<T> {
    const [state, setState] = useState<FilesState<T>>([[], true])
    useEffect(() => {
        if (isObjectId(parentId)) {
            Communication.getSubFiles(parentId, type)
                .then((res) => {
                    setState([res.success ? res.result : [], false])
                }, (e: unknown) => {
                    Logger.throw('useSubclasses', e)
                    setState([[], false])
                })
        } else {
            setState([[], false])
        }
    }, [parentId, type])
    return state
}

export function useAbilitiesOfCategory(category: string): FilesState<DocumentType.Ability> {
    const [state, setState] = useState<FilesState<DocumentType.Ability>>([[], true])
    useEffect(() => {
        Communication.getAbilitiesOfCategory(category)
            .then((res) => {
                setState([res.success ? res.result : [], false])
            }, (e: unknown) => {
                Logger.throw('useAbilitiesOfCategory', e)
                setState([[], false])
            })
    }, [category])
    return state
}
