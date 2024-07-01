import ListTemplateMenu, { type ListTemplateComponentProps } from './template'
import styles from './list.module.scss'

interface IListMenuProps<A, B, T extends string> {
    values: A[]
    type: T
    defaultValue: B
    createValue: (value: B) => A
    createInput: (value: A) => B
    createComponent?: (value: A, values: A[]) => React.ReactNode
    validateInput?: (value: B, values: A[]) => boolean
    onChange?: (selection: A[]) => void
}

type ListMenuProps<T> = React.PropsWithRef<{
    className?: string
    itemClassName?: string
    editEnabled: boolean
    placeholder?: string
    addLast?: boolean
} & (IListMenuProps<T, string, 'string'> | IListMenuProps<T, number, 'number'>)>

type ListMenuComponentParams<T> = React.PropsWithRef<{
    itemClassName?: string
    placeholder?: string
    type: ListMenuProps<any>['type']
    editEnabled: boolean
    createValue: (value: string | number) => T
    createInput: (value: T) => string | number
    createComponent?: (value: T, values: T[]) => React.ReactNode
}>

function ListMenu<T>({ className, itemClassName, values, type, defaultValue, editEnabled = false, placeholder, addLast, createValue, createInput, createComponent, validateInput, onChange }: ListMenuProps<T>): React.ReactNode {
    const handleCreateValue = (value: string | number): T => {
        if (type === 'string') {
            return createValue(String(value))
        } else {
            return createValue(Number(value))
        }
    }

    const handleValidateInput = (value: string | number, values: T[]): boolean => {
        if (validateInput === undefined) {
            return true
        }
        if (type === 'string') {
            return validateInput(String(value), values)
        } else {
            return validateInput(Number(value), values)
        }
    }

    return (
        <ListTemplateMenu<T, string | number, ListMenuComponentParams<T>>
            className={className}
            defaultValue={defaultValue}
            values={values}
            addLast={addLast}
            createValue={handleCreateValue}
            validateInput={handleValidateInput}
            onChange={onChange}
            Component={Component<T>}
            EditComponent={EditComponent<T>}
            params={{
                itemClassName: itemClassName,
                placeholder: placeholder,
                type: type,
                editEnabled: editEnabled,
                createValue: createValue as ListMenuComponentParams<T>['createValue'],
                createInput: createInput,
                createComponent: createComponent
            }}/>
    )
}

function Component<T>({ value, values, onUpdate, params, ...other }: ListTemplateComponentProps<T, T, ListMenuComponentParams<T>>): React.ReactNode {
    if (params.editEnabled) {
        const handleUpdate = (value: string | number): void => {
            onUpdate(params.createValue(value))
        }

        return EditComponent<T>({ ...other, value: params.createInput(value), values: values, onUpdate: handleUpdate, params: params })
    } else {
        return (
            <div className={params.itemClassName}>
                {params.createComponent?.(value, values) ?? String(value)}
            </div>
        )
    }
}

function EditComponent<T>({ value, onUpdate, params }: ListTemplateComponentProps<T, string | number, ListMenuComponentParams<T>>): React.ReactNode {
    const style = params.itemClassName !== undefined ? `${params.itemClassName} ${styles.input}` : styles.input

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (params.type === 'number') {
            const value = Number(e.target.value)
            onUpdate((isNaN(value) ? 0 : value))
        } else {
            onUpdate(e.target.value)
        }
    }

    return (
        <input
            className={style}
            value={value}
            type={params.type}
            placeholder={params.placeholder}
            onChange={handleChange}/>
    )
}

export default ListMenu
