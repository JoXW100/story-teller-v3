import { useEffect, useState } from 'react'
import { isObjectId } from 'utils'
import Logger from 'utils/logger'
import Communication from 'utils/communication'
import type { DocumentType } from 'structure/database'
import type { DocumentTypeMap } from 'structure/database/files/factory'
import type { ObjectId } from 'types'
import type DatabaseFile from 'structure/database/files'

type FileState<T extends DatabaseFile> = [file: T | null, loading: boolean]
type FilesState<T extends DatabaseFile> = [files: Array<T | null>, loading: boolean]

export function useFilesOfType<T extends readonly DocumentType[]>(fileIDs: Array<ObjectId | null>, allowedTypes: T): FilesState<DocumentTypeMap[T[number]]> {
    const [state, setState] = useState<FilesState<DocumentTypeMap[T[number]]>>(
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

export function useFileOfType<T extends readonly DocumentType[]>(fileID: ObjectId | null, allowedTypes: T): FileState<DocumentTypeMap[T[number]]> {
    const [state, setState] = useState<FileState<DocumentTypeMap[T[number]]>>([null, true])
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

export function useFile(fileID: ObjectId | null): FileState<DatabaseFile> {
    const [state, setState] = useState<FileState<DatabaseFile>>([null, true])
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
