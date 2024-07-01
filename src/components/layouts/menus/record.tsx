import { useMemo } from 'react'
import ListTemplateMenu, { type ListTemplateComponentProps } from './template'
import { isKeyOf } from 'utils'

export type RecordComponentProps<T, P = any> = React.PropsWithRef<{
    itemKey: string
    value: T
    values: Record<string, T>
    params: P
    update: (key: string) => void
}>

type RecordMenuProps<T, P> = React.PropsWithRef<{
    className?: string
    itemClassName?: string
    values: Record<string, T>
    defaultValue: T
    placeholder?: string
    params: P
    Component: React.FC<RecordComponentProps<T, P>>
    EditComponent: React.FC<RecordComponentProps<T, P>>
    onChange?: (selection: Record<string, T>) => void
}>

type RecordMenuComponentParams<T, P> = React.PropsWithRef<{
    itemClassName?: string
    placeholder?: string
    values: Record<string, T>
    Component: React.FC<RecordComponentProps<T, P>>
    EditComponent: React.FC<RecordComponentProps<T, P>>
    params: P
}>

function RecordMenu<T, P>(props: RecordMenuProps<T, P>): React.ReactNode {
    const { className, values, defaultValue, onChange } = props
    const listValues = useMemo(() => Object.keys(values), [values])

    const handleChange = (newValues: string[]): void => {
        if (onChange === undefined) {
            return
        }

        const transferred: Record<string, T> = { }
        // check if new key was added, potential change key
        let newKey: string | null = null
        for (const key of newValues) {
            transferred[key] = values[key] ?? defaultValue
            if (!(key in values)) {
                newKey = key
            }
        }
        // transfer value
        if (newKey !== null) {
            const oldKey = listValues.find((val) => !newValues.includes(val)) ?? null
            if (oldKey !== null) {
                // old key found
                transferred[newKey] = values[oldKey]
            }
        }

        onChange(transferred)
    }

    const handleValidate = (value: string): boolean => {
        return value.length > 0 && !isKeyOf(value, values)
    }

    return (
        <ListTemplateMenu<string, string, RecordMenuComponentParams<T, P>>
            className={className}
            defaultValue=''
            values={listValues}
            createValue={String}
            onChange={handleChange}
            validateInput={handleValidate}
            Component={ItemComponent<T, P>}
            EditComponent={EditComponent<T, P>}
            params={props}
            addLast/>
    )
}

function ItemComponent<T, P>({ value, params: { Component, values, itemClassName, params }, onUpdate }: ListTemplateComponentProps<string, string, RecordMenuComponentParams<T, P>>): React.ReactNode {
    return (
        <div className={itemClassName}>
            <Component itemKey={value} value={values[value]} values={values} params={params} update={onUpdate}/>
        </div>
    )
}

function EditComponent<T, P>({ value, onUpdate, params: { EditComponent, values, itemClassName, params } }: ListTemplateComponentProps<string, string, RecordMenuComponentParams<T, P>>): React.ReactNode {
    return (
        <div className={itemClassName}>
            <EditComponent itemKey={value} value={values[value]} values={values} params={params} update={onUpdate}/>
        </div>
    )
}

export default RecordMenu
