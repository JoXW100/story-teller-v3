import DropdownMenu from '../dropdownMenu'
import ListTemplateMenu, { type ListTemplateComponentProps } from './template'
import { asNumber } from 'utils'
import styles from './selection.module.scss'

interface INoneSelectionMenuProps {
    values: string[]
    type: 'none'
    onChange?: (selection: string[]) => void
}

interface IStringSelectionMenuProps {
    values: Record<string, string>
    defaultValue: string
    type: 'string'
    onChange?: (selection: Record<string, string>) => void
}

interface INumberSelectionMenuProps {
    values: Record<string, number>
    defaultValue: number
    type: 'number'
    onChange?: (selection: Record<string, number>) => void
}

interface IEnumSelectionMenuProps<V> {
    values: Record<string, V>
    defaultValue: string
    type: 'enum'
    editOptions: Record<string, React.ReactNode>
    onChange?: (selection: Record<string, V>) => void
}

type SelectionMenuProps = React.PropsWithRef<{
    className?: string
    componentClassName?: string
    dropdownClassName?: string
    options: Record<string, React.ReactNode>
    addLast?: boolean
} & (IStringSelectionMenuProps | IEnumSelectionMenuProps<string> | INumberSelectionMenuProps | INoneSelectionMenuProps)>

const SelectionMenu: React.FC<SelectionMenuProps> = (params) => {
    const style = params.className !== undefined ? `${styles.list} ${params.className}` : styles.list
    const valuesList = params.type === 'none' ? params.values : Object.keys(params.values)
    const defaultSelection = Object.keys(params.options).find((key) => !valuesList.includes(key)) ?? null

    const handleChange = (newValues: string[]): void => {
        if (params.type === 'none') {
            params.onChange?.(newValues)
        } else {
            params.onChange?.(newValues.reduce((prev, value) => (
                { ...prev, [value]: params.values[value] ?? params.defaultValue }
            ), {}))
        }
    }

    const validate = (): boolean => {
        return defaultSelection !== null
    }

    return (
        <ListTemplateMenu
            className={style}
            defaultValue={defaultSelection ?? ''}
            values={valuesList}
            addLast={params.addLast}
            params={params}
            createValue={String}
            onChange={handleChange}
            validateInput={validate}
            Component={Component}
            EditComponent={EditComponent}/>
    )
}

const EditComponent: React.FC<ListTemplateComponentProps<string, string, SelectionMenuProps>> = ({ value, values: selected, params }) => {
    const style = params.dropdownClassName !== undefined ? `${styles.dropdown} ${params.dropdownClassName}` : styles.dropdown

    const handleChange = (value: string): void => {
        if (params.type === 'number') {
            params.onChange?.({ ...params.values, [value]: params.defaultValue })
        } else if (params.type !== 'none') {
            params.onChange?.({ ...params.values, [value]: params.defaultValue })
        } else {
            params.onChange?.(params.addLast === true ? [...params.values, value] : [value, ...params.values])
        }
    }

    return (
        <DropdownMenu
            className={style}
            values={params.options}
            exclude={selected}
            value={value}
            onChange={handleChange}/>
    )
}

const Component: React.FC<ListTemplateComponentProps<string, string, SelectionMenuProps>> = ({ value, params }) => {
    const style = params.dropdownClassName !== undefined ? `${styles.dropdown} ${params.dropdownClassName}` : styles.dropdown

    const handleChange = (input: string): void => {
        if (params.type === 'number') {
            params.onChange?.({ ...params.values, [value]: asNumber(input, 0) })
        } else if (params.type !== 'none') {
            params.onChange?.({ ...params.values, [value]: input })
        }
    }

    return (
        <div className={params.componentClassName}>
            <b>{params.options[value]}</b>
            {params.type !== 'none' && params.type !== 'enum' &&
                <input
                    type={params.type}
                    value={params.values[value]}
                    onChange={(e) => { handleChange(e.target.value) }}/>
            }
            {params.type === 'enum' &&
                <DropdownMenu
                    className={style}
                    value={params.values[value] ?? params.defaultValue}
                    values={params.editOptions ?? {}}
                    onChange={handleChange}/>
            }
        </div>
    )
}

export default SelectionMenu
