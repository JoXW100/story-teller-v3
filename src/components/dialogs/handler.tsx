import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ConfirmationDialog from './confirmation'
import NoticeDialog from './notice'
import CreateFileDialog from './createFile'
import Logger from 'utils/logger'
import { ConfirmationPromise, DialogPromise, CreateFilePromise, SelectFilePromise } from 'structure/dialog'
import type { DialogTypeMap, DialogDetails } from 'types/dialog'
import SelectFileDialog from './selectFile'

function createDialogPromise<K extends keyof DialogTypeMap>(type: K): DialogTypeMap[K]['promise'] {
    switch (type) {
        case 'confirmation':
            return new ConfirmationPromise()
        case 'createFile':
            return new CreateFilePromise()
        case 'selectFile':
            return new SelectFilePromise()
        case 'notice':
        default:
            return new DialogPromise()
    }
}

export function openDialog<K extends keyof DialogTypeMap>(type: K, params: DialogTypeMap[K]['params']): DialogTypeMap[K]['promise'] {
    const promise = createDialogPromise(type)
    if (document !== undefined) {
        document.dispatchEvent(new CustomEvent<DialogDetails<K>>('dialog', {
            bubbles: true,
            detail: {
                show: true,
                id: params.id,
                type: type,
                params: params,
                promise: promise
            } as any
        }))
    }

    return promise
}

export const closeDialog = (id: string | null): void => {
    if (document !== undefined) {
        document.dispatchEvent(new CustomEvent<DialogDetails>('dialog', {
            bubbles: true,
            detail: {
                show: false,
                id: id
            }
        }))
    }
}

const DialogHandler: React.FC = () => {
    const router = useRouter()
    const [dialogs, setDialogs] = useState<Record<string, DialogDetails>>({})

    const dialogHandler = (e: CustomEvent<DialogDetails>): void => {
        if (e.detail.show) {
            e.stopPropagation()
            setDialogs((dialogs) => {
                if (e.detail.id !== null) {
                    return { ...dialogs, [e.detail.id]: e.detail }
                }
                return dialogs
            })
        }
    }

    useEffect(() => {
        document.addEventListener('dialog', dialogHandler)
        return () => { document.removeEventListener('dialog', dialogHandler) }
    }, [])

    useEffect(() => {
        closeDialog(null)
    }, [router.route])

    return (
        Object.keys(dialogs).map((key) => {
            const dialog = dialogs[key]
            if (!dialog.show) {
                return null
            }

            switch (dialog.type) {
                case 'confirmation':
                    return <ConfirmationDialog key={key} {...dialog.params} callback={(type, ...args) => {
                        setDialogs(dialogs => {
                            const { [key]: _, ...rest } = dialogs
                            return rest
                        })
                        if (ConfirmationPromise.isConfirmationPromise(dialog)) {
                            dialog.promise.invoke(type, ...args)
                        }
                    }} />
                case 'createFile':
                    return <CreateFileDialog key={key} {...dialog.params} callback={(type, ...args) => {
                        setDialogs(dialogs => {
                            const { [key]: _, ...rest } = dialogs
                            return rest
                        })
                        if (CreateFilePromise.isCreateFilePromise(dialog)) {
                            dialog.promise.invoke(type, ...args)
                        }
                    }} />
                case 'selectFile':
                    return <SelectFileDialog key={key} {...dialog.params} callback={(type, ...args) => {
                        setDialogs(dialogs => {
                            const { [key]: _, ...rest } = dialogs
                            return rest
                        })
                        if (SelectFilePromise.isSelectFilePromise(dialog)) {
                            dialog.promise.invoke(type, ...args)
                        }
                    }} />
                case 'notice':
                    return <NoticeDialog key={key} {...dialog.params} callback={(type, ...args) => {
                        setDialogs(dialogs => {
                            const { [key]: _, ...rest } = dialogs
                            return rest
                        })
                        if (DialogPromise.isNoticePromise(dialog)) {
                            dialog.promise.invoke(type, ...args)
                        }
                    }} />
                default:
                    Logger.warn('DialogHandler', 'Unknown dialog type', dialog)
                    return null
            }
        })
    )
}

export default DialogHandler
