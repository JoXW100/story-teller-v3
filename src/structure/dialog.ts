import type { CreateFilePopupData } from 'components/dialogs/createFile'
import type { ObjectId } from 'types'
import type { IDatabaseFile } from 'types/database'
import type { DialogDetails, IConfirmationDialogPromise, ICreateFileDialogPromise, IDialogPromise, IManageConditionsDialogPromise, ISelectFileDialogPromise } from 'types/dialog'

export class DialogPromise<T extends IDialogPromise = IDialogPromise> implements IDialogPromise {
    protected readonly handlers: Partial<Record<keyof T, ((...args: never[]) => void) | null>> = {}

    public onClose(handler: () => void): this {
        this.handlers.onClose = handler
        return this
    }

    public invoke<K extends keyof T>(event: K, ...args: never[]): void {
        this.handlers[event]?.(...args)
    }

    public static isNoticePromise(dialog: DialogDetails): dialog is DialogDetails<'notice'> & { promise: DialogPromise } {
        return dialog.show && dialog.type === 'notice'
    }
}

export class ConfirmationPromise extends DialogPromise<IConfirmationDialogPromise> implements IConfirmationDialogPromise {
    public onCancel(handler: () => void): this {
        this.handlers.onCancel = handler
        return this
    }

    public onConfirm(handler: () => void): this {
        this.handlers.onConfirm = handler
        return this
    }

    public static isConfirmationPromise(dialog: DialogDetails): dialog is DialogDetails<'confirmation'> & { promise: ConfirmationPromise } {
        return dialog.show && dialog.type === 'confirmation'
    }
}

export class CreateFilePromise extends DialogPromise<ICreateFileDialogPromise> implements ICreateFileDialogPromise {
    public onConfirm(handler: (data: CreateFilePopupData) => void): this {
        this.handlers.onConfirm = handler
        return this
    }

    public static isCreateFilePromise(dialog: DialogDetails): dialog is DialogDetails<'createFile'> & { promise: CreateFilePromise } {
        return dialog.show && dialog.type === 'createFile'
    }
}

export class SelectFilePromise extends DialogPromise<ISelectFileDialogPromise> implements ISelectFileDialogPromise {
    public onSelect(handler: (data: IDatabaseFile) => void): this {
        this.handlers.onSelect = handler
        return this
    }

    public static isSelectFilePromise(dialog: DialogDetails): dialog is DialogDetails<'selectFile'> & { promise: SelectFilePromise } {
        return dialog.show && dialog.type === 'selectFile'
    }
}

export class ManageConditionsDialogPromise extends DialogPromise<IManageConditionsDialogPromise> implements IManageConditionsDialogPromise {
    public onConfirm(handler: (data: ObjectId[]) => void): this {
        this.handlers.onConfirm = handler
        return this
    }

    public static isManageConditionsDialogPromise(dialog: DialogDetails): dialog is DialogDetails<'manageConditions'> & { promise: ManageConditionsDialogPromise } {
        return dialog.show && dialog.type === 'manageConditions'
    }
}
