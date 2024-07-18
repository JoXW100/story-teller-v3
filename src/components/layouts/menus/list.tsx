import ListTemplateMenu, { type ListTemplateComponentProps } from './template'
import styles from './list.module.scss'
import DropdownMenu from '../dropdownMenu'
import { asKeyOf } from 'utils'

interface IListMenuProps<A, T extends string> {
    className?: string
    itemClassName?: string
    values: A[]
    type: T
    defaultValue: A
    editEnabled?: boolean
    placeholder?: string
    addLast?: boolean
    disabled?: boolean
    createComponent?: (value: A, values: A[]) => React.ReactNode
    validateInput?: (value: A, values: A[]) => boolean
    onChange?: (selection: A[]) => void
}
interface IListMenuEnumProps<O extends Record<string | number | symbol, React.ReactNode>> {
    className?: string
    itemClassName?: string
    values: Array<keyof O>
    type: 'enum'
    options: O
    defaultValue: keyof O
    editEnabled?: boolean
    addLast?: boolean
    disabled?: boolean
    createComponent?: (value: keyof O, values: Array<keyof O>) => React.ReactNode
    validateInput?: (value: keyof O, values: Array<keyof O>) => boolean
    onChange?: (selection: Array<keyof O>) => void
}

type ListMenuPropsType = IListMenuProps<string, 'string'> | IListMenuProps<number, 'number'> | IListMenuEnumProps<Record<string | number | symbol, React.ReactNode>>
type ListMenuProps = React.PropsWithRef<ListMenuPropsType>

const ListMenu: React.FC<ListMenuProps> = (props: ListMenuProps) => {
    const handleCreateValue = (value: ListMenuProps['defaultValue']): ListMenuProps['defaultValue'] => {
        switch (props.type) {
            case 'string':
                return String(value)
            case 'number':
                return Number(value)
            case 'enum':
                return asKeyOf(value, props.options) ?? props.defaultValue
        }
    }

    const handleValidateInput = (value: ListMenuProps['defaultValue'], values: ListMenuProps['values']): boolean => {
        if (props.disabled === true) {
            return false
        }
        if (props.validateInput === undefined) {
            return true
        }
        switch (props.type) {
            case 'string':
                return props.validateInput(value as string, values as string[])
            case 'number':
                return props.validateInput(value as number, values as number[])
            case 'enum':
                return props.validateInput(value, values)
        }
    }

    return (
        <ListTemplateMenu
            className={props.className}
            defaultValue={props.defaultValue}
            values={props.values}
            addLast={props.addLast}
            createValue={handleCreateValue}
            validateInput={handleValidateInput}
            onChange={props.onChange}
            Component={Component}
            EditComponent={EditComponent}
            params={props}/>
    )
}

const Component: React.FC<ListTemplateComponentProps<any, any, ListMenuPropsType>> = ({ value, values, params, ...other }): React.ReactNode => {
    if (params.editEnabled === true) {
        return EditComponent({ ...other, value: value, values: values, params: params })
    } else {
        return (
            <div className={params.itemClassName}>
                {params.type === 'enum' && (params.createComponent?.(value, values) ?? params.options[value] ?? String(value)) }
                {params.type === 'number' && (params.createComponent?.(value, values) ?? Number(value)) }
                {params.type === 'string' && (params.createComponent?.(value, values) ?? String(value)) }
            </div>
        )
    }
}

const EditComponent: React.FC<ListTemplateComponentProps<any, any, ListMenuPropsType>> = ({ value, values, onUpdate, params }) => {
    const style = params.itemClassName !== undefined ? `${params.itemClassName} ${styles.input}` : styles.input

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (params.type === 'number') {
            const value = Number(e.target.value)
            onUpdate((isNaN(value) ? 0 : value))
        } else if (params.type === 'string') {
            onUpdate(e.target.value)
        }
    }

    if (params.type === 'enum') {
        return (
            <DropdownMenu
                value={value}
                values={params.options}
                exclude={values}
                onChange={onUpdate}
                disabled={params.disabled}/>
        )
    } else {
        return (
            <input
                className={style}
                value={value}
                type={params.type}
                placeholder={params.placeholder}
                onChange={handleChange}
                disabled={params.disabled}/>
        )
    }
}

export default ListMenu
